<template>
  <v-col cols="12" md="6" lg="4" sm="12" id="card_container"></v-col>
</template>

<script>
export default {
  name: "payment_screen",
  data() {
    return {};
  },
  computed: {
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },
  created() {
    this.$store.commit("systemUser/findUserData");
  },
  mounted() {
    this.initPaymnet();
  },
  methods: {
    initPaymnet() {
      try {
        console.log();
        window.DirectPayCardPayment.init({
          container: "card_container", //<div id="card_container"></div>
          merchantId: "IA02319", //your merchant_id
          amount: "100.00",
          refCode: "DP12345", //unique referance code form merchant
          currency: "LKR",
          type: "ONE_TIME_PAYMENT",
          customerEmail: "abc@mail.com",
          customerMobile: this.userData.name_of_trustee,
          description: "test products", //product or service description
          debug: true,
          responseCallback: this.responseCallback,
          errorCallback: this.errorCallback,
          logo: "https://test.com/directpay_logo.png",
          apiKey:
            "d29a7144033061e3b3c772eee19772e87e580c4536c9f25d43eb6706495cc190",
        });
      } catch (error) {
        console.log(error);
      }
    },
    //response callback.
    responseCallback(result) {
      console.log("successCallback-Client", result);
      // * Student bought_videos
      // b_id
      // id // v_id
      // price
      // bought_date
      // transaction_id
      // exp_date
      //
      // * Teacher soled_videos
      // b_id
      // id // v_id
      // price
      // bought_date
      // transaction_id
      // exp_date
      // student_id
      alert(JSON.stringify(result));
    },

    //error callback
    errorCallback(result) {
      console.log("successCallback-Client", result);
      alert(JSON.stringify(result));
    },
  },
};
</script>

<style lang="scss">
#card_container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>