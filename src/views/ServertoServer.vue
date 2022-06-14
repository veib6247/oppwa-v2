<script>
import TextNotif from "../components/TextNotif.vue";
import FormInput from "../components/FormInput.vue";
import FormPassword from "../components/FormPassword.vue";
import TextData from "../components/TextData.vue";
import FormButton from "../components/FormButton.vue";
import FormDisplayResponse from "../components/FormDisplayResponse.vue";

import { processParameters } from "../utils/stringProcessing";
import { nanoid } from "nanoid";

// this will allow parcel to include the php file in the build process so that everything is in 1 directory
const copyAndPayScriptPath = require("url:../../php/CopyandPay.php");

export default {
  components: {
    TextNotif,
    FormInput,
    FormPassword,
    TextData,
    FormButton,
    FormDisplayResponse,
  },

  data() {
    return {
      request: {
        endPoint: "https://eu-test.oppwa.com/v1/payments",
        authToken: "OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=",
        defaultParameters: [
          "entityId=8a8294174b7ecb28014b9699220015ca",
          "amount=1.00",
          "currency=EUR",
          "paymentType=DB",
          "paymentBrand=VISA",
          "card.number=4000000000000044",
          "card.holder=Bruce Wayne",
          "card.expiryMonth=02",
          "card.expiryYear=2034",
          "card.cvv=123",
          "billing.city=city1",
          "billing.country=PH",
          "billing.street1=strt1",
          "billing.postcode=1610",
          "customer.email=test@test.com",
          "customer.givenName=Test",
          "customer.surname=Tester",
          "customer.ip=192.168.0.1",
          "customer.browser.acceptHeader=text/html",
          "customer.browser.screenColorDepth=48",
          "customer.browser.javaEnabled=false",
          "customer.browser.language=en-US",
          "customer.browser.screenHeight=1200",
          "customer.browser.screenWidth=1600",
          "customer.browser.timezone=-480",
          "customer.browser.challengeWindow=5",
          "customer.browser.userAgent=Mozilla/4.0 (MSIE 6.0; Windows NT 5.0)",
        ],
        frontEndParameters: "",
        isOngoing: false,
      },
      response: "",
      error: "",
      result: "",
    };
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

  methods: {
    generateTransactionId() {
      this.request.defaultParameters.push(
        `merchantTransactionId=test_transaction_${nanoid()}`
      );
    },

    getResultURL() {
      // entire URL
      const currentURL = new URL(window.location.href);
      this.request.defaultParameters.push(
        `shopperResultUrl=${currentURL.origin}${currentURL.pathname}ResultPage.html`
      );
    },

    async submitRequest() {
      // clear current response and errors
      this.response = "";
      this.result = "";
      this.error = "";

      try {
        this.request.isOngoing = true; // start button loading animation

        const rawResponse = await fetch(copyAndPayScriptPath, {
          method: "POST",
          body: JSON.stringify({
            endPoint: this.request.endPoint,
            authToken: this.request.authToken,
            parameters: this.processedURLParameters,
          }),
        });

        // clone response in case parsing to JSON fails
        const backupResponse = rawResponse.clone();

        // parse response to json, else to text
        try {
          this.response = await rawResponse.json();
          this.result = this.response.result;
        } catch (error) {
          console.error(
            `Parsing to JSON failed! Parsing to text instead.`,
            error
          );
          this.error = await backupResponse.text();
          console.error(this.error);
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

  mounted() {
    this.generateTransactionId();
    this.getResultURL();

    // process the default params into the frontend using computed function
    this.request.frontEndParameters = this.processParameters;
  },
};
</script>

<template>
  <div class="box">
    <!-- ENDPOINT -->
    <FormInput
      label="API Endpoint"
      placeholder="https://eu-test.oppwa.com/v1/checkouts"
      helper="When sending requests to a live environment, change the subdomain to eu-prod"
      @keyup.enter="submitRequest"
      v-model="request.endPoint"
    />

    <!-- TOKEN -->
    <FormPassword
      label="Access Token"
      placeholder="OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg="
      helper="The access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights."
      v-model="request.authToken"
    />

    <br />

    <!-- PARAMS -->
    <TextData
      label="Data Parameters"
      :row-count="32"
      :placeholder="processParameters"
      @keyup.ctrl.enter="submitRequest"
      v-model="request.frontEndParameters"
    />

    <!-- submit button -->
    <nav class="level">
      <div class="level-item">
        <FormButton
          buttonLabel="Submit"
          buttonSize="is-small"
          :is-loading="request.isOngoing"
          :isRounded="true"
          @click="submitRequest"
        />
      </div>
    </nav>

    <!-- display response for checkout ID generation -->
    <Transition>
      <FormDisplayResponse
        label="Response"
        :row-count="30"
        :data="response"
        v-if="response"
      />
    </Transition>

    <!-- display error notif if response is not the expected JSON from the server -->
    <Transition>
      <text-notif class="mono" color-type="is-danger" v-if="error">
        {{ error }}
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