<script>
// import reusable components
import FormButton from "./components/FormButton.vue";
import TextNotif from "./components/TextNotif.vue";

// import the result script
const copyAndPayScriptPath = require("url:./../php/GetSessionData.php");

export default {
  components: { FormButton, TextNotif },
  data() {
    return {
      msg: "Data Received",
      checkoutID: "",
      resourcePath: "",
      sessionData: "",
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
    async fetchTransactionResults() {
      try {
        const rawReponse = await fetch(copyAndPayScriptPath, {
          method: "POST",
        });

        this.sessionData = await rawReponse.json();
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.getURLParameters();
    this.fetchTransactionResults();
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

  <FormButton
    button-icon="fas fa-redo"
    button-label="Go Back"
    :is-rounded="true"
    @submit-data="redirectToHome"
  />
</template>