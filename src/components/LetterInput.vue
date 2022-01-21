<script setup lang="ts">
import { KnownLetter, LetterState } from "../types/letters";
import { toRefs } from "vue";
import { focusNext } from "../utils/focus";
import { getKnownMatchState } from "../utils/guess";

const emit = defineEmits<{
  (e: "update:letter-state", state: LetterState): void;
}>();

const props =
  defineProps<{
    letterState: LetterState;
    knownLetters: KnownLetter[];
    index: number;
  }>();
const { knownLetters, index } = toRefs(props);

const onLetterChanged = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).value;

  if (newValue) {
    focusNext();
  }

  const matchState = getKnownMatchState(
    newValue,
    knownLetters.value,
    index.value
  );
  emit("update:letter-state", { letter: newValue.toLowerCase(), state: matchState });
};
</script>

<template>
  <input
    :class="[
      {
        invalid: letterState.state === 'invalid',
        partial: letterState.state === 'partial',
        match: letterState.state === 'match',
      },
      'tile',
    ]"
    :value="letterState.letter"
    type="text"
    maxlength="1"
    @input="onLetterChanged"
  />
</template>

<style scoped></style>
