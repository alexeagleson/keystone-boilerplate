<template>
  <div class="animated fadeIn objectInfoTooltip">
    <h3 class="strokeme">Debug: {{ debugText }}</h3>
  </div>
</template>

<script>
export default {
  props: ['debugText'],
  name: 'Debug',
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>