<template>
  <div v-if="verification_load"></div>
  <v-col v-else cols="12" lg="3" md="4" sm="12" class="ma-0 pa-0">
    <v-card align="center" v-if="!verified">
      <br />
      <v-icon size="100" color="grey" class="pa-0 ma-0">mdi-youtube</v-icon>

      <v-col cols="12" class="pa-0 pb-2 ma-0" align="start">
        <v-card-title class="orange--text">
          {{ item.topic }}
        </v-card-title>

        <v-card-subtitle>
          {{ item.description }}
        </v-card-subtitle>

        <p class="pl-4 pr-3 yellow--text">Rs. {{ item.price }}/=</p>
        <p class="pl-4 pr-4 mt-4 grey--text">
          Count of Bought : {{ boughtCount }}
        </p>
      </v-col>
      <v-card-actions class="pr-3 pb-3">
        <v-spacer></v-spacer>
        <v-btn color="green darlen-3"> Buy </v-btn>
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

      <v-card-title> {{ item.topic }} </v-card-title>

      <v-card-subtitle> {{ item.description }} </v-card-subtitle>

      <p class="pl-4 pr-3">Rs. {{ item.price }}/=</p>

      <p class="pl-4 pr-4 mt-4 amber--text">
        Count of Bought : {{ boughtCount }}
      </p>

      <v-container class="download-class">
        <a :href="item.note_link" download>
          <v-icon>mdi-download</v-icon> <span>Note</span>
        </a>

        <a class="ml-5" :href="item.summary_link" download
          ><v-icon>mdi-download</v-icon><span>Summary</span>
        </a>
      </v-container>
      <br />
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
  mounted() {
    this.verification();
  },
  // watch: {
  //   verificationList(value) {
  //     this.verification(value);
  //   },
  // },
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
  & a {
    color: lightgreen;
    text-decoration: none;
    & i {
      color: lightgreen !important;
      padding-right: 2px;
    }
  }
}
</style>