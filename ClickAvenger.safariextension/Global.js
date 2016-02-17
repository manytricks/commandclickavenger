// Copyright © 2014-2016 Many Tricks (When in doubt, consider this MIT-licensed)


safari.application.addEventListener('message', function (theEvent) {
	if (theEvent.name=='com.manytricks.ClickAvenger.RequestSettings') {
		var theSettings = safari.extension.settings;
		theEvent.target.page.dispatchMessage('com.manytricks.ClickAvenger.DeliverSettings', {
			'CommandOnly': theSettings.getItem('com.manytricks.ClickAvenger.CommandOnly'),
			'Whitelist': theSettings.getItem('com.manytricks.ClickAvenger.Whitelist')
		});
	}
}, false);
