<script>
// import utilities for string processing and etc.
import { processParameters } from "../utils/stringProcessing";
import { nanoid } from "nanoid";

// import reusable components
import FormInput from "../components/FormInput.vue";
import FormButton from "../components/FormButton.vue";
import FormSwitch from "../components/FormSwitch.vue";
import TextData from "../components/TextData.vue";
import TextNotif from "../components/TextNotif.vue";
import FormDisplayResponse from "../components/FormDisplayResponse.vue";
import Notification from "../components/Notification.vue";

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
    TextNotif,
    FormDisplayResponse,
    Notification,
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
        "The access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights.",

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
        isOngoing: false,
      },

      response: "",
      result: "",

      autoLaunchWidget: false,

      wpwlOptions: {
        style: "card",
        requireCvv: true,
        allowEmptyCvv: false,
        showCVVHint: false,
        validation: true,
        showLabels: true,
        showPlaceholders: true,
      },

      disableButtons: {
        btnRG: false,
        btnCOF: false,
      },
    };
  },

  methods: {
    /**
     * use nanoid and push ID to array a the transaction ID
     */
    generateTransactionId() {
      this.request.defaultParameters.push(
        `merchantTransactionId=test_transaction_${nanoid()}`
      );
    },

    addRGParam() {
      this.request.defaultParameters.push(`createRegistration=true`);
      this.request.frontEndParameters = this.processParameters;

      this.disableButtons.btnRG = true;
    },

    addCOFParams() {
      this.request.defaultParameters.push(`standingInstruction.mode=INITIAL`);
      this.request.defaultParameters.push(`standingInstruction.type=RECURRING`);
      this.request.defaultParameters.push(`standingInstruction.source=CIT`);
      this.request.frontEndParameters = this.processParameters;

      this.disableButtons.btnCOF = true;
    },

    /**
     * hit API to get a checkout ID
     */
    async generateCheckoutId() {
      // clear current response
      this.response = "";
      this.result = "";

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

        // parse response to json
        this.response = await rawResponse.json();
        this.result = this.response.result;

        // if checkout id is generated successfully and
        // check with autolaunch is enabled
        if (this.response.id && this.autoLaunchWidget) this.launchWidget();
      } catch (error) {
        console.error(error);
      } finally {
        // turns button loading animation off
        this.request.isOngoing = false;
      }
    },

    launchWidget() {
      // TODO: unload the widget first before relaunching
      // this.unloadWidget();

      this.createWidgetScriptTag();

      wpwlOptions = this.wpwlOptions; // apply customizations to the wpwlOptions object

      this.createWidgetFormContainer();
    },

    createWidgetScriptTag() {
      // check if existing widgetScript element exists in the HTML head and remove it
      const checkElement = document.getElementById("widget-script-tag");

      if (document.head.contains(checkElement)) {
        console.info("widget-script-tag element exists, removing now.");
        document.head.removeChild(checkElement);
      }

      // create new script element
      console.info("Creating new widget Script element, appending to head.");
      let widgetScript = document.createElement("script");
      widgetScript.id = "widget-script-tag";

      // get subdomain of endpoint and prefix to the src
      const subDomain = this.request.endPoint.split(".")[0];
      widgetScript.src = `${subDomain}.oppwa.com/v1/paymentWidgets.js?checkoutId=${this.response.id}`;

      // append to head
      document.querySelector("head").append(widgetScript);
    },

    createWidgetFormContainer() {
      // check if existing widget-form-container element exists in the HTML body and remove it
      const checkWdigetFormContainer = document.getElementById(
        "widget-form-container"
      );

      if (document.body.contains(checkWdigetFormContainer)) {
        // console.info("widget-form-container already exists, removing now.");
        checkWdigetFormContainer.remove();
      }

      // create new div element - widget-form-container
      let widgetFormContainer = document.createElement("div");
      widgetFormContainer.id = "widget-form-container";
      document.getElementById("form-goes-here").append(widgetFormContainer);

      // create and add the form to the html body
      let widgetForm = document.createElement("form");
      widgetForm.setAttribute(
        "action",
        "http://localhost/oppwa-v2/dist/#/resultpage"
      );
      widgetForm.setAttribute("id", "widget-form");
      widgetForm.setAttribute("class", "paymentWidgets");
      widgetForm.setAttribute("data-brands", "VISA MASTER");

      // append to container
      document.getElementById("widget-form-container").append(widgetForm);
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

      <!-- add extra params -->
      <div class="buttons has-addons is-centered">
        <button
          class="button is-small is-rounded is-dark raleway"
          @click="addRGParam"
          :disabled="disableButtons.btnRG"
        >
          Create Registration
        </button>
        <button
          class="button is-small is-rounded is-dark raleway"
          @click="addCOFParams"
          :disabled="disableButtons.btnCOF"
        >
          Add COF
        </button>
      </div>
    </div>

    <!-- right column -->
    <div class="column">
      <label class="label">Style</label>
      <div class="box">
        <div class="field">
          <div class="control">
            <div class="select is-small is-dark is-fullwidth">
              <select class="raleway" v-model="wpwlOptions.style">
                <option>card</option>
                <option>logos</option>
                <option>plain</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <label class="label">Widget Behavior</label>

      <div class="box">
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

      <label class="label">Internal Testing Behavior</label>

      <div class="box">
        <!-- auto-launch the widget if checkout id is good -->
        <FormSwitch
          id="autoSwitch"
          label="Auto-launch the widget if a checkout ID is generated successfully."
          v-model="autoLaunchWidget"
        />
      </div>

      <TextNotif color-type="is-info"
        >This app does <strong>not</strong> have JQuery installed. Please
        manually reload the page if your desired customization isn't loading
        properly.</TextNotif
      >
    </div>
  </div>

  <!-- level to keep button centered -->
  <nav class="level">
    <div class="level-item">
      <!-- generate checkout ID button -->
      <FormButton
        button-label="Generate Checkout ID"
        :is-loading="request.isOngoing"
        @submit-data="generateCheckoutId"
      />
    </div>
  </nav>

  <Notification
    :notif-description="result.description"
    :result-code="result.code"
    v-if="result.code"
  >
    <!-- display response for checkout ID generation -->
    <FormDisplayResponse
      label="Complete JSON Response"
      :data="response"
      v-if="response"
    />
    <!-- generate checkout ID button -->
    <FormButton
      button-label="Launch CopyandPay Widget"
      v-if="response.id && !autoLaunchWidget"
      @submit-data="launchWidget"
    />
  </Notification>

  <!-- widget here -->
  <div id="form-goes-here"></div>
</template>