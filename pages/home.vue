<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dense fixed app class="white">
      <v-app-bar-nav-icon
        style="color: #428e3c"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <img
          width="110"
          class="pt-5"
          src="~/assets/logo/logo-large-color.png"
        />
      </v-toolbar-title>

      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            @click="filterDialog = !filterDialog"
          >
            <v-icon color="green darken-2">mdi-filter</v-icon>
          </v-btn>
        </template>
        <span>Filter</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="signOut()"
            ><v-icon color="green darken-2">mdi-logout</v-icon></v-btn
          >
        </template>
        <span>Sign Out</span>
      </v-tooltip>

      <template v-slot:extension>
        <v-tabs v-model="tab" centered color="">
          <v-tabs-slider color="orange--text text--darken-3"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" dark fixed bottom temporary>
      <v-list-item :to="'/user/profile'" router>
        <v-list-item-avatar>
          <!-- <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img> -->
          <v-icon large>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{
            userData != null ? userData.name : ""
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            userData != null ? userData.student_id : ""
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!-- <v-list dense>
        <v-list-item
          v-for="(item, i) in drawerItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-icon> </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
      <!-- <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item>
              <v-list-item-title>Foo</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Bar</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Fizz</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Buzz</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list> -->
    </v-navigation-drawer>
    <!-- Tabs -->
    <!-- Default Page Like Home Page -->
    <v-tabs-items v-model="tab">
      <v-tab-item
        class="tab_container"
        v-for="(item, index) in items"
        :key="item"
      >
        <v-container fluid>
          <!-- <dashboard v-if="index == 0" /> -->
          <videospage v-if="index == 0" />
          <tests v-else-if="index == 1" />
          <tutes v-else />
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="filterDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Filter</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-1">
            <!-- <v-col>
              <v-select :items="items" label="Grade" dense outlined></v-select>
            </v-col> -->
            <v-col cols="12" md="6" lg="6" sm="12">
              <v-select
                :items="gradesList"
                label="Grade"
                v-model="filterGrade"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" lg="6" sm="12">
              <v-select
                :items="subjectsList"
                label="Subject"
                v-model="filterSubject"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-1" text @click="filterDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-2" dark @click="filterCommit()">
            Filter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import videospage from "@/pages/main/videos.vue";
import tests from "@/pages/main/tests.vue";
// import onlineclass from "@/pages/main/live-class.vue";
import tutes from "@/pages/main/tutes.vue";
import Cookies from "js-cookie";

var gradesRef;
var subjectsRef;
var studentsRef;

export default {
  name: "home_screen",
  components: {
    videospage,
    tests,
    // onlineclass,
    tutes,
  },
  data() {
    return {
      tab: null,
      filterGrade: null,
      filterSubject: null,
      items: ["Videos", "Tests", "Tutes"],
      gradesList: [],
      subjectsList: [],
      drawer: false,
      loading: false,
      show: false,
      filterDialog: false,
    };
  },
  beforeCreate() {
    this.$store.commit("systemUser/findUserData");
  },
  created() {
    gradesRef = this.$fire.firestore.collection("grades");
    subjectsRef = this.$fire.firestore.collection("subjects");
    studentsRef = this.$fire.firestore.collection("students");
    this.initialize();
  },
  computed: {
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },

  methods: {
    async signOut() {
      try {
        await this.$fire.auth
          .signOut()
          .then(async () => {
            // localStorage.removeItem("systemuser_st");
            Cookies.remove("access_token_st");
            this.$store.dispatch("alertState/message", [
              "Sign out successfully.",
              "success",
            ]);
            // this.$router.replace("/user/auth").catch(() => {});
            // this.$router.go().catch(() => {});
            // window.history.go("/"); // Only Web
          })
          .catch((error) => {
            this.$store.dispatch("alertState/message", [error, "error"]);
          });
      } catch (error) {
        this.$store.dispatch("alertState/message", [error, "error"]);
      }
    },
    async initialize() {
      try {
        this.loading = true;
        await gradesRef.onSnapshot(
          { includeMetadataChanges: true },
          (querySnapshot) => {
            this.gradesList = [];
            this.gradesList.push("All");
            querySnapshot.docs.forEach((doc) => {
              this.gradesList.push(doc.data()["grade"]);
            });
          }
        );
        await subjectsRef.onSnapshot(
          { includeMetadataChanges: true },
          (querySnapshot) => {
            this.subjectsList = [];
            this.subjectsList.push("All");
            querySnapshot.docs.forEach((doc) => {
              this.subjectsList.push(doc.data()["subject"]);
            });
          }
        );
        this.loadBoughtItems();
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    loadBoughtItems() {
      try {
        var videoList = [];
        var testsList = [];
        // var liveClassesList = [];
        var tutesList = [];
        this.$fire.auth.onAuthStateChanged(async (user) => {
          if (user) {
            studentsRef
              .doc(user?.uid)
              .get()
              .then(async (snapshot) => {
                await snapshot.ref
                  .collection("bought_videos")
                  .where("isExpired", "==", false)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.docs?.forEach((element) => {
                      videoList.push(element.data()["id"]);
                    });
                  });
                await snapshot.ref
                  .collection("bought_tests")
                  .where("isExpired", "==", false)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.docs?.forEach((element) => {
                      testsList.push(element.data()["id"]);
                    });
                  });
                // await snapshot.ref
                //   .collection("bought_live_classes")
                //   .get()
                //   .then((querySnapshot) => {
                //     querySnapshot.docs?.forEach((element) => {
                //       liveClassesList.push(element.data()["id"]);
                //     });
                //   });
                await snapshot.ref
                  .collection("bought_tutes")
                  .where("isExpired", "==", false)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.docs?.forEach((element) => {
                      tutesList.push(element.data()["id"]);
                    });
                  });
              })
              .then(() => {
                this.$store.commit("verification/setData", [
                  videoList,
                  testsList,
                  tutesList,
                  // liveClassesList,
                ]);
                this.loading = false;
              });
          }
        });
        this.openWgDialog();
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    openWgDialog() {
      var value = this.filterValue;
      if (value == null || value == "") this.filterDialog = true;
      else {
        this.filterGrade = value[0];
        this.filterSubject = value[1];
      }
    },
    filterCommit() {
      this.$store.commit("filter/filter", [
        this.filterGrade,
        this.filterSubject,
      ]);
    },
  },
};
</script>

<style lang="scss">
// .tab_container {
//   // background-color: #121212 !important;
// }
.card-section {
  gap: 15px;
  white-space: normal;
  & .v-card {
    padding: 0px !important;
    margin: 0px !important;
  }
}
.v-navigation-drawer {
  max-height: 63px !important;
  position: absolute;
  background-color: green !important;
  top: 40% !important;
}
.v-tab {
  color: #428e3c !important;
  font-weight: 600;
}
.v-tab--active {
  // font-weight: 600;
  color: #ef6c00 !important;
}
</style>