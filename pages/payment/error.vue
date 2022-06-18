<template>
  <div class="main-payment">
    <img
      class="img-suc"
      src="~/assets/images/error.png"
      style="max-width: 180px"
      alt="done_image"
    />
    <h2>Your payment was unsuccessfully</h2>
    <p style="margin-top: 10px">
      There was an error processing your payment. Please contact support.
    </p>
    <br />
    <v-btn @click="() => this.$router.replace('/home')" class="error">
      <v-icon>mdi-refresh</v-icon>
      <span style="padding-top: 2px; padding-left: 5px">Try Again</span></v-btn
    >
  </div>
</template>