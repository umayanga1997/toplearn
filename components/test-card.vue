<template >
  <v-col cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-card-title style="font-weight: 700"> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>
      <v-card-subtitle class="pt-0"
        >Duration : {{ item.duration_hr }} Hour</v-card-subtitle
      >

      <p class="pl-4 pr-4 price-class">Rs. {{ item.price }}/=</p>

      <!-- <p class="pl-4 pr-4 mt-4 amber--text">
        Count of Bought : {{ boughtCount }}
      </p> -->

      <v-card-actions v-if="!verification_load" class="pr-3 pb-3">
        <v-spacer></v-spacer>

        <v-btn
          color="white green--text darken-2--text"
          dark
          v-if="verified"
          @click="navigate"
        >
          <v-icon class="pr-1">mdi-note-edit</v-icon
          ><span class="btn-width-txt">Take test</span>
        </v-btn>
        <v-btn dark v-else @click="buy(item, 'test')" color="green darken-2">
          Buy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
import jwt from "jsonwebtoken";

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
  watch: {
    verificationList(value) {
      this.verification();
    },
  },
  methods: {
    navigate() {
      let token = jwt.sign(
        JSON.stringify({
          id: this.item.id,
          topic: this.item.topic,
          duration_hr: this.item.duration_hr,
        }),
        "navigate_q"
      );
      this.$router.push({
        path: "test_studio",
        query: { t: token },
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