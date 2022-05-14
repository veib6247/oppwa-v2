<script>
// import utilities for string processing and etc.
import { processParameters } from "../utils/stringProcessing";
import { nanoid } from "nanoid";

// import reusable components
import FormInput from "../components/FormInput.vue";
import FormButton from "../components/FormButton.vue";
import FormSwitch from "../components/FormSwitch.vue";
import TextData from "../components/TextData.vue";

// main widget object, to be modified before launching
var wpwlOptions = {};

// this will allow parcel to include the php file in the build process so that everything is in 1 directory
const copyAndPayScriptPath = require("url:../../php/CopyandPay.php");

/**
 * main stuff
 */
export default {
  // component registration
  components: {
    FormInput,
    FormButton,
    FormSwitch,
    TextData,
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

      autoLaunchWidget: true,

      // widget customization
      wpwlOptions: {
        style: "card",
        requireCvv: true,
        allowEmptyCvv: false,
        showCVVHint: false,
        validation: true,
        showLabels: true,
        showPlaceholders: true,
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
      console.info(`Automatically launch widget: ${this.autoLaunchWidget}`);
      console.log(`Endpoint: ${this.request.endPoint}`);
      console.log(`authToken: ${this.request.authToken}`);
      console.log(`URL string parameters: ${this.processedURLParameters}`);
      console.log(`CopyandPay PHP script path: ${copyAndPayScriptPath}`);

      if (this.autoLaunchWidget) this.launchWidget();
    },

    launchWidget() {
      wpwlOptions = this.wpwlOptions;
      console.log("Widget customizations applied: ", wpwlOptions);
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

  <div class="columns">
    <!-- left column -->
    <div class="column">
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
        type="password"
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

      <!-- auto-launch the widget if checkout id is good -->
      <FormSwitch
        id="autoSwitch"
        label="Auto-launch the widget if a checkout ID is generated successfully."
        v-model="autoLaunchWidget"
      />

      <!-- generate checkout ID button -->
      <FormButton
        button-label="Generate Checkout ID"
        :is-loading="false"
        @submit-data="generateCheckoutId"
      />
    </div>

    <!-- right column -->
    <div class="column">
      <div class="box">
        <h4>Widget Customizations</h4>
        <hr />
        <FormSwitch
          id="requireCvv"
          label="requireCvv - Determine whether the CVV field is presented on the payment form."
          v-model="wpwlOptions.requireCvv"
        />

        <FormSwitch
          id="allowEmptyCvv"
          label="allowEmptyCvv - Determines whether the CVV field can be empty. By default it is false."
          v-model="wpwlOptions.allowEmptyCvv"
        />

        <FormSwitch
          id="showCVVHint"
          label="showCVVHint - If set to true then the credit card form will display a hint on where the CVV is located when the mouse is hovering over the CVV field."
          v-model="wpwlOptions.showCVVHint"
        />

        <FormSwitch
          id="validation"
          label="validation - Use validation. If false, it disables validation and the functions 'validate' and 'on Submit' will not be called."
          v-model="wpwlOptions.validation"
        />

        <FormSwitch
          id="showLabels"
          label="showLabels - Shows or hides input labels. Default is true."
          v-model="wpwlOptions.showLabels"
        />

        <FormSwitch
          id="showPlaceholders"
          label="showPlaceholders - Shows or hides input placeholders. Default is true."
          v-model="wpwlOptions.showPlaceholders"
        />
      </div>
    </div>
  </div>
</template>

