<script>
// import individual components
import CopyandPay from "./CopyandPay.vue";

export default {
  // component registration
  components: {
    CopyandPay,
  },

  // data
  data() {
    return {
      msg: "Main App Here",
    };
  },
};
</script>

<template>
  <CopyandPay />
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