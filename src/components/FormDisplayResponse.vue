<script>
export default {
  props: {
    label: {
      type: String,
      default: "Response Data",
    },

    rowCount: {
      type: Number,
      default: 13,
    },

    data: {
      type: Object,
    },
  },
};
</script>
<template>
  <div class="field">
    <div class="control">
      <label class="label">{{ label }}</label>
      <textarea
        :rows="rowCount"
        class="textarea is-small mono"
        :value="JSON.stringify(data, null, 2)"
        readonly
      ></textarea>
    </div>
  </div>
</template>