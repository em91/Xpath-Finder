var ports = {};

chrome.runtime.onInstalled.addListener(function(details){
    if( details.reason == "install" ){
        var url = chrome.runtime.getURL( 'help/index.html' );
        chrome.tabs.create({ url: url, active: true });
    } else if( details.reason == "update" ) {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

chrome.extension.onMessage.addListener(function( request, sender, response ){
    var xpath = request.xpath,
        count = request.count,
        host = request.host;

    //过滤XPATH加入历史
    var storage = localStorage[ host ] || ( localStorage[ host ] = "{}" );
    var storageJson = JSON.parse( storage );
    var xpathObj = storageJson[ xpath ] || ( storageJson[ xpath ] = 0 );
    if( !xpathObj ){
        storageJson[ xpath ] = 1;
    } else {
        storageJson[ xpath ]++;
    }

    localStorage[ host ] = JSON.stringify( storageJson );

    //搜素完毕后需要刷新历史
    for( var id in ports ){
        ports[ id ].postMessage({
            history: JSON.parse( localStorage[ host ] || "{}" ),
            count: count
        })
    }
})

//接受devtools.panel连接Port，绑定Port消息响应
chrome.extension.onConnect.addListener(function(port) {
    if ( port.name !== "xpathFinder" ){
        return;
    }

    ports[ port.portId_ ] = port;
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function( port ) {
        delete ports[ port.portId_ ];
    });

    port.onMessage.addListener(function( msg ) {
        if( msg.command === "findXpath" ){
            var inspectedId = msg.tabId;
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            }); 
        } else if ( msg.command === "getHistory" ){
            port.postMessage({
                history: JSON.parse( localStorage[ msg.host ] || "{}" )
            })
        } else if( msg.command === "clearHistory" ){
            delete localStorage[ msg.host ];
            port.postMessage({
                history: JSON.parse( localStorage[ msg.host ] || "{}" )
            })
        }
    });
});