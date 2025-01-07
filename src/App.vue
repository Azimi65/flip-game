<template>
  <div class="">
    <div v-show="gameOver" class="flex justify-center items-center rounded py-3 px-2" :class="gameOverClass" style=" transition:transform 0.6s ease-in-out;">
      <div  class="font-bold text-lg">{{ text }}</div>
    </div>
    
    <div class="flex gap-3 items-center justify-between">
      <div class="mt-3 mb-3 flex gap-2 font-bold text-lg">{{formattedTimer}}<span class="font-bold text-lg">:زمان</span></div>
      <div  class="mt-3 mb-3"><span class="font-bold text-lg ml-1">تعداد حرکت:</span><span class="font-bold text-lg">{{allMoves}}</span></div>
    </div>
    <audio ref="matchAudio" src="src/assets/audio/match.wav"></audio>
    <div class="grid grid-cols-4 gap-5">
      <div
        class="card-container cursor-pointer relative w-[100px] h-[100px]"
        v-for="(product, index) in shuffledProducts"
        :key="index"
        @click="matchFunc(product, index)"
        :class="{ flipped: product.status }"
        
      >
        <Box :product="product"/>
      </div>
    </div>
    <button 
        @click="resetGame" 
        class="mt-3 mb-5 px-4 py-2 bg-gray-400  rounded hover:bg-gray-300 hover:border border-gray-400 font-bold text-lg"
      >
        شروع دوباره
      </button>
  </div>
  
</template>

<script setup>
import { onMounted, ref, watch,computed } from "vue";
import Box from './components/Box.vue'
import { useTimer } from "./composables/timer";
// define array
const products = ref([
  { name: "product-1", status: true },
  { name: "product-2", status: true },
  { name: "product-3", status: true },
  { name: "product-4", status: true },
  { name: "product-5", status: true },
  { name: "product-6", status: true },
  { name: "product-7", status: true },
  { name: "product-8", status: true },
  { name: "product-1", status: true },
  { name: "product-2", status: true },
  { name: "product-3", status: true },
  { name: "product-4", status: true },
  { name: "product-5", status: true },
  { name: "product-6", status: true },
  { name: "product-7", status: true },
  { name: "product-8", status: true },
]);

const shuffledProducts = ref([]);
const matchCouple = ref([]);
const allMoves = ref(40);
const lock = ref(false); 
const win = ref(0);
const matchAudio = ref(null); 
const text=ref("")
const { sec, formattedTimer, startTimer, resetTimer, timerStarted } = useTimer(60);
const gameOver = ref(false);
// shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
const gameOverClass = computed(() => {
  if (text.value.includes('برنده')) {
    return 'bg-green-200';
  } else if (text.value.includes('متاسفانه')) {
    return 'bg-red-400';
  }
  return '';
});
watch(sec, (newValue) => {
  if (newValue === 0 && !gameOver.value) {
    text.value = "متاسفانه زمان شما به پایان رسید. دوباره تلاش کنید";
    gameOver.value = true;
  }
});

watch(allMoves, (newValue) => {
  if (newValue === 0 && !gameOver.value) {
    text.value = "متاسفانه تعداد حرکات مجاز شما به پایان رسید دوباره تلاش کنید";
    gameOver.value = true;
    resetTimer(sec.value)
  }
});

watch(win, (newValue) => {
  if (newValue === Math.floor(shuffledProducts.value.length / 2) && !gameOver.value) {
    text.value = "تبریک! شما برنده شدید";
    gameOver.value = true;

    setTimeout(() => {
      win.value = 0; 
      resetTimer(sec.value);
    }, 1000); 
  }
});
// Reset game
function resetGame() {
  shuffledProducts.value = shuffleArray(
    products.value.map((product) => ({ ...product, status: true }))
  );
  resetTimer(60);
  matchCouple.value = [];
  allMoves.value = 40;
  lock.value = false;
  text.value = '';
  gameOver.value = false; // Reset game over flag
  win.value=0
  setTimeout(() => {
    shuffledProducts.value.forEach((element) => {
      element.status = false;
    });
  }, 5000);
}


onMounted(resetGame);

//on box clicks
function matchFunc(product, index) {
  if (lock.value || shuffledProducts.value[index].status) return; 

  if (allMoves.value === 0 || sec.value === 0) {
    return;
  }
  
  if(!timerStarted.value){
    startTimer()
    timerStarted.value=true
  }
  
  allMoves.value -= 1;
  shuffledProducts.value[index].status = true;
  matchCouple.value.push({ ...product, index });
  console.log(matchCouple.value)
  
  if (matchCouple.value.length === 2) {
    lock.value = true; 

    const [first, second] = matchCouple.value;

    if (first.name === second.name) {
      // Match found
      matchCouple.value = [];
      lock.value = false; 
      win.value += 1;
      
      
      matchAudio.value.play(); 
    } else {
      // No match
      
      setTimeout(() => {
        shuffledProducts.value[first.index].status = false;
        shuffledProducts.value[second.index].status = false;
        matchCouple.value = [];
        lock.value = false; 
      }, 1000);
    }
  }
}
</script>

