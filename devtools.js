chrome.devtools.panels.create("Xpath Finder", "FontPicker.png", "xpath.html", function(panel) {
    var _window; // Going to hold the reference to panel.html's `window`

    var data = [];
    var port = chrome.extension.connect( { name: "xpathFinder" } );
    port.onMessage.addListener(function( msg ) {
        if ( _window ) {
            _window.renderResults( msg );
        } else {
            data.push(msg);
        }
    });

    //panel显示出来之后绑定事件
    //@todo 貌似在html里的JS都不会执行，只能在这里绑定事件
    panel.onShown.addListener(function tmp( win ) {
        panel.onShown.removeListener( tmp ); // Run once only
     
        _window = win;
        var document = win.document, 
            inputArea = document.getElementById( "xpath" ),
            searchBtn = document.getElementById( "search" ),
            historyArea = document.getElementById( "js-history" );

        searchBtn.onclick = function(){
            port.postMessage( {
                command: "findXpath", 
                xpath: inputArea.value, 
                tabId: chrome.devtools.inspectedWindow.tabId 
            });
        }

        historyArea.onclick = function( event ){
            var target = event.target;
            if( target.tagName === "A" && target.id != "js-clearHistory"){
                inputArea.value = target.innerHTML;
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


        win.renderResults = function( msg ){
            xpaths = msg.history;
            var history = document.getElementById( "js-history" ).getElementsByTagName( "ul" )[0];
            history.innerHTML = "";

            //重新渲染查询历史
            for( var xpath in xpaths ){
                history.innerHTML = "<li><a href='javascript:void(0)'>" + xpath + "</a></li>" + history.innerHTML;
            }

            if( !history.innerHTML ){
                history.innerHTML = "<span>No filter history.</span>";
            }

            //如果有结果返回，也渲染到UI
            if( msg.count ){
                document.getElementById( "js-result" ).innerHTML = msg.count + " results found."
            } else {
                document.getElementById( "js-result" ).innerHTML = "no results found."
            }
        }
        
        chrome.devtools.inspectedWindow.eval( "location.host", function( host ){
            port.postMessage( {
                command: "getHistory",
                host: host
            });
        })

        if( data.length > 0 ){
            win.renderResults( data );
        }
    });
});