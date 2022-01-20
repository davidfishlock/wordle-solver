<script setup lang="ts">
import { LetterState, MatchState } from "../types/letters";
import { toRefs } from "vue";

const emit = defineEmits<{
  (e: "update:letter-state", state: LetterState): void;
}>();

const props = defineProps<{ letterState: LetterState }>();

const { letterState } = toRefs(props);

const onLetterChanged = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:letter-state", { ...letterState.value, letter: target.value });
};

const onMatchStateChanged = (state: MatchState) => {
  emit("update:letter-state", { ...letterState.value, state });
};
</script>

<template>
  <div>
    <input
      :class="{
        invalid: letterState.state === 'invalid',
        partial: letterState.state === 'partial',
        match: letterState.state === 'match',
      }"
      :value="letterState.letter"
      type="text"
      maxlength="1"
      @input="onLetterChanged"
    />
    <div>
      <button class="invalid" @click="onMatchStateChanged('invalid')"></button>
      <button class="partial" @click="onMatchStateChanged('partial')"></button>
      <button class="match" @click="onMatchStateChanged('match')"></button>
    </div>
  </div>
</template>

<style scoped>
button {
  height: 16px;
  width: 12px;
  margin-right: 2px;
  margin-bottom: 2px;
}
input {
  color: white;
  width: 44px;
}
</style>
