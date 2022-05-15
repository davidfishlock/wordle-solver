<template>
  <div>
    <div class="tile-row mb-2">
      <div
        v-for="(letterState, index) in modelValue"
        :key="index"
        :class="[
          {
            invalid: letterState.state === MatchState.Invalid,
            partial: letterState.state === MatchState.Partial,
            match: letterState.state === MatchState.Match,
          },
          'tile',
        ]"
      >
        {{ letterState.letter }}
      </div>
    </div>

    <div class="tile-row mb-4">
      <LetterStateButtons
        :letter-index="0"
        :state="modelValue[0].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="1"
        :state="modelValue[1].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="2"
        :state="modelValue[2].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="3"
        :state="modelValue[3].state"
        @update:letter-state="onStateUpdated"
      />
      <LetterStateButtons
        :letter-index="4"
        :state="modelValue[4].state"
        @update:letter-state="onStateUpdated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Guess, MatchState } from "../types/guess";
import LetterStateButtons from "./LetterStateButtons.vue";
import { replaceAt } from "../utils/array";

const emit = defineEmits<{
  (e: "update:modelValue", guess: Guess): void;
}>();

const props = defineProps<{
  modelValue: Guess;
}>();

function onStateUpdated(letterIndex: number, state: MatchState) {
  const updatedGuess = replaceAt(props.modelValue, letterIndex, {
    letter: props.modelValue[letterIndex].letter,
    state,
  });
  emit("update:modelValue", updatedGuess);
}
</script>
