<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },

    functionName: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
};
</script>

<template>
  <div class="field">
    <div class="field">
      <input
        :id="id"
        type="checkbox"
        class="switch is-small is-rounded is-dark"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <label :for="id"
        ><strong>{{ functionName }}</strong> - {{ label }}</label
      >
    </div>
  </div>
</template>