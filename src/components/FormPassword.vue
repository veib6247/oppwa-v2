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
  data() {
    return {
      isPassword: true,
    };
  },

  computed: {
    toggleFormType() {
      return this.isPassword ? "password" : "text";
    },
  },
};
</script>

<template>
  <label for="" class="label">{{ label }}</label>
  <div class="field has-addons has-addons-centered">
    <p class="control is-expanded">
      <input
        class="input is-small mono"
        :type="toggleFormType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </p>
    <p class="control">
      <a class="button is-small is-dark" @click="isPassword = !isPassword"
        >Show</a
      >
    </p>
  </div>
  <p class="help">{{ helper }}</p>
</template>