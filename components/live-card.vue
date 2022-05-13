<template>
  <div v-if="verification_load"></div>
  <v-col v-else cols="12" md="6" lg="3" sm="6" xl="2" class="ma-0 pa-0">
    <v-card>
      <v-card-title class="pb-0 pt-2"> {{ item.topic }} </v-card-title>

      <p class="pl-4 pr-4 mt-4">Rs. {{ item.price }}/=</p>

      <p class="pl-4 pr-4 mt-4 amber--text">
        Count of Enrolment : {{ enrolCount }}
      </p>

      <v-card-actions class="pr-3 pb-3">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!verified"
          @click="buy(item, 'live_class')"
          color="green darken-2"
        >
          Buy
        </v-btn>
        <v-btn icon @click="show = !show" color="green">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            <v-col v-if="verified" class="ma-0 pa-0">
              <span class="title-text">Link</span>
              <p class="subtitle-text">{{ item.link }}</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <span class="title-text">Date & Time</span>
              <p class="subtitle-text ma-0">{{ item.schedule_date }}</p>
              <p class="subtitle-text">{{ item.schedule_time }}</p>
            </v-col>
            <v-col class="ma-0 pa-0 pt-2">
              <span class="title-text">Teacher</span>
              <p class="subtitle-text">{{ item.teacher_name }}</p>
            </v-col>
            <!-- <v-col class="ma-0 pa-0 pt-2">
              <p class="title-text ma-0 pa-0">
                Your can request to a live class
              </p>
              <v-btn class="green darken-2 mt-2">Request </v-btn>
            </v-col> -->
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: "online-card-compo",
  props: ["item"],
  data() {
    return {
      show: false,
      enrolCount: 0,
      verification_load: true,
      verified: false,
    };
  },
  computed: {
    verificationList() {
      return this.$store.getters["verification/bought_live_classes"];
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
.title-text {
  font-size: 15px !important;
  color: rgb(145, 145, 145);
}
.subtitle-text {
  color: rgb(255, 255, 255);
}
</style>