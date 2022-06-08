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

    rowCount: {
      type: Number,
      default: 17,
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
        :rows="rowCount"
        spellcheck="false"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>