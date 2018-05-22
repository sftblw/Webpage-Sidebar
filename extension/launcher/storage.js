'use strict';

let sites = [
  // {'url': 'https://mobile.twitter.com/'}
];

getInitialStorage();
// browser.storage.sync.clear();

/// handle request from panel
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.kind === 'storage.sites.get') {
    sendResponse(sites);
  }
  else if (request.kind === 'storage.sites.add') {
    sites.push(request.site);
    browser.storage.sync.set({sites});
    sendResponse('ok');
  }
  else if (request.kind === 'storage.sites.remove') {
    sites = sites.filter( (value, index) => {
      return value.url != request.site.url
    });
    browser.storage.sync.set({sites});
    sendResponse('ok');
  }
});


function getInitialStorage () {
  browser.storage.sync.get('sites').then( (storage_value) => {
    if (storage_value.sites === undefined) {
      browser.storage.sync.set({'sites': []});
      sites = [];
    } else {
      sites = storage_value.sites;
    }
  });
}