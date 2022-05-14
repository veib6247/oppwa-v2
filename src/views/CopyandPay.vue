<script>
// import utilities for string processing and etc.
import { processParameters } from "../utils/stringProcessing";
import { nanoid } from "nanoid";

// import reusable components
import FormInput from "../components/FormInput.vue";
import TextData from "../components/TextData.vue";
import FormButton from "../components/FormButton.vue";

// this will allow parcel to include the php file in the build process so that everything is in 1 directory
const copyAndPayScriptPath = require("url:../../php/CopyandPay.php");

/**
 * main stuff
 */
export default {
  // component registration
  components: {
    FormInput,
    TextData,
    FormButton,
  },

  //
  data() {
    return {
      // page related details
      title: "Copy and Pay",
      subTitle:
        "COPYandPAY is a SAQ-A compliant payment-form solution, making it both secure and simple-to-integrate.",
      endPointHelper:
        "When sending requests to a live environment, change the subdomain to 'eu-prod'",
      accessTokenHelper:
        "Access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights.",

      // request variable only here
      request: {
        endPoint: "https://eu-test.oppwa.com/v1/checkouts",
        authToken: "OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=",
        defaultParameters: [
          "entityId=8a8294174b7ecb28014b9699220015ca",
          "amount=1.00",
          "currency=EUR",
          "paymentType=PA",
          "billing.city=city1",
          "billing.country=PH",
          "billing.street1=strt1",
          "billing.postcode=1610",
          "customer.email=test@test.com",
          "customer.givenName=Test",
          "customer.surname=Tester",
        ],
        frontEndParameters: "",
      },
    };
  },

  methods: {
    generateTransactionId() {
      let trxId = nanoid();
      console.info(`Generated Transaction ID: ${trxId}`);
      this.request.defaultParameters.push(`merchantTransactionId=${trxId}`);
    },

    generateCheckoutId() {
      console.log(`Endpoint: ${this.request.endPoint}`);
      console.log(`authToken: ${this.request.authToken}`);
      console.log(`URL string parameters: ${this.processedURLParameters}`);
      console.log(`CopyandPay PHP script path: ${copyAndPayScriptPath}`);
    },
  },

  computed: {
    // returns processed string to display to text area
    processParameters() {
      return processParameters(this.request.defaultParameters);
    },

    // replaces "\n" into "&"
    processedURLParameters() {
      return this.request.frontEndParameters.replace(/\n/gi, "&");
    },
  },

  mounted() {
    // generate new merchantTransactionId for every page load
    this.generateTransactionId();

    // process the default params into the frontend using computed function
    this.request.frontEndParameters = this.processParameters;
  },
};
</script>

<template>
  <p class="title">{{ title }}</p>
  <p class="sub">{{ subTitle }}</p>
  <hr />

  <!-- ENDPOINT -->
  <FormInput
    label="API Endpoint"
    placeholder="https://eu-test.oppwa.com/v1/checkouts"
    :helper="endPointHelper"
    v-model="request.endPoint"
  />

  <!-- TOKEN -->
  <FormInput
    label="Access Token"
    placeholder="OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg="
    :helper="accessTokenHelper"
    v-model="request.authToken"
  />

  <!-- PARAMS -->
  <TextData
    label="Data Parameters"
    :placeholder="processParameters"
    v-model="request.frontEndParameters"
  />

  <!-- generate checkout ID button -->
  <FormButton
    button-label="Generate Checkout ID"
    :is-loading="false"
    @submit-data="generateCheckoutId"
  />
</template>

