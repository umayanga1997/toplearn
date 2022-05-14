<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="orange--text"
        >Test Studio -
        <span class="white--text">{{
          this.testData.topic
        }}</span></v-toolbar-title
      >
      <v-spacer></v-spacer>
      {{ timer_count }}
    </v-app-bar>

    <loading-compo v-if="loading" />
    <v-container v-else class="ma-0 pa-0 flex-class" fluid>
      <test-q-card
        v-for="(item, i) in items"
        :key="item.id"
        :item="{ ...item, index_no: i + 1 }"
        :length_items="items.length"
      />
    </v-container>
    <vs-dialog v-model="markDialog">
      <template #header>
        <h4 class="not-margin">
          {{ marks >= 40 ? "Congratulations" : "Ops.." }}
        </h4>
      </template>

      <div class="con-form">
        {{ marks.toFixed(2) }}
      </div>
    </vs-dialog>

    <v-fab-transition>
      <v-btn
        fab
        large
        dark
        top
        fixed
        right
        class="mt-15 mr-5"
        @click="!submitionTrigger ? submit() : reTry()"
        :color="!submitionTrigger ? 'green darken-2' : 'blue darken-2'"
      >
        <v-icon>{{ !submitionTrigger ? "mdi-check" : "mdi-refresh" }}</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import moment from "moment";
import jwt from "jsonwebtoken";

var testsRef;

export default {
  name: "ex_studio_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    markDialog: false,
    marks: 0,
    setTimeInterval: null,
    timer_count: 0,
    btnLoading: false,
    testData: "",
    search: "",
    items: [],
    editedItem: [],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    },
    submitionTrigger() {
      return this.$store.getters["submitTrigger/triggerValue"];
    },
    calculatedQuestions() {
      return this.$store.getters["marks/question_count"];
    },
    totalOfMarks() {
      return this.$store.getters["marks/total_of_marks"];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    calculatedQuestions(val) {
      if (val != 0 && val == this.items.length) {
        this.marks = this.totalOfMarks;
        this.markDialog = true;
      }
    },
  },

  created() {
    // Decode query token
    var token = this.$route.query.t;
    var data;
    jwt.verify(token, "navigate_q", function (error, decoded) {
      if (error == null) data = decoded;
      else
        this.$store.dispatch("alertState/message", [
          "Payment data not found.",
          "error",
        ]);
    });
    // Set decoded data
    this.testData = data;
    //
    testsRef = this.$fire.firestore.collection("tests");
    this.initialize();
  },
  mounted() {
    this.timerCounter();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        testsRef
          .doc(this.testData.id)
          .collection("questions")
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.items = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
            });

            // Genarate random list and Set
            this.items = this.items.sort(() => Math.random() - 0.5);

            this.loading = false;
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    async submit() {
      try {
        this.$store.commit("submitTrigger/trigger", true);
        clearInterval(this.setTimeInterval);
        this.timer_count = "Submited!";
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    async reTry() {
      try {
        this.timerCounter();
        this.$store.commit("marks/clearMarks");
        this.$store.commit("submitTrigger/trigger", false);
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },

    timerCounter() {
      var countDownDate = new Date().setTime(
        new Date().getTime() + this.testData.duration_hr * 60 * 60 * 1000
      );

      this.setTimeInterval = setInterval(() => {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        this.timer_count = hours + " h " + minutes + " m " + seconds + " s";
        if (distance < 0) {
          clearInterval(this.setTimeInterval);
          // Auto submition
          this.$store.commit("submitTrigger/trigger", true);
          this.timer_count = "Time is Over! & Auto submitted!";
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
.flex-class {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>