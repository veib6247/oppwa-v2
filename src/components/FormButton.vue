<script>
export default {
  props: {
    buttonLabel: {
      type: String,
      default: "",
    },
  },
};
</script>
<template>
  <div class="field">
    <div class="control">
      <button
        class="button is-small is-dark is-rounded raleway"
        @click="$emit('submitData')"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>