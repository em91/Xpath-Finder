;
String.prototype.format = function (){if(arguments.length==0){return this}var a=arguments;return this.replace(/\{(\d+)\}/g,function(b,c){if(a[c]===undefined){return"{"+c+"}"}return a[c]})};
String.prototype.escapeHTML = function(){ return this.replace(/[\u0000]/g, "").replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
;


var secSearch, secHistory;
var searchBtn, clearBtn;
var secResult, secResultUl;
var xpathInput;

var $  = document.querySelector.bind( document ),
	$$ = document.querySelectorAll.bind( document );


/**
 * 历史记录读取等
 * @return {void} 
 */
function init(){
	secSearch = $( '#js-search' );
	secHistory = $( '#js-history' );
	secResult = $( '#js-result' );
	secResultUl = $( '#js-results' );
	searchBtn = $( '#js-searchBtn' );
	clearBtn = $( '#js-clearHistory' );
	xpathInput = $( 'input[name=xpath]' )
}


/**
 * 事件绑定
 * @return {void} 
 */
function bind(){
	searchBtn.addEventListener( 'click', onSearchBtnClick );
	secHistory.addEventListener( 'click', onHistoryClick );
	secResultUl.addEventListener( 'click', onResultClick );
	secResultUl.addEventListener( 'mouseover', onResultMouseOver );
}

/**
 * 移动到搜索结果上
 * @return {void} 
 */
function onResultMouseOver( event ){
	var target = event.target;
	var id = target.dataset.id;
	if( id ) {
		port.postMessage( {
	        command: "locateElement", 
	        id: id, 
	        tabId: chrome.devtools.inspectedWindow.tabId 
	    });
	}
}

/**
 * 点击搜索结果
 * @return {void} 
 */
function onResultClick( event ){
	var target = event.target;
	var id = target.dataset.id;

	if( id && target.className.match( /inspect/ ) ) {
	   	chrome.devtools.inspectedWindow.eval( '\
	   		try {\
	   			inspect( document.querySelector( ".chromeXpathFinder' + id + '" ) );\
	   			setTimeout(function(){\
	   				var hoverElement = document.querySelector( ".chromeXpathFinderHover" );\
	   				hoverElement.className = hoverElement.className.replace( /chromeXpathFinderHover/, "" ).trim();\
	   				var inspected = document.querySelector( ".chromeXpathFinder' + id + '" );\
	   				inspected.className += " chromeXpathFinderHover";\
	   			}, 300)\
	   		} catch ( e ) { }'
	   	);
	}
}

/**
 * 查找按钮点击，向页面postMessage
 * @return {void} 
 */
function onSearchBtnClick(){
    port.postMessage( {
        command: "findXpath", 
        xpath: xpathInput.value, 
        tabId: chrome.devtools.inspectedWindow.tabId 
    });

    new Image().src = 'http://em91.me/s.gif?p=xpathfinder&a=search&r=' + new Date().getTime();
}


/**
 * 历史记录点击，包含清空和查询历史
 * @param  {Event} event 
 * @return {void}       
 */
function onHistoryClick( event ){
	var target = event.target;

    if( target.tagName === "A" && target.id != "js-clearHistory"){
        xpathInput.value = target.innerHTML;
        searchBtn.click();
        new Image().src = 'http://em91.me/s.gif?p=xpathfinder&a=history&r=' + new Date().getTime();
    } else if ( target.id == "js-clearHistory" ){
        chrome.devtools.inspectedWindow.eval( "location.host", function( host ){
            port.postMessage( {
                command: "clearHistory",
                host: host
            });
        })
    }	
}


/**
 * 历史记录渲染
 * @param  {array} history 
 * @return {void}         
 */
function renderHistory( history ){
	var historyUl = $( '#js-history ul' );

	var htmlArr = [];

	for( var key in history ) {
		var xpath = key;
		var html = '<li><a href="javascript:void(0)">' + xpath + '</a></li>';
		htmlArr.push( html );
	};	

	if( htmlArr.length ) {
		historyUl.innerHTML = htmlArr.join( '' );
	} else {
		historyUl.innerHTML = '<span>' + chrome.i18n.getMessage( 'nohistory' ) + '</span>';
	}
}


/**
 * 渲染查询结果
 * @return {void} 
 */
function renderResult( count, elements ){
	secResultUl.innerHTML = "";

	if( !count ) {
		secResult.innerHTML = chrome.i18n.getMessage( 'noresult' );
	} else {
		secResult.innerHTML = chrome.i18n.getMessage( 'resultfound' ).format( count );
		var list = [];
		for (var i = 0, l = elements.length; i < l; i++) {
			var element = elements[i];
			var html = '<li class="js-element clearfix" data-id="' + i + '">\
				<a href="javascript:void(0)">' + element.escapeHTML() + '</a>\
				<a href="javascript:void(0)" data-id="' + i + '" class="inspect">检查</a>\
			</li>';
			list.push( html );
		};

		secResultUl.innerHTML += list.join( '' );
	}
}

/**
 * 渲染数据
 * @param  	{object} msg 
 * @example {"history":{"//div":5,"/div":4,"//div/span":1}}
 * @return 	{void}     
 */
function render( msg ){
	if( msg.history ) {
		renderHistory( msg.history );
	}

	if( msg.count != undefined ) {
		renderResult( msg.count, msg.elements );
	}
}


onload = function(){
	init();
	bind();
};