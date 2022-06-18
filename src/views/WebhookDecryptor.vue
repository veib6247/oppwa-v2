<script>
import TextNotif from "../components/TextNotif.vue";
import FormPassword from "../components/FormPassword.vue";
import FormInput from "../components/FormInput.vue";
import TextData from "../components/TextData.vue";
import FormButton from "../components/FormButton.vue";
import FormDisplayResponse from "../components/FormDisplayResponse.vue";

// this will allow parcel to include the php file in the build process so that everything is in 1 directory
const decryptorPath = require("url:../../php/decryptor.php");

export default {
  components: {
    TextNotif,
    FormPassword,
    FormInput,
    TextData,
    FormButton,
    FormDisplayResponse,
  },

  data() {
    return {
      bipSecret: "",
      initializationVector: "",
      authenticationTag: "",
      encryptedBody: "",
      decryptedBody: "",
      request: {
        isOngoing: false,
      },
      error: "",
    };
  },

  methods: {
    async decryptData() {
      // clear previous responses
      this.error = "";
      this.decryptedBody = "";

      // hit endpoint
      try {
        this.request.isOngoing = true; // start button loading animation

        const rawResponse = await fetch(decryptorPath, {
          method: "POST",
          body: JSON.stringify({
            secret: this.bipSecret,
            initializationVector: this.initializationVector,
            authenticationTag: this.authenticationTag,
            encryptedBody: this.encryptedBody,
          }),
        });

        // clone response in case parsing to JSON fails
        const backupResponse = rawResponse.clone();

        try {
          // parse response to json, else to text
          this.decryptedBody = await rawResponse.json();
        } catch (error) {
          // if decryption fails, notify user
          this.error = await backupResponse.text();
          console.error(error, this.error);
        } finally {
          // turns button loading animation off
          this.request.isOngoing = false;
        }
      } catch (error) {
        console.error(error);
      } finally {
        // turns button loading animation off
        this.request.isOngoing = false;
      }
    },
  },
};
</script>

<template>
  <div class="box">
    <FormPassword
      label="BIP Secret"
      helper="The secret is the key used for encrypting the message's content."
      v-model="bipSecret"
    />

    <br />

    <FormInput
      label="Initialization Vector"
      placeholder="15D8456E2E49B8E1245C2AE7"
      helper="The notification's header contains the initialization vector."
      v-model="initializationVector"
    />

    <FormInput
      label="Authentication Tag"
      placeholder="235D79EA76D16C8761B4AD4A80198F6B"
      helper="The notification's header contains the authentication tag."
      v-model="authenticationTag"
    />

    <TextData
      label="Encrypted Body"
      :rowCount="9"
      v-model="encryptedBody"
      placeholder="0B25E1026B30376D8DEEEC8F87A649D80F8F79C48E12137FF02635C91BF3008A96374B718418B94B15CF439B80AE3D99C31A701EC2F65966A0E8DDE7248F9B87979B51342290AAF94594A6874ABE1EAAFE2C6E5DFBE54F996D2A4DD06386EEF000FD90A41153CB17CD3F48B82018D5E86811D13837C3CC1684C35CDEBBA46A5490B3381F178B24BBDA5FDCE5058643EBA3D964CF1A2CA64D0B1A7780E3CCFD4F057E0E164134BF005939C6629E826E2418"
    />

    <FormButton
      buttonLabel="Decrypt Payload"
      buttonSize="is-small"
      :isRounded="true"
      buttonIcon="fab fa-readme"
      :isLoading="request.isOngoing"
      @click="decryptData"
    />

    <Transition>
      <text-notif colorType="is-danger" v-if="error">
        {{ error }}
      </text-notif>
    </Transition>

    <Transition>
      <FormDisplayResponse
        label="Decrypted Body"
        :rowCount="17"
        :data="decryptedBody"
        v-if="decryptedBody"
      />
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