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
      <textarea
        class="textarea is-small mono"
        rows="13"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
  <p class="helper is-size-7">
    {{ helper }}
  </p>
</template>