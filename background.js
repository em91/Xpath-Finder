var ports = {};

chrome.extension.onMessage.addListener(function( request, sender, response ){

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
        }
    });
});