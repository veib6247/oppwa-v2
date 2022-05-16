<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    modelValue: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <textarea
        class="textarea is-small mono"
        rows="16"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>