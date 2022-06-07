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

    buttonIcon: {
      type: String,
      default: "fas fa-paper-plane",
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
        <span class="icon" :class="[buttonSize]">
          <i :class="[buttonIcon]"></i>
        </span>
        <span>
          {{ buttonLabel }}
        </span>
      </button>
    </div>
  </div>
</template>