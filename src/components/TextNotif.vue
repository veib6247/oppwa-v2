<script>
export default {
  props: {
    colorType: {
      type: String,
      default: "is-light",
    },
  },
};
</script>

<template>
  <div class="notification raleway is-size-7" :class="colorType">
    <slot></slot>
  </div>
</template>