<script>
// import utilities for string processing and etc.
import { processParameters, parseBrands } from "../utils/stringProcessing";
import { brandList } from "../utils/brandList";
import { nanoid } from "nanoid";

// import reusable components
import FormInput from "../components/FormInput.vue";
import FormButton from "../components/FormButton.vue";
import FormSwitch from "../components/FormSwitch.vue";
import TextData from "../components/TextData.vue";
import TextNotif from "../components/TextNotif.vue";
import FormDisplayResponse from "../components/FormDisplayResponse.vue";
import Modal from "../components/Modal.vue";

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
    Modal,
  },

  data() {
    return {
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

      shopperResultURL: "",
      response: "",
      error: "",
      result: "",

      autoLaunchWidget: true,
      showModal: false,
      showCustomizationModal: false,

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

      brandList: "",
      selectedBrands: ["VISA", "MASTER"],
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
      widgetForm.setAttribute("action", this.shopperResultURL);
      widgetForm.setAttribute("id", "widget-form");
      widgetForm.setAttribute("class", "paymentWidgets");
      widgetForm.setAttribute("data-brands", parseBrands(this.selectedBrands));

      // append to container
      document.getElementById("widget-form-container").append(widgetForm);

      this.showModal = true;
    },

    getResultURL() {
      // entire URL
      const currentURL = new URL(window.location.href);

      // console.info(currentURL);

      // set the shopper result URL
      this.shopperResultURL = `${currentURL.origin}${currentURL.pathname}ResultPage.html`;
    },

    closeWidget() {
      location.reload(true);
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
    // set the list of brands
    this.brandList = brandList();

    // generate the return URL
    this.getResultURL();

    // generate new merchantTransactionId for every page load
    this.generateTransactionId();

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
      @keyup.enter="generateCheckoutId"
      v-model="request.endPoint"
    />

    <!-- TOKEN -->
    <FormInput
      label="Access Token"
      type="password"
      placeholder="OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg="
      helper="The access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights."
      @keyup.enter="generateCheckoutId"
      v-model="request.authToken"
    />

    <!-- PARAMS -->
    <TextData
      label="Data Parameters"
      :row-count="17"
      :placeholder="processParameters"
      @keyup.ctrl.enter="generateCheckoutId"
      v-model="request.frontEndParameters"
    />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <!-- add extra params -->
          <div class="buttons has-addons">
            <button
              class="button is-small is-dark raleway"
              @click="addRGParam"
              :disabled="disableButtons.btnRG"
            >
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
              <span>Create Registration</span>
            </button>
            <button
              class="button is-small is-dark raleway"
              @click="addCOFParams"
              :disabled="disableButtons.btnCOF"
            >
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
              <span> COF </span>
            </button>
          </div>
        </div>
      </div>
      <div class="level-right">
        <FormButton
          button-label="Customize"
          button-icon="fas fa-cog"
          button-size="is-small"
          @submit-data="showCustomizationModal = !showCustomizationModal"
        />
      </div>
    </nav>

    <br />
    <!-- level to keep button centered -->
    <nav class="level">
      <div class="level-item">
        <!-- generate checkout ID button -->
        <FormButton
          button-label="Generate Checkout ID"
          :is-rounded="true"
          :is-loading="request.isOngoing"
          @submit-data="generateCheckoutId"
        />
      </div>
    </nav>

    <!-- display error notif if response is not the expected JSON from the server -->
    <Transition>
      <text-notif class="mono" color-type="is-danger" v-if="error">
        {{ error }}
      </text-notif>
    </Transition>

    <!-- display response for checkout ID generation -->
    <Transition>
      <text-notif v-if="result.code">
        <FormDisplayResponse
          label="Response"
          :data="response"
          v-if="response"
        />
        <!-- generate checkout ID button -->
        <FormButton
          button-label="Launch Widget"
          button-icon="fas fa-rocket"
          v-if="response.id && !autoLaunchWidget"
          @submit-data="launchWidget"
        />
      </text-notif>
    </Transition>

    <!-- modal that displays the available widget customizations -->
    <Transition>
      <Modal
        v-show="showCustomizationModal"
        :is-active="showCustomizationModal"
        title="Widget Customization"
        @close-action="showCustomizationModal = !showCustomizationModal"
        @keyup.esc="showCustomizationModal = !showCustomizationModal"
      >
        <!-- shopperResultURL -->
        <FormInput
          label="Shopper Result URL"
          helper="The user is redirected to this page after clicking the Pay Now button on the widget."
          v-model="shopperResultURL"
        />

        <!-- widget style -->
        <div class="field">
          <label class="label">Style</label>
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

        <!-- Brand lists -->
        <div class="field">
          <label class="label">Brands</label>
          <div class="control is-expanded">
            <div class="select is-small is-fullwidth is-multiple">
              <select class="mono" multiple size="8" v-model="selectedBrands">
                <option v-for="brand in brandList" :key="brand">
                  {{ brand }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <text-notif>
          Selected Brands:
          <span v-for="brand in selectedBrands" :key="brand"
            >"{{ brand }}",
          </span>
        </text-notif>

        <label class="label">Widget Behavior (more coming soon...)</label>
        <FormSwitch
          id="requireCvv"
          function-name="Require CVV"
          label="Determine whether the CVV field is presented on the payment form."
          v-model="wpwlOptions.requireCvv"
        />

        <FormSwitch
          id="allowEmptyCvv"
          function-name="Allow Empty CVV"
          label="Determines whether the CVV field can be empty. By default it is false."
          v-model="wpwlOptions.allowEmptyCvv"
        />

        <FormSwitch
          id="showCVVHint"
          function-name="Show CVV Hint"
          label="If set to true then the credit card form will display a hint on where the CVV is located when the mouse is hovering over the CVV field."
          v-model="wpwlOptions.showCVVHint"
        />

        <FormSwitch
          id="validation"
          function-name="Validation"
          label="If false, it disables validation and the functions 'validate' and 'on Submit' will not be called."
          v-model="wpwlOptions.validation"
        />

        <FormSwitch
          id="showLabels"
          function-name="Show Labels"
          label="Shows or hides input labels. Default is true."
          v-model="wpwlOptions.showLabels"
        />

        <FormSwitch
          id="showPlaceholders"
          function-name="Show Placeholders"
          label="Shows or hides input placeholders. Default is true."
          v-model="wpwlOptions.showPlaceholders"
        />

        <FormSwitch
          id="autoSwitch"
          function-name="Auto-launch Widget"
          label="Launches the widget if a checkout ID is generated successfully."
          v-model="autoLaunchWidget"
        />

        <TextNotif color-type="is-warning">
          This app does <strong>not</strong> have JQuery installed. Please
          manually reload the page if your desired customization isn't loading
          properly.
        </TextNotif>
      </Modal>
    </Transition>

    <!-- modal that displays the widget -->
    <Transition>
      <Modal
        v-show="showModal"
        :is-active="showModal"
        title="CopyandPay Widget"
        @close-action="closeWidget"
        footer="Closing this modal window will automatically reset the page to properly reload the widget."
      >
        <!-- widget here -->
        <div id="form-goes-here"></div>
      </Modal>
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