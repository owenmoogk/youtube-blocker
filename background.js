var currentSite = '';
var blocked = false;
var blockedSites = JSON.parse(localStorage.getItem('sites')) || [];
var redirectUrl = localStorage.getItem('redirect_url');
var activeTabs = {};

var cmid = chrome.contextMenus.create({
	'title': 'Block this site',
	'contexts': ['all', 'page'],
	'onclick': onClickHandler
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	activeTabs[tab.id] = tab;
});

chrome.tabs.onRemoved.addListener(onRemovedListener);

function onRemovedListener(tabId) {
	delete activeTabs[tabId];
}

chrome.tabs.query({}, function (results) {
	results.forEach(function (tab) {
		activeTabs[tab.id] = tab;
	});
})

// this runs before the request and determines if the request needs to be blocked
// add listener has 3 params, callback (the main function), details, which is the urls, and then a filter which tells the events that can be executed by this listener
chrome.webRequest.onBeforeRequest.addListener(
	function (details) {

		blockedSites = JSON.parse(localStorage.getItem('sites')) || [];

		// Do not block main frame request
		if (details.type === 'main_frame') {
			return;
		}

		var tab = activeTabs[details.tabId];
		var host = getLocation(tab.url).host.replace('www.', '');
		var block = false;
		var current_request = getLocation(details.url).host.replace('www.', '');

		if (host !== current_request && blockedSites.indexOf(current_request) > -1) {
			block = true;
		}

		// returning a blocking response, if true then it cancels the request
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/BlockingResponse
		return {
			cancel: block
		};

	},
	{ urls: ["<all_urls>"] },
	['blocking']
);

// this is something that is passed from the frontend, decides if the website should be blocked and then sends a response
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.host) {

		blockedSites = JSON.parse(localStorage.getItem('sites')) || [];

		currentSite = request.value;
		var fullSite = request.site;
		fullSite = getLocation(fullSite).hostname + decodeURIComponent(getLocation(fullSite).pathname);
		fullSite = fullSite.replace('www.', '');
		fullSite = fullSite.replace('http://', '');
		fullSite = fullSite.replace('https://', '');

		var isSiteInList = has_prop(blockedSites, request.value);

		var blockSubdomains = isEqual('subdomainOption', 1);
		var blockKeyOption = isEqual('blockKeyOption', 1);
		var blockPattern = isEqual('blockPattern', 1);


		blockSubdomains = blockSubdomains && isSubdomainInList(blockedSites, currentSite);
		var isBlockedByTag = blockKeyOption && isBlockedByKey(currentSite, fullSite);
		var blockByPattern = isBlockedByPattern(blockKeyOption, blockPattern, currentSite);

		//If in block or subdomain list or contains blocked keys
		if (isSiteInList || blockSubdomains || isBlockedByTag || blockByPattern) {
			blocked = true;

			if (redirectUrl && !redirectUrl.includes(currentSite) && !currentSite.includes(redirectUrl)) {
				chrome.tabs.update(sender.tab.id, { url: redirectUrl });
				return;
			}

			var close_tab = isEqual('close_option', 1);
			if (close_tab) {
				chrome.tabs.query({}, function (activeTabs) {
					var tabsCount = activeTabs.length;
					if (tabsCount === 1) {
						chrome.tabs.create({
							url: 'chrome://newtab'
						})
					}
					chrome.tabs.remove(sender.tab.id);

				});

			}

		}
		else {
			blocked = false;
		}

		var text = 'Block this site';
		if (isSiteInList || blockSubdomains) text = 'Unblock this site';
		options = {
			'title': text,
			'contexts': ["all", "page"],
			'onclick': onClickHandler
		}

		chrome.contextMenus.removeAll();
		chrome.contextMenus.create(options);

		// If blocked by key and not in site list
		if (blockKeyOption && !isSiteInList) {
			chrome.contextMenus.remove(cmid);
			type = 'Blocked by key config';
		}

		sendResponse({ host: blocked });

	}
});

function isEqual(key, val) {
	return +localStorage.getItem(key) === val;
}

function onClickHandler(info, tab) {
	currentSite = getLocation(info.pageUrl);
	currentSite = currentSite.host.replace('www.', '');
	currentSiteHost = false;
	if (currentSite === 'offfjidagceabmodhpcngpemnnlojnhn') {
		return;
	}

	var action_type = '';
	var blockSubdomains = isEqual('subdomainOption', 1);
	if (blockSubdomains) {
		currentSiteHost = isSubdomainInList(blockedSites, currentSite, true);
	}
	if (has_prop(blockedSites, currentSite) || currentSiteHost) {
		if (currentSiteHost) {
			//currentSite ru-ru.facebook.com, will become facebook.com 
			currentSite = currentSiteHost;
		}

		blockedSites = remove_site(blockedSites, currentSite);

		localStorage.sites = JSON.stringify(blockedSites);
		action_type = 'unblock';

	}
	else {
		blockedSites = add_to_block(blockedSites, currentSite);
		localStorage.sites = JSON.stringify(blockedSites);
		action_type = 'block';
	}

	// send to content_script
	chrome.tabs.query(
		{
			active: true, 
			currentWindow: true 
		}, 
		function (tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id, 
				{ action: action_type }, 
				function (response) {}
			);
		}
	);

}

// For option page show all sites
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method === 'getStatus') {
		sendResponse({ status: localStorage['sites'] });
	}

	else if (request.method === 'save_data') {
		//update data model
		blockedSites = JSON.parse(request.value);
		localStorage.setItem('sites', request.value);
		sendResponse({ status: 1 });

	}
	else if (request.method === 'update_redirect_url') {
		redirectUrl = request.value;
		if (!redirectUrl) {
			localStorage.removeItem('redirect_url');
		} else {
			localStorage.setItem('redirect_url', redirectUrl);
		}
		sendResponse({ status: 1 });
	}

	else sendResponse({});
});


function has_prop(arr, val) {
	return arr.includes(val);
}

function isBlockedByPattern(blockKeyOption, blockPattern, currentSite) {
	if (!blockKeyOption || !blockPattern) return false;
	var blockPatternFlag = localStorage.getItem('blockPatternFlag');
	if (blockPatternFlag) {
		return (new RegExp(blockPattern, blockPatternFlag)).test(currentSite);
	} else {
		return (new RegExp(blockPattern)).test(currentSite);
	}

}

function isSubdomainInList(data, site, getSite) {
	data = data || [];

	for (var i = 0; i < data.length; i++) {
		// facebook.com become .facebook.com
		var current = '.' + data[i];
		if (site.endsWith(current)) {
			return getSite ? data[i] : true;
		}
	}
	return false;
}

function isBlockedByKey(site, fullSite) {
	var blockedKeys = JSON.parse(localStorage.getItem('blockKeyList')) || [];
	for (var i = 0; i < blockedKeys.length; i++) {
		if (site.indexOf(blockedKeys[i]) > -1 || fullSite.indexOf(blockedKeys[i]) > -1) {
			return true;
		}
	}
	return false;
}

function add_to_block(mass, val) {
	mass.push(val);
	return mass;
}

function remove_site(mass, val) {
	var index = mass.indexOf(val);
	mass.splice(index, 1);
	return mass;
}

function getLocation(href) {
	var l = document.createElement("a");
	l.href = href;
	return l;
}