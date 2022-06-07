<script>
export default {
  props: {
    buttonLabel: {
      type: String,
      default: "",
    },

    buttonSize: {
      type: String,
      default: "is-small",
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<template>
  <div class="field">
    <div class="control">
      <button
        class="button is-dark is-rounded raleway"
        :class="[{ 'is-loading': isLoading }, buttonSize]"
        @click="$emit('submitData')"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>