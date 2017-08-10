'use strict';

// ref: https://github.com/mdn/webextensions-examples/blob/master/beastify/popup/choose_beast.js
document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('openSite')) {
    openSite(ev);
  }
});

function openSite (ev) {
  ev.preventDefault();
  browser.sidebarAction.getPanel({})
    .then( (panel) => { 
      console.dir(panel);
      browser.sidebarAction.setPanel({panel: ev.target.href});
    });
}