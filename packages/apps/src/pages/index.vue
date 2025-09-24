<script setup lang="ts">
import { useFetch } from "@/hooks/useFetch";
import { useQuery } from "@tanstack/vue-query";
import HeaderBar from "@/components/home/header-bar.vue"
import SearchBar from "@/components/home/search-bar.vue"
import CategoryTabs from "@/components/home/category-tabs.vue"
import ProductCard from "@/components/home/product-card.vue"
import navigationBar from "@/components/navigation-bar.vue"
import type { Product } from '@clothing/servers/type'

export interface ProductClient extends Product {
  category: {
    id: string,
    name: string
  }
}

const { data: list } = useQuery({
  queryKey: ['product', 'list'],
  queryFn: () => useFetch<ProductClient[]>('/product.getlist'),
});

</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="list" :products="list" />
    </div>
  </div>
  <navigation-bar />
</template>
