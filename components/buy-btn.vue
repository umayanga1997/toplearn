<template>
  <form method="POST" ref="" action="https://sandbox.ipay.lk/ipg/checkout">
    <input
      type="hidden"
      name="merchantWebToken"
      value="eyJhbGciOiJIUzUxMiJ9.eyJtaWQiOiIwMDAwMDIxNSJ9.ERTtW8gyLPl5dw39cUaO08kIuNZJvTH-hgfGG1Wh4j9vDHjKuaFanJMqW8Mi30o5aHwY86ZappNtpQ7GkEvrvQ"
    />
    <!-- Replace your web token -->
    <input type="hidden" name="orderId" :value="orderId" />
    <input
      type="hidden"
      name="orderDescription"
      :value="
        this.item_type == 'video'
          ? 'Bought a video lesson'
          : this.item_type == 'test'
          ? 'Bought a test'
          : 'Bought a tute'
      "
    />
    <!-- Optional -->
    <input
      type="hidden"
      name="returnUrl"
      :value="
        'https://top-learn-81d57.web.app/payment/success?orderId=' + orderId
      "
    />
    <input
      type="hidden"
      name="cancelUrl"
      :value="
        'https://top-learn-81d57.web.app/payment/error?orderId=' + orderId
      "
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
        <td>Custom Token Parameter</td>
        <td>:</td>
        <td>
          <input type="text" name="merchantParam1" :value="token" />
        </td>
      </tr>
      <tr>
        <!-- student_id -->
        <!-- student_name -->
        <!-- teacher_id -->
        <td>Custom Token Parameter 2</td>
        <td>:</td>
        <td>
          <input type="text" name="merchantParam2" :value="token2" />
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
      token2: null,
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
          type: this.item_type,
        }),
        "buy_item"
      );
      this.token2 = jwt.sign(
        JSON.stringify({
          student_id: this.userData.student_id,
          student_name: this.userData.name,
          teacher_id: this.item.teacher_id,
        }),
        "s_t_data"
      );
    },
  },
};
</script>