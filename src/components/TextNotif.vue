<script>
export default {
  props: {
    colorType: {
      type: String,
    },
  },
};
</script>

<template>
  <div class="notification is-light raleway is-size-7" :class="colorType">
    <slot></slot>
  </div>
</template>