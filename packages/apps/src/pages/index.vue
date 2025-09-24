<script setup lang="ts">
import { useFetch } from "@/hooks/useFetch";
import { useQuery } from "@tanstack/vue-query";
import HeaderBar from "@/components/home/header-bar.vue"
import SearchBar from "@/components/home/search-bar.vue"
import CategoryTabs from "@/components/home/category-tabs.vue"
import ProductCard from "@/components/home/product-card.vue"
import navigationBar from "@/components/navigation-bar.vue"
import type { Product } from '@clothing/servers/type'
import { computed, ref } from "vue";

export interface ProductClient extends Product {
  category: {
    id: string,
    name: string
  }
}

const active = ref('all')

const { data: list } = useQuery({
  queryKey: ['product', 'byCategory', active],
  queryFn: () =>
    active.value === 'all'
      ? useFetch<ProductClient[]>('/product.getlist')
      : useFetch<ProductClient[]>(`/product.getByCategory?input=${encodeURIComponent(JSON.stringify({ categoryId: active.value }))}`),
  enabled: computed(() => !!active.value),
})

</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs v-model:active="active" />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="list" :products="list" />
    </div>
  </div>
  <navigation-bar />
</template>
