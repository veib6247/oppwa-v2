<script>
import TextNotif from "../components/TextNotif.vue";
import FormInput from "../components/FormInput.vue";
import FormPassword from "../components/FormPassword.vue";

export default {
  components: {
    TextNotif,
    FormInput,
    FormPassword,
  },

  data() {
    return {
      request: {
        endPoint: "https://eu-test.oppwa.com/v1/payments",
        authToken: "OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=",
      },
    };
  },

  methods: {},
};
</script>

<template>
  <div class="box">
    <!-- ENDPOINT -->
    <FormInput
      label="API Endpoint"
      placeholder="https://eu-test.oppwa.com/v1/checkouts"
      helper="When sending requests to a live environment, change the subdomain to eu-prod"
      v-model="request.endPoint"
    />

    <!-- TOKEN -->
    <FormPassword
      label="Access Token"
      placeholder="OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg="
      helper="The access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights."
      v-model="request.authToken"
    />
  </div>
</template>