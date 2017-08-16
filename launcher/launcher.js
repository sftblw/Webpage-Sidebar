'use strict';

// initialize list

browser.runtime.sendMessage({kind: 'storage.sites.get'}).then( (message) => {
  console.log(message);
  let ul = document.querySelector('#sites ul');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  if (message !== undefined) {
    for (let site of message) {
      addSiteElem(site.url);
    }
  }
});


// ref: https://github.com/mdn/webextensions-examples/blob/master/beastify/popup/choose_beast.js
document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('openSite')) {
    openSite(ev);
  }
  else if (ev.target.classList.contains('addSite')) {
    addSite(ev);
  }
  else if (ev.target.classList.contains('removeSite')) {
    removeSite(ev);
  }
});

document.addEventListener('submit', (ev) => {
  if (ev.target.classList.contains('addSite')) {
    addSite(ev);
  }
});

function openSite (ev) {
  ev.preventDefault();
  browser.sidebarAction.getPanel({})
    .then( (panel) => { 
      browser.sidebarAction.setPanel({panel: ev.target.href});
    });
}

function addSite (ev) {
  ev.preventDefault();

  let url;
  
  {
    let urlElem;

    if (ev.target.nodeName.toLowerCase() === 'form') {
      urlElem = ev.target.querySelector('.url');
      url = urlElem.value;
      ev.target.querySelector('.url').value = '';
    } else if (ev.target.nodeName.toLowerCase() === 'input') {
      urlElem = ev.target.parentNode.querySelector('.url');
      url = urlElem.value;
    } else {
      console.error(`unknown event source ${ev.target.nodeName} for addSite(). aborting.`);
      return;
    }
    urlElem.value = '';
  }

  browser.runtime.sendMessage({kind: 'storage.sites.add', site: {url}}).then(handleOk);
  addSiteElem(url);
}

function addSiteElem(url) {
  let template = `<a href="${url}" class="openSite">${url}</a>
  <input type="button" value="X" class="removeSite"/>`;

  let li_elem = document.createElement('li');
  li_elem.innerHTML = template;

  document.querySelector('#sites ul').appendChild(li_elem);
}

function removeSite (ev) {
  ev.preventDefault();
  
  ev.target.parentNode.parentNode.removeChild(ev.target.parentNode);
  browser.runtime.sendMessage({kind: 'storage.sites.remove', site: {
    'url': ev.target.parentNode.querySelector('.openSite').href
  }}).then(handleOk);
}

function handleOk(response) {
  if (response !== 'ok') {
    console.error('background script did not send OK');
  }
}