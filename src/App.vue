<script>
// import individual components
import CopyandPay from "./views/CopyandPay.vue";
import ResultPage from "./views/ResultPage.vue";
import NotFound from "./views/NotFound.vue";

// basic routes
const routes = {
  "/": CopyandPay,
  "/copyandpay": CopyandPay,
  "/resultpage": ResultPage,
};

export default {
  // views components registration
  components: {
    CopyandPay,
    ResultPage,
    NotFound,
  },

  data() {
    return {
      currentPath: window.location.hash,
    };
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
    });
  },
};
</script>

<template>
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