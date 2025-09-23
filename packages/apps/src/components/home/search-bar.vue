<script setup lang="ts">
import { Search, SlidersHorizontal } from "lucide-vue-next"
</script>

<template>
  <div class="px-4 py-4 bg-white">
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <input
          type="text"
          placeholder="Search clothes..."
          class="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <button class="bg-gray-900 rounded-lg px-4 py-3">
        <SlidersHorizontal class="text-white w-4 h-4" />
      </button>
    </div>
  </div>
</template>
