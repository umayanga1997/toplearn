<template>
  <div>
    <loading-compo v-if="loading" />
    <v-row v-else justify="center" class="ma-0 pa-0 card-section" dense>
      <data-not-found v-if="items.length == 0"></data-not-found>
      <tute-card v-else v-for="item in items" :key="item.id" :item="item" />
    </v-row>
  </div>
</template>

<script>
var tutesRef;

export default {
  name: "tutes_screen",
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
  },

  watch: {
    // From mixin
    filterValue(value) {
      this.items = this.filtering(value, this.originalItems);
    },
  },

  created() {
    tutesRef = this.$fire.firestore.collection("tutes");
    this.initialize();
  },

  methods: {
    initialize() {
      try {
        this.loading = true;
        tutesRef.onSnapshot(
          { includeMetadataChanges: true },
          (querySnapshot) => {
            this.items = [];
            this.originalItems = [];
            querySnapshot.docs.forEach((doc) => {
              this.items.push(doc.data());
              this.originalItems.push(doc.data());
            });
            // Filter Management
            if (this.filterValue != null && this.filterValue != "All")
              this.items = this.filtering(this.filterValue, this.originalItems);
            this.loading = false;
          }
        );
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