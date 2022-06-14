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
  <label class="label">{{ label }}</label>
  <div class="field has-addons has-addons-centered">
    <p class="control is-expanded">
      <input
        :type="toggleFormType"
        class="input is-small mono"
        :placeholder="placeholder"
        spellcheck="false"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </p>
    <p class="control">
      <a class="button is-small is-dark" @click="isPassword = !isPassword">
        <span class="icon" v-if="isPassword"><i class="far fa-eye"></i></span>
        <!-- <span v-if="isPassword">Show</span> -->

        <span class="icon" v-if="!isPassword"
          ><i class="far fa-eye-slash"></i
        ></span>
        <!-- <span v-if="!isPassword">Hide</span> -->
      </a>
    </p>
  </div>
  <p class="help">{{ helper }}</p>
</template>