<script>
// import individual components
import CopyandPay from "./views/CopyandPay.vue";
import ServertoServer from "./views/ServertoServer.vue";
import Reporting from "./views/Reporting.vue";
import ResultPage from "./views/ResultPage.vue";
import NotFound from "./views/NotFound.vue";

// basic routes
const routes = {
  "/": CopyandPay,
  "/copyandpay": CopyandPay,
  "/servertoserver": ServertoServer,
  "/reporting": Reporting,
  "/resultpage": ResultPage,
};

export default {
  // views components registration
  components: {
    CopyandPay,
    ServertoServer,
    Reporting,
    ResultPage,
    NotFound,
  },

  data() {
    return {
      currentPath: window.location.hash,
      tabs: {
        copyandpay: false,
        servertoserver: false,
        reporting: false,
        resultpage: false,
      },
    };
  },

  methods: {
    /**
     * set boolean values for which tab should be active mode
     */
    updateSelectedTab(copyandpay, servertoserver, reporting, resultpage) {
      this.tabs.copyandpay = copyandpay;
      this.tabs.servertoserver = servertoserver;
      this.tabs.reporting = reporting;
      this.tabs.resultpage = resultpage;
    },

    setSelectedTab() {
      currentHash = window.location.hash;

      if (currentHash !== "") {
        console.info(`Routing to ${currentHash}`);
      }

      switch (currentHash) {
        case "":
          this.updateSelectedTab(true, false, false, false);
          break;

        case "#/copyandpay":
          this.updateSelectedTab(true, false, false, false);
          break;

        case "#/servertoserver":
          this.updateSelectedTab(false, true, false, false);
          break;

        case "#/reporting":
          this.updateSelectedTab(false, false, true, false);
          break;

        case "#/resultpage":
          this.updateSelectedTab(false, false, false, true);
          break;

        default:
          this.updateSelectedTab(false, false, false, false);
          break;
      }
    },
  },

  computed: {
    // returns the name of the component depending on the URL route
    currentView() {
      return routes[this.currentPath.slice(1) || "/"] || NotFound;
    },
  },

  // when mounted, return current URL
  mounted() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.hash;
      this.setSelectedTab();
    });

    // on load, update the selected tab depending on the url hash
    this.setSelectedTab();
  },
};
</script>

<template>
  <div class="tabs is-centered is-boxed">
    <ul>
      <li :class="{ 'is-active': tabs.copyandpay }">
        <a
          href="#/copyandpay"
          @click="updateSelectedTab(true, false, false, false)"
          >CopyandPay</a
        >
      </li>
      <li :class="{ 'is-active': tabs.servertoserver }">
        <a
          href="#/servertoserver"
          @click="updateSelectedTab(false, true, false, false)"
          >Server-to-Server</a
        >
      </li>
      <li :class="{ 'is-active': tabs.reporting }">
        <a
          href="#/reporting"
          @click="updateSelectedTab(false, false, true, false)"
          >Reporting API</a
        >
      </li>
      <li :class="{ 'is-active': tabs.resultpage }">
        <a
          href="#/resultpage"
          @click="updateSelectedTab(false, false, false, true)"
          >Result Page</a
        >
      </li>
    </ul>
  </div>

  <KeepAlive>
    <component :is="currentView" />
  </KeepAlive>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&family=Red+Hat+Mono&display=swap");

/** main font throughout the entire site */
.raleway {
  font-family: "Raleway", sans-serif;
}

/** main font for all data inputs */
.mono {
  font-family: "Red Hat Mono", monospace;
}
</style>