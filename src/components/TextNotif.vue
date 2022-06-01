<script>
export default {
  props: {
    notifDescription: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="notification is-info is-light raleway is-size-7">
    {{ notifDescription }} Ahoy
  </div>
</template>