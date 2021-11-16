<template>
  <nav>
    <ul>
      <li class="row-container" v-for="site in siteList" v-bind:key="site.key">
        <a
          class="left"
          v-bind:href="site.url"
          v-on:click.prevent="onOpenSite(site.url)"
          tabindex="0"
          >{{ site.url }}</a
        >
        <button class="btn" v-on:click.prevent="onRemoveSite(site)">
          <svg
            class="svg-icon cross"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              style="fill: currentColor"
              d="M3.272 28.728a1.996 1.996 0 0 0 2.829 0l9.899-9.9 9.9 9.9a1.996 1.996 0 0 0 2.828 0 1.996 1.996 0 0 0 0-2.829L18.828 16l9.9-9.9a1.996 1.996 0 0 0 0-2.828 1.996 1.996 0 0 0-2.829 0L16 13.172l-9.9-9.9a1.996 1.996 0 0 0-2.828 0 1.996 1.996 0 0 0 0 2.829l9.9 9.899-9.9 9.9a1.996 1.996 0 0 0 0 2.828z"
            />
          </svg>
        </button>
      </li>
    </ul>

    <form id="addsiteForm" class="row-container" v-on:submit.prevent>
      <!-- <div width="100%"> -->
      <input
        class="left urlInput"
        v-model="siteUrl"
        type="url"
        placeholder="https://"
        autofocus
      />
      <!-- </div> -->
      <button class="btn" type="submit" v-on:click="onAddSite">
        <svg
          class="svg-icon plus"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            style="fill: currentColor"
            d="M0 16c0 1.108.892 2 2 2h12v12c0 1.108.892 2 2 2s2-.892 2-2V18h12c1.108 0 2-.892 2-2s-.892-2-2-2H18V2c0-1.108-.892-2-2-2s-2 .892-2 2v12H2c-1.108 0-2 .892-2 2z"
          />
        </svg>
      </button>
    </form>
  </nav>
</template>
<script lang="ts">
// import SiteList from "./SiteList.vue"; // TODO when detail page implementing time
import { Site, SiteState } from "../../common/types";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      siteUrl: "",
    };
  },
  computed: {
    siteList() {
      return (this.$store.state as SiteState).siteListReadonly; // TODO
    },
  },
  methods: {
    addSiteAction(site: Site): void {
      this.$store.dispatch("addSite", site);
    },
    removeSiteAction(site: Site): void {
      this.$store.dispatch("removeSite", site);
    },
    onAddSite(): void {
      let siteUrl: string = "";
      try {
        siteUrl = this.validateUrl(this.siteUrl);
      } catch (ex) {
        window.alert(ex);
        return;
      }
      if (siteUrl.length != 0) {
        this.addSiteAction(new Site(siteUrl));
        this.siteUrl = "";
      }
    },
    onRemoveSite(site: Site) {
      this.removeSiteAction(Site.FromObject(site));
    },
    onOpenSite(siteUrl: string) {
      // open sidebar (this exists after Firefox 57)
      if (browser.sidebarAction.open !== undefined) {
        browser.sidebarAction.open();
      }
      // set URL
      browser.sidebarAction.getPanel({}).then((_) => {
        browser.sidebarAction.setPanel({ panel: siteUrl });
      });
    },
    validateUrl(url: string) {
      if (url === "") {
        throw "Site URL is empty.";
      } else if (url.match(/^file:\/\//g)) {
        throw "This addon does not support local files yet.";
      } else if (!url.match(/^http/g)) {
        return `https://${url}`;
      } else return url.trim();
    },
  },
});
</script>
<style lang="scss">
// themes
:root {
  --body-color: #333;
  --body-bg-color: white;

  --link-color: #0000ee;
  --visited-color: #551a8b;

  --row-border-color: lightgrey;
  --site-selected-highlight-color: green;
  --site-hover-highlight-color: grey;

  --input-text-bg-color: lightgrey;
  --input-text-bg-color: white;
  --input-text-border-color: grey;
  --input-text-outline-color: skyblue;

  --btn-hover-bg-color: rgb(244, 244, 244);
  --btn-active-bg-color: grey;
  --btn-focus-border-color: green;
  --btn-active-border-color: grey;

  --icon-cross-color: #a00;
  --icon-cross-active-color: #f55;
  --icon-plus-color: #0a0;
  --icon-plus-active-color: #7f7;
}

@media (prefers-color-scheme: dark) {
  :root {
    --body-color: white;
    --body-bg-color: #333;

    --link-color: #8af;
    --visited-color: #a8f;

    --row-border-color: #555;
    --site-selected-highlight-color: lightgreen;
    --site-hover-highlight-color: lightgrey;

    --input-text-bg-color: lightgrey;
    --input-text-bg-color: #333;
    --input-text-border-color: #555;
    --input-text-outline-color: lightblue;

    --btn-hover-bg-color: darkgrey;
    --btn-active-bg-color: grey;
    --btn-focus-border-color: lightgreen;
    --btn-active-border-color: lightgrey;

    --icon-cross-color: #f55;
    --icon-cross-active-color: #a00;
    --icon-plus-color: #7f7;
    --icon-plus-active-color: #0a0;
  }
}

// scss

html,
body,
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
div#app {
  min-width: 256px;
  color: var(--body-color);
  background-color: var(--body-bg-color);
  :link {
    color: var(--link-color);
  }
  :visited {
    color: var(--visited-color);
  }
}
nav ul {
  list-style: none;
  li {
    margin: 0;
    padding: 0;
  }
}

$item-padding: 0.8em;
$item-fontsize: 1.2em;
$item-size: $item-padding * 2 + $item-fontsize;

.row-container {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  .left {
    width: 100%;
  }
}

.row-container {
  border-bottom: 1px solid var(--row-border-color);
  a.left {
    transition: box-shadow 0.1s ease-out;
    &:focus {
      box-shadow: inset 5px 0px 0px 0px var(--site-selected-highlight-color);
    }
  }
  &:hover {
    a.left {
      box-shadow: inset 5px 0px 0px 0px var(--site-hover-highlight-color);
    }
  }
}
.left,
.btn {
  margin: 0;
  padding: $item-padding;
  width: $item-size;
  height: $item-size;
  font-size: $item-fontsize;
}
.btn {
  .svg-icon {
    width: $item-fontsize;
    height: $item-fontsize;
    &.cross {
      color: var(--icon-cross-color);
      &:active {
        color: var(--icon-cross-active-color);
      }
    }
    &.plus {
      color: var(--icon-plus-color);
      &:active {
        color: var(--icon-plus-active-color);
      }
    }
  }
}
.btn {
  border: none;
  background: none;
  &:hover {
    background: var(--btn-hover-bg-color);
  }
  &:active {
    background: var(--btn-active-bg-color);
  }
  &:hover,
  &:active {
    outline: 2px solid var(--btn-active-border-color);
    outline-offset: -2px;
  }
  &:focus {
    outline: 4px solid var(--btn-focus-border-color);
    outline-offset: -4px;
  }
}

input.urlInput {
  color: var(--input-text-color);
  background-color: var(--input-text-bg-color);
  border: 1px solid var(--input-text-border-color);
  border-radius: 3px;

  &:focus {
    outline: 2px solid var(--input-text-outline-color);
    outline-offset: -2px;
  }
}
</style>