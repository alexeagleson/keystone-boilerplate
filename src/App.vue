<template>
  <div id="app">
    <h5 style="text-align: center;" id="nav">
      <router-link v-bind:class="{ bold: routeName('login') }" v-if="!loggedIn()" to="/">Login</router-link>
      <router-link v-bind:class="{ bold: routeName('register') }" v-if="!loggedIn()" to="/register"> | Register</router-link>
      <router-link v-bind:class="{ bold: routeName('outpost') }" v-if="loggedIn()" to="/outpost">Outpost</router-link>
      <router-link v-bind:class="{ bold: routeName('admin') }" v-if="loggedIn()" to="/admin"> | Admin</router-link>
      <router-link v-if="loggedIn()" to="/logout"> | Logout</router-link>
    </h5>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    loggedIn() {
      return !!localStorage.getItem("userJwt");
    },
    routeName(name) {
      return this.$route.name === name;
    }
  },
};
</script>

<style scoped>
#nav {
  padding-top: 50px;
}

.bold {
  font-weight: bold;
}
</style>