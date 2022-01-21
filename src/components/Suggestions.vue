<script setup lang="ts">
defineProps<{ suggestions: string[] }>();
</script>

<template>
  <div>
    <h2 class="mb-2">Suggestions:</h2>
    <ol class="flex flex-wrap -m-1">
      <li
        v-for="(word, index) in suggestions"
        :key="index"
        class="bg-gray-700 px-2 py-1 rounded-md m-1"
      >
        {{ word }}
      </li>
    </ol>
  </div>
</template>

<style scoped></style>
