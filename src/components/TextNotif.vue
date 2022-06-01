<script>
export default {
  props: {
    colorType: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="notification is-light raleway is-size-7" :class="colorType">
    <slot></slot>
  </div>
</template>