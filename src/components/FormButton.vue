<script>
export default {
  props: {
    buttonLabel: {
      type: String,
      default: "",
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
        class="button is-small is-dark is-rounded raleway"
        :class="{ 'is-loading': isLoading }"
        @click="$emit('submitData')"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>