<template >
  <div v-if="verification_load"></div>
  <v-col v-else cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-card-title> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

      <p class="pl-4 pr-4">Rs. {{ item.price }}/=</p>

      <p class="pl-4 pr-4 mt-4 amber--text">
        Count of Bought : {{ boughtCount }}
      </p>

      <v-card-actions class="pr-3 pb-3">
        <v-spacer></v-spacer>

        <v-btn v-if="verified" icon @click="navigate" color="orange">
          <v-icon>mdi-note-edit</v-icon>
        </v-btn>
        <v-btn v-else @click="buy(item)" color="green darlen-3"> Buy </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "test-card-compo",
  props: ["item"],
  data() {
    return {
      boughtCount: 0,
      verification_load: true,
      verified: false,
    };
  },
  computed: {
    verificationList() {
      return this.$store.getters["verification/bought_tests"];
    },
  },
  mounted() {
    this.verification();
  },
  methods: {
    navigate() {
      this.$router.push({
        path: "test_studio",
        query: { id: this.item.id, topic: this.item.topic },
      });
    },
    verification() {
      try {
        var vry = this.verificationList.some(
          (element) => element == this.item.id
        );
        if (vry) this.verified = true;
        else this.verified = false;
        this.verification_load = false;
      } catch (error) {
        console.log(error);
        this.verification_load = false;
      }
    },
  },
};
</script>