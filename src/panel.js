;
String.prototype.format = function (){if(arguments.length==0){return this}var a=arguments;return this.replace(/\{(\d+)\}/g,function(b,c){if(a[c]===undefined){return"{"+c+"}"}return a[c]})} ;
;

var secSearch, secHistory;
var searchBtn, clearBtn;
var secResult;
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
function renderResult( count ){
	if( !count ) {
		secResult.innerHTML = chrome.i18n.getMessage( 'noresult' );
	} else {
		secResult.innerHTML = chrome.i18n.getMessage( 'resultfound' ).format( count );
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
		renderResult( msg.count );
	}
}


onload = function(){
	init();
	bind();
};