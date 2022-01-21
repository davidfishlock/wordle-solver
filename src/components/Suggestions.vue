<script setup lang="ts">
const props = defineProps<{ suggestions: string[] }>();
</script>

<template>
  <div>
    <h2 class="mb-2">Suggestions:</h2>
    <ol>
      <li class="list-decimal list-inside" v-for="(word, index) in suggestions" :key="index">{{ word }}</li>
    </ol>
  </div>
</template>

<style scoped></style>
