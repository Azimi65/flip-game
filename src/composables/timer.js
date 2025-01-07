import { ref, computed } from "vue";

export function useTimer(initialSeconds = 60) {
  const sec = ref(initialSeconds);
  const timerStarted = ref(false);
  let timerInterval = null;

  const formattedTimer = computed(() => {
    const minutes = Math.floor(sec.value / 60);
    const seconds = sec.value % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  });


  function startTimer() {
    if (timerStarted.value) return; 
    timerStarted.value = true;
    timerInterval = setInterval(() => {
      if (sec.value > 0) {
        sec.value -= 1;
      } else {
        clearInterval(timerInterval);
        timerStarted.value = false;
        text.value = "You Lose";
      }
    }, 1000);
  }

  function resetTimer(newSeconds = initialSeconds) {
    clearInterval(timerInterval);
    sec.value = newSeconds;
    timerStarted.value = false;
  }

  return {
    sec,
    formattedTimer,
    timerStarted,
    startTimer,
    resetTimer,
  };
}
