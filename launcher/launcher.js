'use strict';

// initialize list

browser.runtime.sendMessage({kind: 'storage.sites.get'}).then( (message) => {
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

  // open sidebar
  if (browser.sidebarAction.open !== undefined) { browser.sidebarAction.open(); }

  // set URL
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

  if (url === '') {
    alert('Site URL is empty.');
    return
  }

  browser.runtime.sendMessage({kind: 'storage.sites.add', site: {url}}).then(handleOk);
  addSiteElem(url);
}

const remove_elem_base = document.createElement('input');
{
  remove_elem_base.setAttribute('type', 'button');
  remove_elem_base.setAttribute('value', 'X');
  remove_elem_base.setAttribute('class', 'removeSite');
}
const a_elem_base = document.createElement('a');
{
  a_elem_base.setAttribute('class', 'openSite');
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

function removeSite (ev) {
  ev.preventDefault();
  
  ev.target.parentNode.parentNode.removeChild(ev.target.parentNode);
  browser.runtime.sendMessage({kind: 'storage.sites.remove', site: {
    'url': ev.target.parentNode.querySelector('.openSite').getAttribute('href')
  }}).then(handleOk);
}

function handleOk(response) {
  if (response !== 'ok') {
    console.error('background script did not send OK');
  }
}