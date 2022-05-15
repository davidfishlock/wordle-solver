<template>
  <div>
    <div class="keyboard-row">
      <button
        v-for="letter in row1Letters"
        :key="letter"
        class="subtle-button key"
        :disabled="!canAdd"
        @click="onLetterPress(letter)"
      >
        {{ letter }}
      </button>
    </div>
    <div class="keyboard-row mx-5">
      <button
        v-for="letter in row2Letters"
        :key="letter"
        class="subtle-button key"
        :disabled="!canAdd"
        @click="onLetterPress(letter)"
      >
        {{ letter }}
      </button>
    </div>
    <div class="keyboard-row">
      <button
        class="positive-button key min-w-fit sm:min-w-[4rem]"
        :disabled="!canSubmit"
        @click="onSubmitPress"
      >
        enter
      </button>
      <button
        v-for="letter in row3Letters"
        :key="letter"
        class="subtle-button key"
        :disabled="!canAdd"
        @click="onLetterPress(letter)"
      >
        {{ letter }}
      </button>
      <button
        class="negative-button key min-w-fit sm:min-w-[4rem]"
        :disabled="!canDelete"
        @click="onDeletePress"
      >
        del
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { WORD_LENGTH } from "../constants";
import useGlobalKeyDown from "../hooks/useGlobalKeyDown";

useGlobalKeyDown(onKeyDown);

const row1Letters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const row2Letters = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const row3Letters = ["z", "x", "c", "v", "b", "n", "m"];

const emit = defineEmits<{
  (e: "add-letter", letter: string): void;
  (e: "remove-letter"): void;
  (e: "submit"): void;
}>();

const props = defineProps<{
  currentWordInput: string;
}>();

const canSubmit = computed(() => props.currentWordInput.length === WORD_LENGTH);
const canDelete = computed(() => props.currentWordInput.length > 0);
const canAdd = computed(() => props.currentWordInput.length < WORD_LENGTH);

const onLetterPress = (letter: string) => {
  emit("add-letter", letter);
};

const onDeletePress = () => {
  emit("remove-letter");
};

const onSubmitPress = () => {
  emit("submit");
};

function onKeyDown(event: KeyboardEvent) {
  if (canSubmit.value && event.key === "Enter") {
    onSubmitPress();
    return;
  }

  if (canDelete.value && event.key === "Backspace") {
    onDeletePress();
    return;
  }

  if (canAdd.value && event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
    onLetterPress(event.key);
    return;
  }
}
</script>

<style scoped>
.keyboard-row {
  @apply flex flex-row mt-1 justify-evenly space-x-1;
}

.key {
  @apply py-3 flex-grow flex-shrink flex-1;
}
</style>
