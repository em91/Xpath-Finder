chrome.devtools.panels.create("Xpath Finder", "FontPicker.png", "i18n/" + chrome.i18n.getMessage( "@@ui_locale" ) + "/xpath.html", function(panel) {
    var _window;

    var data = [];
    var port = chrome.extension.connect( { name: "xpathFinder" } );
    port.onMessage.addListener(function( msg ) {
        if ( _window ) {
            _window.render( msg );
        } else {
            data.push(msg);
        }
    });

    //panel显示出来之后绑定事件
    //@todo 貌似在html里的JS都不会执行，只能在这里绑定事件
    panel.onShown.addListener(function tmp( win ) {
        panel.onShown.removeListener( tmp ); // Run once only
        
        _window = win;
        _window.port = port;
        
        chrome.devtools.inspectedWindow.eval( "location.host", function( host ){
            port.postMessage( { command: "getHistory",  host: host } );
        })
    });
});