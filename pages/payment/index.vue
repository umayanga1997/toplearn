<template>
  <loading-compo v-if="loading" />
  <div v-else>
    <form method="POST" action="https://sandbox.ipay.lk/ipg/checkout">
      <input
        type="hidden"
        name="merchantWebToken"
        value="eyJhbGciOiJIUzUxMiJ9.eyJtaWQiOiIwMDAwMDIxNSJ9.ERTtW8gyLPl5dw39cUaO08kIuNZJvTH-hgfGG1Wh4j9vDHjKuaFanJMqW8Mi30o5aHwY86ZappNtpQ7GkEvrvQ"
      />
      <!-- Replace your web token -->
      <input type="hidden" name="orderId" value="OID123456" />
      <input type="hidden" name="orderDescription" value="My Order" />
      <!-- Optional -->
      <input
        type="hidden"
        name="returnUrl"
        value="http://mywebsite.com/return?orderId=OID123456"
      />
      <input
        type="hidden"
        name="cancelUrl"
        value="http://mywebsite.com/cancel?orderId=OID123456"
      />
      <input type="hidden" name="subMerchantReference" value="" />
      <!-- Optional -->
      <!--<input type="hidden" name="paymentMethod" value="VISA"> -->
      <table>
        <tr>
          <td>Total Amount</td>
          <td>:</td>
          <td><input type="text" name="totalAmount" value="750" /></td>
        </tr>
        <tr>
          <td>Customer Name</td>
          <td>:</td>
          <td>
            <input type="text" name="customerName" value="Ravindu Fernando" />
          </td>
        </tr>
        <tr>
          <td>Customer Mobile</td>
          <td>:</td>
          <td><input type="text" name="customerPhone" value="0701234567" /></td>
        </tr>
        <tr>
          <td>Customer Email</td>
          <td>:</td>
          <td>
            <input type="text" name="customerEmail" value="myemail@mail.com" />
          </td>
        </tr>
      </table>
      <br />
      <input type="submit" value="Checkout Now" />
    </form>

    <!-- <v-col cols="12" md="6" lg="4" sm="12" id="card_container"></v-col>
    <v-btn @click="addata()"> Add Data</v-btn> -->
  </div>
</template>

<script>
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

var studentsRef;
var teachersRef;

export default {
  name: "payment_screen",
  data() {
    return {
      loading: false,
      q_data: null,
    };
  },
  computed: {
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },
  beforeCreate() {
    this.$store.commit("systemUser/findUserData");
    studentsRef = this.$fire.firestore.collection("students");
    teachersRef = this.$fire.firestore.collection("teachers");
  },
  created() {
    // Data getting from query token
    this.init();
  },
  mounted() {
    this.initPaymnet();
  },

  methods: {
    async init() {
      try {
        this.loading = true;
        var token = this.$route.query.dt;
        var data;
        // decode data
        jwt.verify(token, "buy_item", function (error, decoded) {
          if (error == null) data = decoded;
          else
            this.$store.dispatch("alertState/message", [
              "Payment data not found.",
              "error",
            ]);
        });
        this.q_data = data;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async initPaymnet() {
      try {
        const response = await this.$axios.post(
          "https://sandbox.ipay.lk/ipg/checkout",
          {
            cors: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              merchantWebToken:
                "eyJhbGciOiJIUzUxMiJ9.eyJtaWQiOiIwMDAwMDIxNSJ9.ERTtW8gyLPl5dw39cUaO08kIuNZJvTH-hgfGG1Wh4j9vDHjKuaFanJMqW8Mi30o5aHwY86ZappNtpQ7GkEvrvQ",
            },
          }
        );
        // var id = uuid();
        // window.DirectPayCardPayment.init({
        //   container: "card_container", //<div id="card_container"></div>
        //   merchantId: "IA02319", //your merchant_id
        //   amount: this.q_data.price,
        //   refCode: id, //unique referance code form merchant
        //   currency: "LKR",
        //   type: "ONE_TIME_PAYMENT",
        //   customerEmail: this.userData.email,
        //   customerMobile: this.userData.mobile_no,
        //   description: `Buy a ${
        //     this.q_data.buy_item == "video"
        //       ? "video"
        //       : this.q_data.buy_item == "test"
        //       ? "test"
        //       : "live class"
        //   }`, //product or service description
        //   debug: true,
        //   responseCallback: this.responseCallback,
        //   errorCallback: this.errorCallback,
        //   logo: "https://test.com/directpay_logo.png",
        //   apiKey:
        //     "d29a7144033061e3b3c772eee19772e87e580c4536c9f25d43eb6706495cc190",
        // });
      } catch (error) {
        console.log(error);
      }
    },
    //response callback.
    responseCallback(result) {
      console.log("successCallback-Client", result);
      alert(JSON.stringify(result));
    },

    //error callback
    errorCallback(result) {
      console.log("successCallback-Client", result);
      alert(JSON.stringify(result));
    },
    addata() {
      try {
        const user = this.$fire.auth.currentUser;
        if (user != null) {
          this.loading = true;
          // Add data to teacher
          teachersRef
            .where("teacher_id", "==", this.q_data.teacher_id)
            .get()
            .then((querySnapshot) => {
              return querySnapshot.docs[0]?.data().auth_id;
            })
            .then((t_a_id) => {
              if (t_a_id == null) {
                this.$store.dispatch("alertState/message", [
                  "Teacher account not found",
                  "error",
                ]);
                this.loading = false;
              } else {
                // Add data to student
                var id = uuid();
                studentsRef
                  .doc(user.uid)
                  .collection(
                    this.q_data.buy_item == "video"
                      ? "bought_videos"
                      : this.q_data.buy_item == "test"
                      ? "bought_tests"
                      : "bought_tutes"
                  )
                  .doc(id)
                  .set({
                    b_id: id,
                    id: this.q_data.id,
                    type:
                      this.q_data.buy_item == "video"
                        ? "Video"
                        : this.q_data.buy_item == "test"
                        ? "Test"
                        : "Tute",
                    price: this.q_data.price,
                    bought_date: new Date(),
                    transaction_id: "",
                    exp_date: "",
                  })
                  .then(() => {
                    teachersRef
                      .doc(t_a_id)
                      .collection(
                        this.q_data.buy_item == "video"
                          ? "sold_videos"
                          : this.q_data.buy_item == "test"
                          ? "sold_tests"
                          : "sold_tutes"
                      )
                      .doc(id)
                      .set({
                        s_id: id,
                        id: this.q_data.id,
                        type:
                          this.q_data.buy_item == "video"
                            ? "Video"
                            : this.q_data.buy_item == "test"
                            ? "Test"
                            : "Tute",
                        price: this.q_data.price,
                        sold_date: new Date(),
                        transaction_id: "",

                        exp_date: "",
                        student_id: this.userData.student_id,
                        student_name: this.userData.name,
                      })
                      .then(() => {
                        this.$store.dispatch("alertState/message", [
                          "Process completed successfully.",
                          "success",
                        ]);
                        this.loading = false;
                        this.$router.replace("/").then(() => {
                          this.$router.go();
                        });
                      })
                      .catch((error) => {
                        this.loading = false;
                        this.$store.dispatch("alertState/message", [
                          error,
                          "error",
                        ]);
                      });
                  })
                  .catch((error) => {
                    this.loading = false;
                    this.$store.dispatch("alertState/message", [
                      error,
                      "error",
                    ]);
                  });
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$store.dispatch("alertState/message", [error, "error"]);
            });
        } else {
          this.loading = false;
          this.$store.dispatch("alertState/message", [
            "User not found",
            "error",
          ]);
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
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
.img-merchant-logo {
  width: 100px !important;
  height: 100px !important;
}
</style>