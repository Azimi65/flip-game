<template>
  <!-- Front Side (Hidden Background) -->
        <div class="card-front flex justify-center items-center z-2 w-[100%] h-[100%] absolute bg-rose-500 rounded">
          <span class="text-white font-bold">?</span>
        </div>
        <!-- Back Side (Image) -->
        <div class="card-back flex justify-center z-1 items-center w-[100%] h-[100%] absolute">
          <img
            :src="`src/assets/images/${product.name}.jpg`"
            alt=""
            class="w-full h-full rounded"
          />
        </div>
</template>

<script setup>
const prop=defineProps(['product'])
</script>

<style>

</style>