<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    helper: {
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
      <input
        type="text"
        class="input is-small mono"
        spellcheck="false"
        :placeholder="label"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p class="help">{{ helper }}</p>
  </div>
</template>