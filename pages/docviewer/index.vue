<template>
  <div style="height: 92vh">
    <iframe
      :src="link + '#toolbar=0'"
      frameBorder="0"
      height="100%"
      width="100%"
    />
  </div>
</template>

<script>
export default {
  name: "docviever",
  data() {
    return {
      link: null,
    };
  },
  created() {
    this.link = this.$route.query.link;
  },
  mounted() {
      document.oncontextmenu = function() {return false;};
    // document.onmousedown = disableRightclick;
    // var message = "Right click not allowed !!";
    // function disableRightclick(evt) {
    //   if (evt.button == 2) {
    //     alert(message);
    //     return false;
    //   }
    // }
  },
};
</script>

<style lang="scss">
@media print  
{  
iframe {display:none;}  
}  
</style>