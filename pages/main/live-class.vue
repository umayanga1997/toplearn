<template>
  <div>
    <loading-compo v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
      <live-card v-for="item in items" :key="item.id" :item="item" />
    </v-row>
  </div>
</template>

<script>
var liveClassRef;

export default {
  name: "live_class_screen",
  data: () => ({
    loading: false,
    btnLoading: false,
    dateMenu: false,
    timeMenu: false,
    search: "",
    items: [],
    originalItems: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    },
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    // From mixin
    filterValue(value) {
      this.items = this.filtering(value, this.originalItems);
    },
  },

  created() {
    liveClassRef = this.$fire.firestore.collection("live_classes");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        liveClassRef
          // .where("teacher_id", "==", this.userData?.teacher_id)
          .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
            this.items = [];
            this.originalItems = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
              this.originalItems.push(doc.data());
            });
            // Filter Management
            if (this.filterValue != null || this.filterValue == "")
              this.items = this.filtering(this.filterValue, this.originalItems);
            this.loading = false;
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
</style>