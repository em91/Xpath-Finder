chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var response = [], 
        element;

    var previousElements = document.getElementsByClassName( "chromeXpathFinder" );
    for( var l = previousElements.length, i = l; i; i-- ){
        try{
            previousElements[i - 1].className = previousElements[i - 1].className.replace(" chromeXpathFinder", "");
        }catch( exp ){

        }
    }

    //没有输入XPATH，只要把页面上的outline删除即可。
    if( !request.xpath ){
        return true;
    }

    try{
        var results = document.evaluate( request.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

        for( var i = 0, l = results.snapshotLength; i < l; i++ ){
            var element = results.snapshotItem(i);
            element.className += " chromeXpathFinder";
        }

        chrome.extension.sendMessage({
            xpath: request.xpath,
            count: results.snapshotLength,
            host: location.host
        })
    }catch( exp ){
        
    }
});