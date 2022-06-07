<script>
// import individual components
import CopyandPay from "./views/CopyandPay.vue";
import ServertoServer from "./views/ServertoServer.vue";
import Reporting from "./views/Reporting.vue";
import NotFound from "./views/NotFound.vue";

// basic routes
const routes = {
  "/": CopyandPay,
  "/copyandpay": CopyandPay,
  "/servertoserver": ServertoServer,
  "/reporting": Reporting,
};

export default {
  // views components registration
  components: {
    CopyandPay,
    ServertoServer,
    Reporting,
  },

  data() {
    return {
      currentPath: window.location.hash,
      tabs: {
        copyandpay: false,
        servertoserver: false,
        reporting: false,
      },
    };
  },

  methods: {
    /**
     * set boolean values for which tab should be active mode
     */
    updateSelectedTab(copyandpay, servertoserver, reporting) {
      this.tabs.copyandpay = copyandpay;
      this.tabs.servertoserver = servertoserver;
      this.tabs.reporting = reporting;
    },

    setSelectedTab() {
      let currentHash = window.location.hash;

      if (currentHash !== "") {
        console.info(`Routing to ${currentHash}`);
      }

      switch (currentHash) {
        case "":
          this.updateSelectedTab(true, false, false);
          break;

        case "#/":
          this.updateSelectedTab(true, false, false);
          break;

        case "#/copyandpay":
          this.updateSelectedTab(true, false, false);
          break;

        case "#/servertoserver":
          this.updateSelectedTab(false, true, false);
          break;

        case "#/reporting":
          this.updateSelectedTab(false, false, true);
          break;

        default:
          this.updateSelectedTab(false, false, false); // select cnp tab on default
          break;
      }
    },
  },

  computed: {
    // returns the name of the component depending on the URL route
    // return the ResultPage as redirect
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
  <!-- tabs -->
  <div class="tabs">
    <ul>
      <li :class="{ 'is-active': tabs.copyandpay }">
        <a href="#/copyandpay" @click="updateSelectedTab(true, false, false)">
          <span class="icon">
            <i class="fas fa-credit-card"></i>
          </span>
          <span>CopyandPay</span>
        </a>
      </li>
      <li :class="{ 'is-active': tabs.servertoserver }">
        <a
          href="#/servertoserver"
          @click="updateSelectedTab(false, true, false)"
        >
          <span class="icon">
            <i class="fas fa-server"></i>
          </span>
          <span>Server-to-Server</span>
        </a>
      </li>
      <li :class="{ 'is-active': tabs.reporting }">
        <a href="#/reporting" @click="updateSelectedTab(false, false, true)">
          <span class="icon">
            <i class="fas fa-file-alt"></i>
          </span>
          <span>Reporting API</span>
        </a>
      </li>
    </ul>
  </div>

  <!-- swapping component views -->
  <Transition>
    <KeepAlive>
      <component :is="currentView" />
    </KeepAlive>
  </Transition>
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

<style scoped>
/* Generic transitions */
.v-enter-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>