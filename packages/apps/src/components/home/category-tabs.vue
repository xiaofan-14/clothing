<script setup lang="ts">
import { computed, markRaw, ref, type Component } from "vue";
import { All, Dress, TShirt, Jeans } from "../icons";
import { useQuery } from "@tanstack/vue-query"
import { useFetch } from "@/hooks/useFetch"
import type { Category } from "@clothing/servers/type";

const active = ref('all')

function setActiveCategory(id: string) {
  active.value = id
}

const categoryIconMap: Record<string, Component> = {
  Dress,
  'T-Shirt': TShirt,
  Jeans,
};

const { data: remoteList } = useQuery({
  queryKey: ['category'],
  queryFn: () => useFetch<Category[]>('/category.getlist'),
});

const categories = computed(() =>
  (remoteList.value || []).map(item => ({
    ...item,
    icon: markRaw(categoryIconMap[item.name] ?? All),
  }))
);
</script>

<template>
  <div class="px-4 py-4">
    <div class="flex gap-4 overflow-x-auto scrollbar-hide">
      <button @click="setActiveCategory('all')" :class="[
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
        active === 'all'
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-200 border-gray-200 border',
      ]">
        <component :is="All" class="w-4 h-4" :stroke="active === 'all' ? 'white' : '#292526'" />
        <span class="text-sm">全部</span>
      </button>
      <button v-for="item in categories" :key="item.id" @click="setActiveCategory(item.id)" :class="[
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
        active === item.id
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-200 border-gray-200 border',
      ]">
        <component :is="item.icon" class="w-4 h-4" :stroke="active === item.id ? 'white' : '#292526'" />
        <span class="text-sm">{{ item.name }}</span>
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
