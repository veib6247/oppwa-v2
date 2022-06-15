<script>
import TextNotif from "../components/TextNotif.vue";

export default {
  components: {
    TextNotif,
  },
};
</script>

<template>
  <div class="box">
    <TextNotif color-type="is-danger">
      <h1 class="title is-size-5">404</h1>
      <p class="subtitle is-size-6">Sorry, that page does not exists!</p>
    </TextNotif>
  </div>
</template>