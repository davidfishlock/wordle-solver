<script setup lang="ts">
import { LetterState } from "../types/types";
import { toRefs } from "vue";
import { focusNext } from "../utils/focus";

const emit = defineEmits<{
  (e: "update:letter-state", state: LetterState): void;
}>();

const props = defineProps<{
  letterState: LetterState;
}>();
const { letterState } = toRefs(props);

const onLetterChanged = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).value;
  if (newValue) focusNext();

  emit("update:letter-state", {
    ...letterState.value,
    letter: newValue.toLowerCase(),
  });
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
