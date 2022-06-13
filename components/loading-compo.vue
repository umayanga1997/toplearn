<template>
  <div class="page-loading">
    <v-progress-circular
      size="22"
      width="2"
      color="orange"
      indeterminate
    ></v-progress-circular>
    <span class="pl-2" style="font-size: 14px">Loading...</span>
  </div>
</template>

<style lang="scss">
.page-loading {
  // text-align: center;
  background: white;
  padding: 10px 25px;
  border-radius: 20px;
  box-shadow: 2px 2px 8px 0px grey;
}
</style>