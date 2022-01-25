<script setup lang="ts">
import { computed, toRefs } from "vue";
import { Guess } from "../types/types";
import LetterInput from "./LetterInput.vue";
import LetterStateButtons from "./LetterStateButtons.vue";

const emit = defineEmits<{
  (e: "update:guess", guess: Guess): void;
  (e: "submit", guess: Guess): void;
}>();

const props = defineProps<{
  guess: Guess;
}>();
const { guess } = toRefs(props);

const canSubmit = computed(() => guess.value.every((entry) => entry.letter));

const onSubmit = () => {
  emit("submit", guess.value);
};
</script>

<template>
  <div class="mb-8">
    <div class="tile-row mb-2">
      <LetterInput v-model:letter-state="guess[0]" />
      <LetterInput v-model:letter-state="guess[1]" />
      <LetterInput v-model:letter-state="guess[2]" />
      <LetterInput v-model:letter-state="guess[3]" />
      <LetterInput v-model:letter-state="guess[4]" />
    </div>

    <div class="tile-row mb-4">
      <LetterStateButtons v-model:letter-state="guess[0]" />
      <LetterStateButtons v-model:letter-state="guess[1]" />
      <LetterStateButtons v-model:letter-state="guess[2]" />
      <LetterStateButtons v-model:letter-state="guess[3]" />
      <LetterStateButtons v-model:letter-state="guess[4]" />
    </div>

    <button class="default-button" :disabled="!canSubmit" @click="onSubmit">
      Submit
    </button>
  </div>
</template>

<style scoped></style>
