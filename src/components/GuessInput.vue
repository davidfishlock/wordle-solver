<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { KnownLetter, LetterState } from "../types/letters";
import LetterInput from "./LetterInput.vue";
import LetterStateButtons from "./LetterStateButtons.vue";
import { focusNext } from "../utils/focus";

defineProps<{ knownLetters: KnownLetter[] }>();

const defaultLetterState: LetterState = { letter: "", state: "invalid" };

const emit = defineEmits<{
  (e: "guess-submit", letterStates: LetterState[]): void;
}>();

const letter1State = ref(defaultLetterState);
const letter2State = ref(defaultLetterState);
const letter3State = ref(defaultLetterState);
const letter4State = ref(defaultLetterState);
const letter5State = ref(defaultLetterState);

const canSubmit = computed(
  () =>
    letter1State.value.letter &&
    letter2State.value.letter &&
    letter3State.value.letter &&
    letter4State.value.letter &&
    letter5State.value.letter
);

const onSubmit = () => {
  emit("guess-submit", [
    letter1State.value,
    letter2State.value,
    letter3State.value,
    letter4State.value,
    letter5State.value,
  ]);
  letter1State.value =
    letter2State.value =
    letter3State.value =
    letter4State.value =
    letter5State.value =
      defaultLetterState;
};

watch(
  () => {
    return [
      letter1State.value.letter,
      letter2State.value.letter,
      letter3State.value.letter,
      letter4State.value.letter,
    ];
  },
  (newValue, oldValue) => {
    const oldFilledValues = oldValue.filter(letter => letter);
    const newFilledValues = newValue.filter(letter => letter);
    if (newFilledValues.length >= oldFilledValues.length) focusNext();
  },
  {}
);
</script>

<template>
  <div class="mb-8">
    <div class="tile-row mb-2">
      <LetterInput
        v-model:letter-state="letter1State"
        :known-letters="knownLetters"
        :index="0"
      />
      <LetterInput
        v-model:letter-state="letter2State"
        :known-letters="knownLetters"
        :index="1"
      />
      <LetterInput
        v-model:letter-state="letter3State"
        :known-letters="knownLetters"
        :index="2"
      />
      <LetterInput
        v-model:letter-state="letter4State"
        :known-letters="knownLetters"
        :index="3"
      />
      <LetterInput
        v-model:letter-state="letter5State"
        :known-letters="knownLetters"
        :index="4"
      />
    </div>

    <div class="tile-row mb-4">
      <LetterStateButtons v-model:letter-state="letter1State" />
      <LetterStateButtons v-model:letter-state="letter2State" />
      <LetterStateButtons v-model:letter-state="letter3State" />
      <LetterStateButtons v-model:letter-state="letter4State" />
      <LetterStateButtons v-model:letter-state="letter5State" />
    </div>

    <button class="default-button" :disabled="!canSubmit" @click="onSubmit">
      Submit
    </button>
  </div>
</template>

<style scoped></style>
