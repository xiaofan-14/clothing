<script setup lang="ts">
import { markRaw, reactive } from "vue";
import { All, Dress, TShirt, Jeans } from "../icons";

const categories = reactive([
  { id: 'nav1', name: "All", icon: markRaw(All), active: true },
  { id: 'nav2', name: "Dress", icon: markRaw(Dress), active: false },
  { id: 'nav3', name: "T-Shirt", icon: markRaw(TShirt), active: false },
  { id: 'nav4', name: "Jeans", icon: markRaw(Jeans), active: false },
])

function setActiveCategory(id: string) {
  categories.forEach((c) => (c.active = c.id === id));
}
</script>

<template>
  <div class="px-4 py-4">
    <div class="flex gap-4 overflow-x-auto scrollbar-hide">
      <button v-for="category in categories" :key="category.id" @click="setActiveCategory(category.id)" :class="[
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
        category.active
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-200 border-gray-200 border',
      ]">
        <component :is="category.icon" class="w-4 h-4" :stroke="category.active ? 'white' : '#292526'" />
        <span class="text-sm">{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>

<style>
/* 隐藏滚动条（可选） */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE & Edge */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}
</style>
