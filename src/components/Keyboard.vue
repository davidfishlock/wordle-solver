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
  lastFilledIndex: number;
}>();

const canSubmit = computed(() => props.lastFilledIndex === WORD_LENGTH - 1);
const canDelete = computed(() => props.lastFilledIndex >= 0);
const canAdd = computed(() => props.lastFilledIndex < WORD_LENGTH - 1);

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
    <div class="keyboard-row mx-4">
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
        class="subtle-button key"
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
        class="subtle-button key"
        :disabled="!canDelete"
        @click="onDeletePress"
      >
        del
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard-row {
  @apply flex flex-row mt-2 space-x-2;
}

.key {
  @apply py-3 flex-grow flex-shrink;
}
</style>
