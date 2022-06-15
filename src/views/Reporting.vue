<script>
import TextNotif from "../components/TextNotif.vue";
import FormPassword from "../components/FormPassword.vue";
import FormInput from "../components/FormInput.vue";
import FormSwitch from "../components/FormSwitch.vue";
import FormButton from "../components/FormButton.vue";
import FormDisplayResponse from "../components/FormDisplayResponse.vue";

// this will allow parcel to include the php file in the build process so that everything is in 1 directory
const queryPath = require("url:../../php/query.php");

export default {
  components: {
    TextNotif,
    FormPassword,
    FormInput,
    FormSwitch,
    FormButton,
    FormDisplayResponse,
  },

  data() {
    return {
      request: {
        endpoint: "",
        authToken: "OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=",
        entityId: "8a8294174b7ecb28014b9699220015ca",
        isOngoing: false,
      },
      isLiveMode: false,
      query: "",
      selectedQueryType: "paymentId",
      response: "",
      error: "",
    };
  },

  methods: {
    buildURL() {
      let subDomain = "";

      // todo build URL
      if (this.isLiveMode) {
        subDomain = "eu-prod";
      } else {
        subDomain = "eu-test";
      }

      if (this.selectedQueryType === "paymentId") {
        this.request.endpoint = `https://${subDomain}.oppwa.com/v1/query/${this.query}?entityId=${this.request.entityId}`;
      } else {
        this.request.endpoint = `https://${subDomain}.oppwa.com/v1/query?entityId=${this.request.entityId}&merchantTransactionId=${this.query}`;
      }

      console.info(`Generated URL: ${this.request.endpoint}`);
    },

    async processQuery() {
      // clear current response if any
      this.response = "";

      // build url as per selected type
      this.buildURL();

      // hit endpoint
      try {
        this.request.isOngoing = true; // start button loading animation

        const rawResponse = await fetch(queryPath, {
          method: "POST",
          body: JSON.stringify({
            authToken: this.request.authToken,
            url: this.request.endpoint,
          }),
        });

        // clone response in case parsing to JSON fails
        const backupResponse = rawResponse.clone();

        // parse response to json, else to text
        try {
          this.response = await rawResponse.json();
        } catch (error) {
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
    <!-- TOKEN -->
    <FormPassword
      label="Access Token"
      placeholder="OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg="
      helper="The access token can be taken from the backend UI under Administration > Account data > Merchant / Channel Info only if you have specific administration rights."
      v-model="request.authToken"
    />

    <br />

    <!-- entity ID -->
    <FormInput
      label="Entity ID"
      placeholder="8a8294174b7ecb28014b9699220015ca"
      helper="Processing ID where the transaction transpired."
      v-model="request.entityId"
      @keyup.enter="processQuery"
    />

    <!-- query type and query -->
    <label class="label">Query</label>
    <div class="field has-addons">
      <p class="control">
        <span class="select is-small">
          <select class="mono" v-model="selectedQueryType">
            <option>paymentId</option>
            <option>merchantTransactionId</option>
          </select>
        </span>
      </p>
      <p class="control is-expanded">
        <input
          type="text"
          class="input is-small mono"
          v-model="query"
          @keyup.enter="processQuery"
        />
      </p>
    </div>
    <p class="help">Select the type and input your query.</p>

    <!-- <br /> -->

    <!-- toggle for environments -->
    <FormSwitch
      functionName="Enable LIVE mode"
      id="liveModeToggle"
      label="Toggles the query between test and live environments"
      v-model="isLiveMode"
    />

    <nav class="level">
      <div class="level-item">
        <FormButton
          buttonIcon="fas fa-search"
          buttonLabel="Search"
          buttonSize="is-small"
          :isLoading="request.isOngoing"
          :isRounded="true"
          @click="processQuery"
        />
      </div>
    </nav>

    <!-- display response -->
    <Transition>
      <text-notif v-if="response">
        <FormDisplayResponse
          label="JSON Response"
          :row-count="30"
          :data="response"
          v-if="response"
        />
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