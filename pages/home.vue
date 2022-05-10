<template>
  <div>
    <!-- Tool Bar -->
    <v-app-bar dark dense fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>TOP-LEARN</v-toolbar-title>

      <v-spacer />
      <v-btn icon @click="filterDialog = !filterDialog">
        <v-icon color="orange">mdi-filter</v-icon>
      </v-btn>
      <v-btn icon @click="signOut()"
        ><v-icon class="appBar-icon">mdi-logout</v-icon></v-btn
      >

      <template v-slot:extension>
        <v-tabs v-model="tab" centered color="orange">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" fixed bottom temporary>
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
          <onlineclass v-else />
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
          <v-btn color="green darken-2" @click="filterCommit()"> Filter </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import videospage from "@/pages/main/videos.vue";
import tests from "@/pages/main/tests.vue";
import onlineclass from "@/pages/main/live-class.vue";
import Cookies from "js-cookie";

var gradesRef;
var subjectsRef;

export default {
  name: "home_screen",
  components: {
    videospage,
    tests,
    onlineclass,
  },
  data() {
    return {
      tab: null,
      filterGrade: null,
      filterSubject: null,
      items: ["Videos", "Tests", "Live Classes"],
      gradesList: [],
      subjectsList: [],
      // drawerItems: [
      //   // { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
      //   // { title: "Profile", icon: "mdi-account-circle", to: "/user/profile" },
      // ],
      // topicListData: [],
      drawer: false,
      loading: false,
      show: false,
      filterDialog: false,
    };
  },
  beforeCreate() {
    this.$store.commit("systemUser/findUserData");
  },
  mounted() {
    gradesRef = this.$fire.firestore.collection("grades");
    subjectsRef = this.$fire.firestore.collection("subjects");
    this.initialize();
    this.loadBoughtItems();
  },
  computed: {
    // userName() {
    //   return this.$store.getters["systemUser/userData"]?.name;
    // },
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
              this.gradesList.push(doc.data()["grade_name"]);
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
            this.loading = false;
          }
        );
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    loadBoughtItems() {
      try {
      } catch (error) {}
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
.tab_container {
  background-color: #121212 !important;
}
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
</style>