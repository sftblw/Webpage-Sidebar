'use strict';

// initialize list

browser.runtime.sendMessage({ kind: 'storage.sites.get' }).then((message) => {
  // console.log(message);
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
  if (ev.target.classList.contains('open-site')) {
    openSite(ev);
  }
  else if (ev.target.classList.contains('add-site')) {
    addSite(ev);
  }
  else if (ev.target.classList.contains('remove-site')) {
    removeSite(ev);
  }
});

document.addEventListener('submit', (ev) => {
  if (ev.target.classList.contains('add-site')) {
    addSite(ev);
  }
});

function openSite(ev) {
  ev.preventDefault();

  // open sidebar
  if (browser.sidebarAction.open !== undefined) { browser.sidebarAction.open(); }

  // set URL
  browser.sidebarAction.getPanel({})
    .then((panel) => {
      browser.sidebarAction.setPanel({ panel: ev.target.href });
    });
}

function validateUrl(url) {
    if (url === '') {
        throw 'Site URL is empty.';
    }
    else if (url.match(/^file:\/\//g)) {
        throw 'This addon does not support local files yet.';
    }
    else if (! url.match(/^http/g)) {
        return `https://${url}`;
    }
    else return url;
}

function addSite(ev) {
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
      console.error(`unknown event source ${ev.target.nodeName} for add-site(). aborting.`);
      return;
    }
    urlElem.value = '';
  }

  try {
    url = validateUrl(url);
  } catch (errorStr) {
    alert(errorStr);
    return;
  }

  browser.runtime.sendMessage({ kind: 'storage.sites.add', site: { url } }).then(handleOk);
  addSiteElem(url);
}

const remove_elem_base = document.createElement('input');
{
  remove_elem_base.setAttribute('type', 'button');
  remove_elem_base.setAttribute('value', 'X');
  remove_elem_base.setAttribute('class', 'remove-site list-item');
}
const a_elem_base = document.createElement('a');
{
  a_elem_base.setAttribute('class', 'open-site list-item');
}

function addSiteElem(url) {
  let li_elem = document.createElement('li');
  let a_elem = a_elem_base.cloneNode();
  a_elem.textContent = url;
  a_elem.setAttribute('href', url);
  let remove_elem = remove_elem_base.cloneNode();

  li_elem.appendChild(a_elem);
  li_elem.appendChild(remove_elem);

  document.querySelector('#sites ul').appendChild(li_elem);
}

function removeSite(ev) {
  ev.preventDefault();

  browser.runtime.sendMessage({
    kind: 'storage.sites.remove', site: {
      'url': ev.target.parentNode.querySelector('.open-site').getAttribute('href')
    }
  }).then(handleOk);
  ev.target.parentNode.parentNode.removeChild(ev.target.parentNode);
}

function handleOk(response) {
  if (response !== 'ok') {
    console.error('background script did not send OK');
  }
}
