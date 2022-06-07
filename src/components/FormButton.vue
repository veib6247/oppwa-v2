<script>
export default {
  props: {
    buttonLabel: {
      type: String,
      required: true,
    },

    buttonSize: {
      type: String,
      default: "is-small",
    },

    isRounded: {
      type: Boolean,
      required: false,
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
        class="button is-dark raleway"
        :class="[
          { 'is-loading': isLoading },
          { 'is-rounded': isRounded },
          buttonSize,
        ]"
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