<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    footer: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button
          class="delete"
          aria-label="close"
          @click="$emit('closeAction')"
        ></button>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
      <footer class="modal-card-foot" v-if="footer !== ''">
        <p class="is-size-7">
          {{ footer }}
        </p>
      </footer>
    </div>
  </div>
</template>