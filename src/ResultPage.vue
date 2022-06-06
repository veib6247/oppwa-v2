<script>
export default {
  data() {
    return {
      msg: "hola from result page",
    };
  },
  mounted() {
    console.log("hello from result page!");
  },
};
</script>

<template>
  <h1 class="title">{{ msg }}</h1>
</template>