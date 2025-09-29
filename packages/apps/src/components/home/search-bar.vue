<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import { Search, SlidersHorizontal } from "lucide-vue-next"
import { ref } from "vue";

const keyword = defineModel<string>('keyword')

const { toast } = useToast()
const val = ref()

function handleSearch() {
  keyword.value = val.value
}

function handleClick() {
  toast('开发中...', 'info')
}
</script>

<template>
  <div class="px-4 py-4 bg-white">
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <input v-model="val" type="text" placeholder="Search clothes..."
          class="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
        <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" @click="handleSearch" />
      </div>
      <button class="bg-gray-900 rounded-lg px-4 py-3" @click="handleClick">
        <SlidersHorizontal class="text-white w-4 h-4" />
      </button>
    </div>
  </div>
</template>
