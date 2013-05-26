// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

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


// Step 1: Deal with onclick handlers by doing one of two things (cf. replaceOnclickHandlers):
// 	- Wrap them in a handler that calls the original handler unless cmd is held
// 	- Simply remove offending onclick handlers

var theElements = document.getElementsByTagName('*');
var i;
var anElement;
var anOnclickHandler;
var replaceOnclickHandlers = true;
for (i = 0; i<theElements.length; i++) {
	anElement = theElements[i];
	anOnclickHandler = anElement.onclick;
	if ((anOnclickHandler) && (referenceForElement(anElement))) {
		if (replaceOnclickHandlers) {
			anElement['com.manytricks.CommandClickAvenger.OriginalOnclickHandler'] = anOnclickHandler;
			anElement.onclick = function (theEvent) {
				var theTarget = theEvent.currentTarget;
				return (((theEvent) ? theEvent : window.event).metaKey || (theTarget['com.manytricks.CommandClickAvenger.OriginalOnclickHandler'].call(theTarget, theEvent)!==false));
			}
		} else if (('Lazy String Conversion: ' + anOnclickHandler).indexOf('.location.href=')!==-1) {
			anElement.removeAttribute('onclick');
		}
	}
}


// Step 2: Knock out modern event listeners with our own event listener if the cmd key is held

window.addEventListener('click', function (theEvent) {
	if (theEvent.metaKey && (referenceForElement(theEvent.target))) {
		theEvent.stopPropagation();
	}
}, true);
