// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

function referenceForElement(theElement) {
	if (theElement.nodeName=='A') {
		return theElement.href;			// identify proper links or...
	}
	var theNestedAnchors = theElement.getElementsByTagName('A');
	var i;
	var aReference;
	for (i = 0; i<theNestedAnchors.length; i++) {
		aReference = theNestedAnchors[i].href;
		if (aReference) {
			return aReference;			// ...elements that contain at least one proper link
		}
	}
	return null;
}


// Step 1: Deal with onclick handlers by doing one of two things (cf. replaceOnclickHandlers):
// 	- Wrap them with a handler that calls the original handler unless cmd is held
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
			anElement.com_manytricks_commandclickavenger_originalonclick = anOnclickHandler;
			anElement.onclick = function (theEvent) {
				return (((theEvent) ? theEvent : window.event).metaKey || (this.com_manytricks_commandclickavenger_originalonclick.call(this, theEvent)!==false));
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
