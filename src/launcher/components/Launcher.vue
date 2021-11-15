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
        <input
          class="btn"
          type="button"
          value="❌"
          v-on:click.prevent="onRemoveSite(site)"
        />
      </li>
    </ul>

    <form id="addsiteForm" class="row-container" v-on:submit.prevent>
      <!-- <div width="100%"> -->
      <input
        class="left"
        v-model="siteUrl"
        type="url"
        placeholder="https://"
        autofocus
      />
      <!-- </div> -->
      <input class="btn" type="submit" value="➕" v-on:click="onAddSite" />
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
  border-bottom: 1px solid lightgrey;
  a.left {
    transition: box-shadow 0.1s ease-out;
    &:focus {
      box-shadow: inset 5px 0px 0px 0px green;
    }
  }
  &:hover {
    a.left {
      box-shadow: inset 5px 0px 0px 0px grey;
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
  border: none;
  background: none;
  &:hover {
    background: rgb(244, 244, 244);
  }
  &:active {
    background: grey;
  }
  &:hover,
  &:active {
    outline: 2px solid grey;
    outline-offset: -2px;
  }
  &:focus {
    outline: 4px solid green;
    outline-offset: -4px;
  }
}
</style>