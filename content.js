chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  var response = [],
      element;

  var previousElements = document.getElementsByClassName( "chromeXpathFinder" );
  for( var l = previousElements.length, i = l; i; i-- ){
    try{
      previousElements[i - 1].className = previousElements[i - 1].className.replace("chromeXpathFinder", "");
    }catch( exp ){
    }
  }

  var results = document.evaluate( request.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

  for( var i = 0, l = results.snapshotLength; i < l; i++ ){
    var element = results.snapshotItem(i);
    element.className += " chromeXpathFinder";
  }
});