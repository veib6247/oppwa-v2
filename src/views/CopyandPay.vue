<script>
// import utilities for string processing and etc.
import { processParameters, parseBrands } from "../utils/stringProcessing";
import { brandList } from "../utils/brandList";
import { nanoid } from "nanoid";

// import reusable components
import FormInput from "../components/FormInput.vue";
import FormPassword from "../components/FormPassword.vue";
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
    FormPassword,
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
          "customer.givenName=Bruce",
          "customer.surname=Wayne",
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
        locale: "en",
        style: "card",
        requireCvv: true,
        allowEmptyCvv: false,
        showCVVHint: false,
        maskCvv: false,
        validation: true,
        showLabels: true,
        showPlaceholders: true,
        brandDetection: true,
        brandDetectionType: "binlist",
        autofocus: "card.number",
        disableCardExpiryDateValidation: false,
        disableSubmitOnEnter: false,
        showTaxNumberField: false,
        displayBic: false,
        enableSAQACompliance: false,
        forceCardHolderEqualsBillingName: false,
        spinner: {
          color: "pink",
        },
      },

      disableButtons: {
        btnRG: false,
        btnCOF: false,
      },

      brandList: "",
      selectedBrands: ["VISA", "MASTER"],
      overrideBrandlist: false,
      manualBrandlist: "",
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

      // get the host that was used for generating the checkout ID and use it as the script's src attribute
      const dummy_anchor = document.createElement("a");
      dummy_anchor.href = this.request.endPoint;

      widgetScript.src = `https://${dummy_anchor.host}/v1/paymentWidgets.js?checkoutId=${this.response.id}`;

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

      // check which brand list of apply
      if (this.overrideBrandlist) {
        widgetForm.setAttribute("data-brands", this.manualBrandlist);
      } else {
        widgetForm.setAttribute(
          "data-brands",
          parseBrands(this.selectedBrands)
        );
      }

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
    <text-notif colorType="is-info">
      COPYandPAY is a SAQ-A compliant payment-form solution, making it both
      secure and simple-to-integrate.
    </text-notif>

    <!-- ENDPOINT -->
    <FormInput
      label="API Endpoint"
      placeholder="https://eu-test.oppwa.com/v1/checkouts"
      helper="When sending requests to a live environment, change the subdomain to eu-prod"
      @keyup.enter="generateCheckoutId"
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
      :row-count="17"
      :placeholder="processParameters"
      @keyup.ctrl.enter="generateCheckoutId"
      v-model="request.frontEndParameters"
    />

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <FormButton
            button-label="Generate Checkout ID"
            :is-rounded="true"
            :is-loading="request.isOngoing"
            @submit-data="generateCheckoutId"
          />
        </div>
      </div>
      <div class="level-right">
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
        <div class="level-item">
          <FormButton
            button-label="Customize"
            button-icon="fas fa-cog"
            button-size="is-small"
            @submit-data="showCustomizationModal = !showCustomizationModal"
          />
        </div>
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
      <text-notif v-if="result.code" color-type="is-gray">
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
        footer="Dev note: If your screen gets stuck and can't scroll up, press shift + tab multiple times to manually go up. You can also click on a field and press esc to close. Fix coming soon."
        @close-action="showCustomizationModal = !showCustomizationModal"
        @keyup.esc="showCustomizationModal = !showCustomizationModal"
      >
        <!-- shopperResultURL -->
        <FormInput
          label="Shopper Result URL"
          helper="The user is redirected to this page after clicking the Pay Now button on the widget."
          v-model="shopperResultURL"
        />

        <!-- locale -->
        <FormInput
          label="Locale"
          helper="Display language of the widget."
          v-model="wpwlOptions.locale"
        />

        <!-- autofocus -->
        <FormInput
          label="Autofocus"
          helper="Lands the cursor on the indicated field once the widget loads."
          v-model="wpwlOptions.autofocus"
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

        <label class="label">Widget Customizations</label>
        <p class="is-size-7">
          The following are shown with their default values in the
          <a
            href="https://docs.oppwa.com/tutorials/integration-guide/widget-api"
            target="_blank"
            rel="noopener noreferrer"
            >documentation</a
          >.
        </p>
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
          function-name="CVV Hint"
          label="Displays a hint on where the CVV is located on hover."
          v-model="wpwlOptions.showCVVHint"
        />

        <FormSwitch
          id="maskCvv"
          function-name="Mask CVV"
          label="This will hide the values inputted in the CVV field."
          v-model="wpwlOptions.maskCvv"
        />

        <FormSwitch
          id="enableSAQACompliance"
          function-name="Enable SAQA Compliance"
          label="Use to make the credit card form SAQA compliant. Enabling this will render the card holder and expiry date fields in separate iFrames."
          v-model="wpwlOptions.enableSAQACompliance"
        />

        <FormSwitch
          id="disableCardExpiryDateValidation"
          function-name="Disable Expiry Validation"
          label="If enabled, the form will not check for valid expiry date."
          v-model="wpwlOptions.disableCardExpiryDateValidation"
        />

        <FormSwitch
          id="disableSubmitOnEnter"
          function-name="Disable Submit On Enter"
          label="Disables the submit of payment form when Enter key is pressed."
          v-model="wpwlOptions.disableSubmitOnEnter"
        />

        <FormSwitch
          id="showTaxNumberField"
          function-name="Show TaxNumber Field"
          label="The CPF field is needed for payments processed in Brazil."
          v-model="wpwlOptions.showTaxNumberField"
        />

        <FormSwitch
          id="displayBic"
          function-name="Display BIC"
          label="When enabled with DIRECTDEBIT_SEPA brand, this will display the BIC field."
          v-model="wpwlOptions.displayBic"
        />

        <FormSwitch
          id="forceCardHolderEqualsBillingName"
          function-name="Holder = Billing"
          label="Displays a field for the given name and a separate field for the surname."
          v-model="wpwlOptions.forceCardHolderEqualsBillingName"
        />

        <FormSwitch
          id="brandDetection"
          function-name="Brand Detection"
          label="Automatic detection during typing."
          v-model="wpwlOptions.brandDetection"
        />

        <FormSwitch
          id="validation"
          function-name="Validation"
          label="Disables validation and the functions 'validate' and 'on Submit' will not be called."
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
          function-name="Autolaunch (Internal)"
          label="Launches the widget if a checkout ID is generated successfully."
          v-model="autoLaunchWidget"
        />

        <!-- override brand list -->
        <FormSwitch
          id="overrideBrandlist"
          function-name="Override Brand List (Internal)"
          label="Manually input your brand list."
          v-model="overrideBrandlist"
        />

        <Transition>
          <fieldset :disabled="overrideBrandlist" v-if="!overrideBrandlist">
            <!-- Brand lists -->
            <div class="field">
              <label class="label">Brands</label>
              <div class="control is-expanded">
                <div class="select is-small is-fullwidth is-multiple">
                  <select
                    class="mono"
                    multiple
                    size="8"
                    v-model="selectedBrands"
                  >
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
          </fieldset>
        </Transition>

        <!-- manual input of brand list -->
        <Transition>
          <FormInput
            label="Brands"
            placeholder="VISA MASTER AMEX JCB"
            helper="Keep each brand in all-caps and separated by a space."
            v-model="manualBrandlist"
            v-if="overrideBrandlist"
          />
        </Transition>
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