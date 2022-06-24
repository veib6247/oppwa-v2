<script>
import TextNotif from "../components/TextNotif.vue";
import FormInput from "../components/FormInput.vue";
import FormButton from "../components/FormButton.vue";

export default {
  components: {
    TextNotif,
    FormInput,
    FormButton,
  },

  data() {
    return {
      host: "",
      sessionId: "",
      uuid: "",
      error: "",
    };
  },

  methods: {
    openLink() {
      if (this.validateInputs()) {
        // build URL
        const url = `https://${this.host}/bip/detail.prc;jsessionid=${this.sessionId}?id=${this.uuid}`;

        // open in new tab
        window.open(url, "_blank");
      } else {
        this.error = "Input fields cannot be empty!";
      }
    },

    validateInputs() {
      if (this.host === "" || this.sessionId === "" || this.uuid === "") {
        return false;
      } else {
        this.error = "";
        return true;
      }
    },
  },
};
</script>

<template>
  <div class="box">
    <text-notif color-type="is-info">
      <p>
        This is just another way to pull up a transaction in BIP without having
        to manually navigate to the entity. Simply <strong>login</strong> to
        BIP, get your <strong>session ID</strong>, and input the UUID you are
        looking for.
      </p>
    </text-notif>

    <FormInput
      label="BIP Host"
      placeholder="test.prtpe.com"
      helper="The main domain of the BIP where the transaction is located."
      v-model="host"
      @keyup.enter="openLink"
    />

    <FormInput
      label="BIP Session ID"
      placeholder="E7A40AA8E6D9DFEA91D6F01C0CC925B4.prod02-vm-bip01"
      helper="Located in the URL after logging into BIP."
      v-model="sessionId"
      @keyup.enter="openLink"
    />

    <FormInput
      label="Transaction Unique ID"
      placeholder="8ac9a4a7818b42460181941942fb2422"
      helper="ID of the transaction."
      v-model="uuid"
      @keyup.enter="openLink"
    />

    <FormButton
      buttonIcon="fas fa-external-link-alt"
      buttonLabel="Open in new tab"
      buttonSize="is-small"
      :isRounded="true"
      @click="openLink"
    />

    <Transition>
      <text-notif color-type="is-danger" v-if="error">
        <p>
          {{ error }}
        </p>
      </text-notif>
    </Transition>
  </div>
</template>

<style scoped>
/* Generic transitions */
.v-enter-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>