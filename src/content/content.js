chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var response = [],
        element;

    switch ( request.command ) {
        case 'findXpath':
            var previousElements = document.getElementsByClassName( "chromeXpathFinder" );
            for( var l = previousElements.length, i = l; i; i-- ){
                try{
                    previousElements[i - 1].className = previousElements[i - 1].className.replace(/chromeXpathFinder\d*/g, "").trim();
                } catch ( exp ) { }
            }

            //没有输入XPATH，只要把页面上的outline删除即可。
            if( !request.xpath ){
                return true;
            }

            try{
                var results = document.evaluate( request.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
                var elements = [];
                for( var i = 0, l = results.snapshotLength; i < l; i++ ){
                    var element = results.snapshotItem(i);
                    var rawClass = element.hasAttribute( 'class' ) && element.className;
                    element.className += " chromeXpathFinder chromeXpathFinder" + i;
            
                    var elementDescription = '<' + element.tagName;
                    for ( var j = 0, m = element.attributes.length; j < m; j++ ) {
                        var attr = element.attributes[j];
                        var name = attr.name, value = attr.value;

                        if( attr.name == 'class' ) {
                            if( rawClass != false ) {
                                elementDescription += ' ' + name + '="' + rawClass + '"';
                            }
                        } else {
                            elementDescription += ' ' + name + '="' + value + '"';                    
                        }
                    }
                    elementDescription += '></' + element.tagName + '>';

                    elements.push( elementDescription.toLowerCase() );
                }

                chrome.extension.sendMessage({ xpath: request.xpath,  count: results.snapshotLength, host: location.host, elements: elements });
            }catch( exp ){}
            break;
        case 'locateElement':
            var id = request.id;
            var elements = document.getElementsByClassName( "chromeXpathFinderHover" );
            for (var i = elements.length - 1; i >= 0; i--) {
                elements[i].className = elements[i].className.replace( /chromeXpathFinderHover/, '' ).trim();
            };

            var elements = document.getElementsByClassName( "chromeXpathFinder" + id );
            if( elements.length ) {
                elements[0].className += ' chromeXpathFinderHover';
            }
            break;
    }
    
});