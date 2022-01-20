<script setup lang="ts">
import { computed, ref } from "vue";
import { LetterState } from "../types/letters";
import LetterInput from "./LetterInput.vue";

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
</script>

<template>
  <div class="root">
    <div class="inputs">
      <LetterInput v-model:letter-state="letter1State" />
      <LetterInput v-model:letter-state="letter2State" />
      <LetterInput v-model:letter-state="letter3State" />
      <LetterInput v-model:letter-state="letter4State" />
      <LetterInput v-model:letter-state="letter5State" />
    </div>
    <button :disabled="!canSubmit" @click="onSubmit">Submit</button>
  </div>
</template>

<style scoped>
.root {
  margin-bottom: 4px;
}

.inputs {
  display: flex;
  margin-bottom: 4px;
}
</style>
