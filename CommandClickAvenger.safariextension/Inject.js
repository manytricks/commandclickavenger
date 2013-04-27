// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

var theProxy = safari.self;

theProxy.addEventListener("message", function(theEvent) {
	if (theEvent.name=="com.manytricks.CommandClickAvenger.KnockOutTags") {
		var theRawTagNamesToKnockOut = theEvent.message;
		if ((theRawTagNamesToKnockOut) && (theRawTagNamesToKnockOut.length>0)) {
			var theDummyHandler = function() {/* nope */};
			var theTagNamesToKnockOut = theRawTagNamesToKnockOut.split(",");
			var aTagNameIndex;
			var aTagName;
			var anAnchorList;
			var anAnchorIndex;
			var anAnchor;
			var anOnclickHandler;
			for (aTagNameIndex = 0; aTagNameIndex<theTagNamesToKnockOut.length; aTagNameIndex++) {
				aTagName = theTagNamesToKnockOut[aTagNameIndex].replace(/(^\s+|\s+$)/g, "");
				if (aTagName.length>0) {
					anAnchorList = document.getElementsByTagName(aTagName);
					for (anAnchorIndex = 0; anAnchorIndex<anAnchorList.length; anAnchorIndex++) {
						anAnchor = anAnchorList[anAnchorIndex];
						anOnclickHandler = anAnchor.onclick;
						if ((anOnclickHandler) && (("Lazy String Conversion: " + anOnclickHandler).indexOf(".location.href=")!==-1)) {
							anAnchor.onclick = theDummyHandler;
						}
					}
				}
			}
		}
	}
}, false);

theProxy.tab.dispatchMessage("com.manytricks.CommandClickAvenger.GetTagNames", null);
