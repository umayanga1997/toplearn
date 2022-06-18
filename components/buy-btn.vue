<template>
  <form method="POST" ref="" action="https://sandbox.ipay.lk/ipg/checkout">
    <input
      type="hidden"
      name="merchantWebToken"
      value="eyJhbGciOiJIUzUxMiJ9.eyJtaWQiOiIwMDAwMDIxNSJ9.ERTtW8gyLPl5dw39cUaO08kIuNZJvTH-hgfGG1Wh4j9vDHjKuaFanJMqW8Mi30o5aHwY86ZappNtpQ7GkEvrvQ"
    />
    <!-- Replace your web token -->
    <input type="hidden" name="orderId" :value="orderId" />
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
    <table style="display: none">
      <!-- <tr v-for="(value, key) in item" :key="key">
        <td>{{ key }}</td>
        <td>:</td>
        <td><input type="text" name="totalAmount" :value="value" /></td>
      </tr> -->
      <tr>
        <td>Total Amount</td>
        <td>:</td>
        <td><input type="text" name="totalAmount" :value="item.price" /></td>
      </tr>
      <tr>
        <td>Customer Name</td>
        <td>:</td>
        <td>
          <input type="text" name="customerName" :value="userData.name" />
        </td>
      </tr>
      <tr>
        <td>Customer Mobile</td>
        <td>:</td>
        <td>
          <input type="text" name="customerPhone" :value="userData.mobile_no" />
        </td>
      </tr>
      <tr>
        <td>Customer Email</td>
        <td>:</td>
        <td>
          <input type="text" name="customerEmail" :value="userData.email" />
        </td>
      </tr>
      <tr>
        <!-- id = item ID -->
        <!-- type -->
        <!-- student_id -->
        <td>Custom Token Parameter</td>
        <td>:</td>
        <td>
          <input type="text" name="merchantParam1" :value="token" />
        </td>
      </tr>
    </table>
    <v-btn type="submit" color="green darken-2" dark> Buy </v-btn>
  </form>
</template>

<script>
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export default {
  name: "buy_compo",
  props: ["item", "item_type"],
  data() {
    return {
      orderId: null,
      token: null,
    };
  },
  created() {
    this.orderId = uuid();
    this.generateDetailsToken();
  },
  computed: {
    userData() {
      return this.$store.getters["systemUser/userData"];
    },
  },
  methods: {
    generateDetailsToken() {
      this.token = jwt.sign(
        JSON.stringify({
          id: this.item.id,
          type:
            this.item_type == "video"
              ? "Video"
              : this.item_type == "test"
              ? "Test"
              : "Tute",
          student_id: this.userData.student_id,
        }),
        "buy_item"
      );
    },
  },
};
</script>