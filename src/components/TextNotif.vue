<script>
export default {
  props: {
    colorType: {
      type: String,
      default: "is-info",
    },
  },
};
</script>

<template>
  <div class="notification is-light raleway is-size-7" :class="colorType">
    <slot></slot>
  </div>
</template>