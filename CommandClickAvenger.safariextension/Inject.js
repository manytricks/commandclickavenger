// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

var theElementList = document.getElementsByTagName('*');
var anElementIndex;
var anElement;
var anOnclickHandler;
var anAnchorList;
var anAnchorIndex;
for (anElementIndex = 0; anElementIndex<theElementList.length; anElementIndex++) {
	anElement = theElementList[anElementIndex];
	anOnclickHandler = anElement.onclick;
	if ((anOnclickHandler) && (('Lazy String Conversion: ' + anOnclickHandler).indexOf('.location.href=')!==-1)) {
		if (anElement.nodeName=='A') {
			if (anElement.href) {
				anElement.removeAttribute('onclick');			// knock out onclick handlers for proper links or...
			}
		} else {
			anAnchorList = anElement.getElementsByTagName('A');
			for (anAnchorIndex = 0; anAnchorIndex<anAnchorList.length; anAnchorIndex++) {
				if (anAnchorList[anAnchorIndex].href) {
					anElement.removeAttribute('onclick');		// ...elements that contain at least one proper link
					break;
				}
			}
		}
	}
}
