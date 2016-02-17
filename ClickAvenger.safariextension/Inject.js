// Copyright © 2014-2016 Many Tricks (When in doubt, consider this MIT-licensed)


function referenceForElement(theElement) {
	if (theElement.nodeName.toLowerCase()=='a') {
		return theElement.href;				// identify anchors with a reference or...
	}
	var theNestedAnchors = theElement.getElementsByTagName('a');
	var i;
	var aReference;
	for (i = 0; i<theNestedAnchors.length; i++) {
		aReference = theNestedAnchors[i].href;
		if (aReference) {
			return aReference;				// ...elements that contain at least one anchor with a reference or...
		}
	}
	while (theElement = theElement.parentNode) {
		if (theElement.nodeName.toLowerCase()=='a') {
			return theElement.href;			// ...elements that are nested in an anchor with a reference
		}
	}
	return null;
}

function elementShouldBeAvenged(theElement, theWhitelistExpression, theDocumentURL) {
	if (theElement) {
		var theReference = referenceForElement(theElement);
		if (
			(theReference)
		&&
			(theReference!='')
		&&
			(theReference.substr(-1)!=='#')
		&&
			(theReference.toLowerCase().indexOf('javascript:')!==0)
		&&
			(
				(!theWhitelistExpression)
			||
				(!theWhitelistExpression.test(theDocumentURL))
			)
		) {
			return true;
		}
	}
	return false;
}

var currentClickEvent = null;


safari.self.addEventListener('message', function (theEvent) {
	if (theEvent.name=='com.manytricks.ClickAvenger.DeliverSettings') {
		var theSettings = theEvent.message;
		var theWhitelist = theSettings['Whitelist'];
		var theWhitelistExpression = (((theWhitelist) && (theWhitelist!='')) ? new RegExp(theWhitelist, 'i') : null);
		var theDocumentURL = document.location.href;
		var theElements = document.getElementsByTagName('*');
		var i;
		var anElement;
		var anOnclickHandler;
		var avengeAllEvents = !theSettings['CommandOnly'];
		for (i = 0; i<theElements.length; i++) {
			anElement = theElements[i];
			anOnclickHandler = anElement.onclick;
			if ((anOnclickHandler) && elementShouldBeAvenged(anElement, theWhitelistExpression, theDocumentURL)) {
				if (avengeAllEvents) {
					anElement.removeAttribute('onclick');	// knock out onclick handler entirely
				} else {
					anElement['com.manytricks.ClickAvenger.OriginalOnclickHandler'] = anOnclickHandler;
					anElement.onclick = function (theEvent) {
						if (!theEvent) {
							theEvent = currentClickEvent;
						}
						if (theEvent.metaKey) {
							return true;	// skip original handler if a modifier key is held
						}
						var theTarget = theEvent.currentTarget;
						return (theTarget['com.manytricks.ClickAvenger.OriginalOnclickHandler'].call(theTarget, theEvent)!==false);
					}
				}
			}
		}
		window.addEventListener('click', function (theEvent) {
			currentClickEvent = theEvent;
			if ((avengeAllEvents || (theEvent.metaKey)) && elementShouldBeAvenged(theEvent.target, theWhitelistExpression, theDocumentURL)) {
				theEvent.stopPropagation();	// knock out modern event listener
			}
		}, true);
	}
}, false);

safari.self.tab.dispatchMessage('com.manytricks.ClickAvenger.RequestSettings', null);