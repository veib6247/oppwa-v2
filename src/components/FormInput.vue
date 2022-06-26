<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    placeholder: {
      type: String,
      default: "",
    },

    helper: {
      type: String,
      default: "",
    },

    isDisabled: {
      type: Boolean,
      default: false,
      required: false,
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
      <input
        :type="type"
        class="input is-small mono"
        spellcheck="false"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p class="help">{{ helper }}</p>
  </div>
</template>