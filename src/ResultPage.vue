<script>
// import reusable components
import FormButton from "./components/FormButton.vue";
import TextNotif from "./components/TextNotif.vue";
import FormDisplayResponse from "./components/FormDisplayResponse.vue";

// import the result script
const fetchSessionPath = require("url:./../php/GetSessionData.php");
const getTransactionResultPath = require("url:./../php/GetTransactionResults.php");

export default {
  components: { FormButton, TextNotif, FormDisplayResponse },
  data() {
    return {
      msg: "Data Received",
      checkoutID: "",
      resourcePath: "",
      sessionData: "",
      error: "",
      response: "",
    };
  },

  methods: {
    redirectToHome() {
      // get current URL
      const currentURL = new URL(window.location.href).toString();
      // removes the last part of the URL to then redirects back to the homepage
      window.location.replace(currentURL.split("/").slice(0, -1).join("/"));
    },

    // on page load, sets the passed ID and path
    getURLParameters() {
      const queryString = window.location.search;
      if (queryString !== "") {
        console.info("Search query:", queryString);
      }

      const urlParams = new URLSearchParams(queryString);

      if (urlParams.has("id")) {
        this.checkoutID = urlParams.get("id");
      }

      if (urlParams.has("resourcePath")) {
        this.resourcePath = urlParams.get("resourcePath");
      }
    },

    /**
     * call server back to get transaction results
     */
    async fetchSessionData() {
      try {
        const rawReponse = await fetch(fetchSessionPath, {
          method: "GET",
        });

        // clone promise to parse to text later in case server does not respond with expected JSON format
        const backupResponse = rawReponse.clone();

        try {
          // parse to json and save
          this.sessionData = await rawReponse.json();
          // get the results
          this.fetchTransactionResult();
        } catch (error) {
          this.error = await backupResponse.text();
          console.error(error, this.error);
        }

        // fetch error catching
      } catch (error) {
        console.error(error);
      }
    },

    async fetchTransactionResult() {
      try {
        const rawReponse = await fetch(getTransactionResultPath, {
          method: "POST",
          body: JSON.stringify({
            authToken: this.sessionData.authToken,
            url: `${this.returnSubdomain}.oppwa.com${this.resourcePath}`,
            data: this.sessionData.parameters,
          }),
        });

        this.response = await rawReponse.json();
      } catch (error) {
        console.error(error);
      }
    },
  },

  computed: {
    returnSubdomain() {
      return this.sessionData.endPoint.split(".")[0];
    },
  },

  // autoruns
  mounted() {
    this.getURLParameters();
    this.fetchSessionData();
  },
};
</script>

<template>
  <label for="" class="label">{{ msg }}</label>

  <TextNotif color-type="is-danger" v-if="!checkoutID">
    <code>checkoutID</code> was not detected! Please try the Reporting API
    instead.
  </TextNotif>

  <TextNotif color-type="is-danger" v-if="!resourcePath">
    <code>resourcePath</code> was not detected! Please try the Reporting API
    instead.
  </TextNotif>

  <div class="table-container" v-if="resourcePath && checkoutID">
    <table
      class="
        table
        mono
        is-bordered is-narrow is-hoverable is-fullwidth is-size-7
      "
    >
      <tbody>
        <tr>
          <th>ID</th>
          <td>{{ checkoutID }}</td>
        </tr>
        <tr>
          <th>Resource Path</th>
          <td>{{ resourcePath }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <Transition>
    <div v-if="!response">
      <label class="label">Fetching Transaction Results</label>
      <progress class="progress is-small is-dark" max="100">15%</progress>
      <br />
    </div>
  </Transition>

  <Transition>
    <FormDisplayResponse
      label="JSON Response"
      :row-count="38"
      :data="response"
      v-if="response"
    />
  </Transition>

  <FormButton
    button-icon="fas fa-redo"
    button-label="Go Back"
    :is-rounded="true"
    @submit-data="redirectToHome"
  />
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