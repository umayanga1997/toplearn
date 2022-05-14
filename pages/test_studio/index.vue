<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="orange--text"
        >Test Studio -
        <span class="white--text">{{
          this.$route.query.topic
        }}</span></v-toolbar-title
      >
      <v-spacer></v-spacer
      ><v-btn
        @click="!submitionTrigger ? submit() : reTry()"
        :color="!submitionTrigger ? 'green darken-2' : 'blue darken-2'"
        >{{ !submitionTrigger ? "Submit" : "Try again" }}</v-btn
      >
    </v-app-bar>

    <loading-compo v-if="loading" />
    <v-container v-else class="ma-0 pa-0 flex-class" fluid>
      <test-q-card
        v-for="(item, i) in items"
        :key="item.id"
        :item="{ ...item, index_no: i + 1 }"
      />
    </v-container>

    <!-- <v-dialog persistent v-model="dialog" max-width="600px">
      <v-card v-if="dialogType != 'd'">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="6" sm="12">
                <v-select
                  :items="['Single Answer', 'Multiple Answer', 'Upload Answer']"
                  v-model="editedItem.question_type"
                  label="Question Type"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.question"
                  label="Question"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>

              <v-col
                v-if="editedItem.question_type != 'Upload Answer'"
                cols="12"
              >
                <v-textarea
                  v-model="editedItem.answers"
                  label="Answers"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>
              <v-col
                v-if="editedItem.question_type != 'Upload Answer'"
                cols="12"
              >
                <v-textarea
                  v-model="editedItem.currect_answers"
                  label="Currect Answer(s)"
                  dense
                  outlined
                  class="text-area-max-height"
                  height="110"
                  no-resize
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="btnLoading"
            color="blue darken-1"
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="btnLoading"
            :loading="btnLoading"
            color="blue darken-1"
            text
            @click="dialogType == 'a' ? saveData() : updateData()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="btnLoading"
            color="blue darken-1"
            text
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            :disabled="btnLoading"
            :loading="btnLoading"
            color="blue darken-1"
            text
            @click="deleteData()"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- <v-fab-transition>
      <v-btn
        fab
        large
        dark
        bottom
        @click="dialogAction(null, 'a')"
        fixed
        left
        class="mb-10 green darken-2"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition> -->
  </div>
</template>

<script>
// import { v4 as uuid } from "uuid";

var testsRef;
var testID;

export default {
  name: "ex_studio_screen",
  data: () => ({
    dialog: false,
    dialogType: "a",
    loading: false,
    btnLoading: false,
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
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    testID = this.$route.query.id;
    testsRef = this.$fire.firestore.collection("tests");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        testsRef
          .doc(testID)
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
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },
    async reTry() {
      try {
        this.$store.commit("submitTrigger/trigger", false);
      } catch (error) {
        console.log(error);
        this.btnLoading = false;
      }
    },

    clear() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
      this.noteFile = null;
      this.summaryFile = null;
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