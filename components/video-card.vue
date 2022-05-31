<template>
  <v-col cols="12" lg="3" md="4" sm="12" class="ma-0 pa-0">
    <v-card align="center" v-if="!verified">
      <br />
      <v-icon size="100" color="grey" class="pa-0 ma-0">mdi-youtube</v-icon>

      <v-col cols="12" class="pa-0 pb-2 ma-0" align="start">
        <v-card-title style="font-weight: 700">
          {{ item.topic }}
        </v-card-title>

        <v-card-subtitle>
          {{ item.description }}
        </v-card-subtitle>

        <p class="pl-4 pr-3 price-class">Rs. {{ item.price }}/=</p>
        <p class="pl-4 pr-4 mt-4 grey--text">
          Count of Bought : {{ boughtCount }}
        </p>
      </v-col>
      <v-card-actions v-if="!verification_load" class="pr-3 pb-3">
        <v-spacer></v-spacer>
        <v-btn @click="buy(item, 'video')" color="green darken-2" dark>
          Buy
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <div class="anti-main">
        <iframe
          :src="item.video_link"
          width="100%"
          height="auto"
          allow="autoplay"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        ></iframe>
        <div class="anti"></div>
      </div>

      <v-card-title style="font-weight: 700">
        {{ item.topic }}
      </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

      <p class="pl-4 pr-3 price-class">Rs. {{ item.price }}/=</p>

      <v-container class="download-class pb-4">
        <v-btn
          color="white green--text darken-2--text"
          @click="navigate(item.note_link)"
          target="__blank"
        >
          <v-icon>mdi-download</v-icon> <span class="btn-width-txt">Note</span>
        </v-btn>
        <v-btn
          color="white green--text darken-2--text"
          @click="navigate(item.summary_link)"
          target="__blank"
        >
          <v-icon>mdi-download</v-icon
          ><span class="btn-width-txt">Summary</span>
        </v-btn>
      </v-container>
      <!-- <br /> -->
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "video-card-compo",
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
      return this.$store.getters["verification/bought_videos"];
    },
  },
  // created() {},
  // mounted() {
  //   this.verification();
  // },
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
.anti-main {
  position: relative;
  & .anti {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
    height: 80px;
    width: 80px;
    background: transparent;
  }
}
.download-class {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  & button {
    // color: lightgreen !important;
    margin-left: 8px;
    text-decoration: none;
    & i {
      // color: lightgreen !important;
      padding-right: 2px;
    }
  }
}
</style>