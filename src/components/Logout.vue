<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    localStorage.removeItem("user");
    localStorage.removeItem("userAdmin");
    localStorage.removeItem("userJwt");
    this.$router.push("/");
  }
};
</script>