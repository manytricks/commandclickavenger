// Copyright © 2014-2016 Many Tricks (When in doubt, consider this MIT-licensed)


var theApplication = safari.application;


function avengeURL(theURL, openNewTab) {
	var theWindow = theApplication.activeBrowserWindow;
	var theCurrentTab = theWindow.activeTab;
	if (openNewTab) {
		var theTabs = theWindow.tabs;
		var theNumberOfTabs = theTabs.length;
		var theIndexToInsertAt = 1;
		var i;
		if (theNumberOfTabs>1) {
			for (i = 0; i<theNumberOfTabs; i++) {
				if (theTabs[i]===theCurrentTab) {
					theIndexToInsertAt = i + 1;
					break;
				}
			}
		}
		theWindow.openTab('background', theIndexToInsertAt).url = theURL;
	} else {
		theCurrentTab.url = theURL;
	}
}


theApplication.addEventListener('message', function (theEvent) {
	if (theEvent.name=='com.manytricks.ClickAvenger.RequestSettings') {
		var theSettings = safari.extension.settings;
		theEvent.target.page.dispatchMessage('com.manytricks.ClickAvenger.DeliverSettings', {
			'AutoAvenge.Scope': theSettings.getItem('com.manytricks.ClickAvenger.AutoAvenge.Scope'),
			'AutoAvenge.Whitelist': theSettings.getItem('com.manytricks.ClickAvenger.AutoAvenge.Whitelist')
		});
	}
}, false);

theApplication.addEventListener('contextmenu', function (theEvent) {
	var theURL = theEvent.userInfo;
	if ((theURL) && (theURL!=='')) {
		var theContextMenu = theEvent.contextMenu;
		switch (navigator.language) {
			case 'de-at':
			case 'de-ch':
			case 'de-de':
				theContextMenu.appendContextMenuItem('com.manytricks.ClickAvenger.Avenge.CurrentTab', 'Direkt öffnen', null);
				theContextMenu.appendContextMenuItem('com.manytricks.ClickAvenger.Avenge.NewTab',  'Direkt in neuem Tab öffnen', null);
				break;
			default:
				theContextMenu.appendContextMenuItem('com.manytricks.ClickAvenger.Avenge.CurrentTab', 'Avenge', null);
				theContextMenu.appendContextMenuItem('com.manytricks.ClickAvenger.Avenge.NewTab',  'Avenge in New Tab', null);
				break;
		}
	}
}, false);

theApplication.addEventListener('command', function (theEvent) {
	switch (theEvent.command) {
		case 'com.manytricks.ClickAvenger.Avenge.CurrentTab':
			avengeURL(theEvent.userInfo, false);
			break;
		case 'com.manytricks.ClickAvenger.Avenge.NewTab':
			avengeURL(theEvent.userInfo, true);
			break;
		default:
			break;
	}
}, false);
