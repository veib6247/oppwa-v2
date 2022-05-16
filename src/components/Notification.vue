<script>
export default {
  props: {
    notifDescription: {
      type: String,
      required: true,
    },

    resultCode: {
      type: String,
      required: true,
    },
  },
};
</script>
<template>
  <div
    class="notification raleway"
    :class="{ 'is-danger is-light': resultCode !== '000.200.100' }"
  >
    <p class="title is-size-6">{{ resultCode }}</p>
    <p class="subtitle is-size-6">
      {{ notifDescription }}
    </p>
    <slot></slot>
  </div>
</template>