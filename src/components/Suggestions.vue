<template>
  <div>
    <h2 class="mb-2">Suggested:</h2>
    <ol class="flex flex-wrap -m-0.5">
      <li v-for="(word, index) in suggestions" :key="index">
        <button class="subtle-button m-0.5" @click="onSelected(word)">
          {{ word }}
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "selected", word: string): void;
}>();

defineProps<{ suggestions: string[] }>();

const onSelected = (word: string) => {
  emit("selected", word);
};
</script>
