chrome.devtools.panels.create("Xpath Finder", "FontPicker.png", "xpath.html", function(panel) {
    var _window; // Going to hold the reference to panel.html's `window`

    var data = [];
    var port = chrome.extension.connect( { name: "xpathFinder" } );
    port.onMessage.addListener(function( msg ) {
        if (_window) {
            _window.renderResults( msg );
        } else {
            data.push(msg);
        }
    });

    //panel显示出来之后绑定事件
    //@todo 貌似在html里的JS都不会执行，只能在这里绑定事件
    panel.onShown.addListener(function tmp( win ) {
        panel.onShown.removeListener( tmp ); // Run once only
     
        var document = win.document, 
            inputArea = document.getElementById( "xpath" ),
            searchBtn = document.getElementById( "search" );

        searchBtn.onclick = function(){
            port.postMessage( {
                command: "findXpath", 
                xpath: inputArea.value, 
                tabId: chrome.devtools.inspectedWindow.tabId 
            });
        }
    });
});