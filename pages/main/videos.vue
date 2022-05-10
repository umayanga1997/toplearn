<template>
  <div>
    <loading-compo v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
      <video-card v-for="item in items" :key="item.id" :item="item" />
    </v-row>
  </div>
</template>

<script>
var videosRef;

export default {
  name: "videos_screen",
  data: () => ({
    loading: false,
    btnLoading: false,
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
    videosRef = this.$fire.firestore.collection("videos");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        videosRef
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
.file-input {
  max-height: 38px;
}
</style>