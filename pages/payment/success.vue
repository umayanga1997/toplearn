<template>
  <div class="main-payment">
    <img
      class="img-suc"
      src="~/assets/images/done.jpg"
      style="max-width: 180px"
      alt="done_image"
    />
    <h2>Your payment was successfully</h2>
    <p style="margin-top: 10px">Thank you for your payment!</p>
    <br />
    <v-btn @click="() => this.$router.replace('/home')" class="success">
      <v-icon>mdi-home</v-icon>
      <span style="padding-top: 2px; padding-left: 5px">Home</span></v-btn
    >
  </div>
</template>
