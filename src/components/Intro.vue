<template>
  <div class="animated fadeIn">
    <img
      class="animated rubberBand delay-1s"
      style="animation-duration: 1s;"
      v-bind:src="sample"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      sample: require("./../assets/moonwhale.png")
    };
  },
  mounted() {
    setTimeout(() => {
      this.$router.push("/outpost");
    }, 2500);
  }
};
</script>

<style scoped>
img {
  display: block;
  margin: auto;
  margin-top: 20vh;
  width: 50vw;
}
</style>