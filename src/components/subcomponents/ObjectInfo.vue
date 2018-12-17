<template>
  <div class="animated fadeIn animation-parameters objectInfoTooltip">
    <p class="strokeme">{{ name }}</p>
    <p class="strokeme" v-if="condition >= 0">Condition: {{condition}}/100</p>
    <p class="strokeme">some other thing</p>
  </div>
</template>

<script>
export default {
  props: ['name', 'condition'],
  name: 'ObjectInfo',
  data() {
    return {};
  },
};
</script>

<style scoped>
.animation-parameters {
  animation-duration: 0.75s;
}
</style>