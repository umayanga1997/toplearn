<template>
  <v-col cols="12" sm="12" lg="2" md="2" xl="2" class="ma-0 pa-0">
    <v-card>
      <!-- <v-row align-content="center" class="ma-0 pa-0"> -->
      <!-- <img :src="item.cover_img" class="img-object" height="auto" /> -->
      <v-img
        :src="item.cover_img"
        :lazy-src="item.cover_img"
        max-width="100%"
        max-height="auto"
        contain
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-title class="fs-17" style="font-weight: 700">
        {{ item.topic }}
      </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

      <p class="pl-4 pr-4 price-class">Rs. {{ item.price }}/=</p>

      <!-- <p class="pl-4 pr-4 mt-4 pink">Count of Sales : {{ salesCount }}</p> -->

      <v-container class="download-class pb-4">
        <v-btn
          v-if="verified"
          color="white green--text darken-2--text"
          @click="navigate(item.tute_link)"
          target="__blank"
        >
          <v-icon>mdi-download</v-icon> <span>Note</span>
        </v-btn>
        <v-btn dark v-else @click="buy(item, 'tute')" color="green darken-2">
          Buy
        </v-btn>
      </v-container>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "tute-card-compo",
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
      return this.$store.getters["verification/bought_tutes"];
    },
  },
  // created() {},
  mounted() {
    this.verification();
  },
  watch: {
    verificationList(value) {
      this.verification();
    },
  },
  methods: {
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
    navigate(link) {
      this.$router.push({
        path: "docviewer",
        query: { link: link },
      });
    },
  },
};
</script>

<style lang="scss">
.fs-17 {
  font-size: 17px;
}
// .img-object {
//   object-fit: contain;
//   max-width: 40%;
// }
</style>
