var ports = {};

chrome.extension.onMessage.addListener(function( request, sender, response ){
  
})

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
      debugger
      console.log(msg);
      if( msg.command === "findXpath" ){
        var inspectedId = msg.tabId;
        // chrome.tabs.executeScript( inspectedId, { file: "content.js" });
        chrome.tabs.sendMessage(inspectedId, msg, function(response) {
          debugger
        });
      }
    });
});

// Function to send a message to all devtool.html views:
function notifyDevtools( msg ) {
    Object.keys(ports).forEach(function(portId_) {
        ports[portId_].postMessage(msg);
    });
}