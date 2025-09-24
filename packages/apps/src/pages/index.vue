<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import HeaderBar from "@/components/home/header-bar.vue"
import SearchBar from "@/components/home/search-bar.vue"
import CategoryTabs from "@/components/home/category-tabs.vue"
import ProductCard from "@/components/home/product-card.vue"
import navigationBar from "@/components/navigation-bar.vue"
import type { Product } from '@clothing/servers/type'
import { computed, ref } from "vue";
import { trpc } from "@/lib/trpc";

const active = ref('all')

const { data } = useQuery<Product[]>({
  queryKey: computed(() => ['product', 'byCategory', active.value]),
  queryFn: async () => {
    const products = active.value === 'all'
      ? await trpc.product.getlist.query()
      : await trpc.product.getByCategory.query({ categoryId: active.value });
    return products.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt)
    }));
  },
  enabled: computed(() => !!active.value),
})
</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs v-model:active="active" />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="data" :products="data" />
    </div>
  </div>
  <navigation-bar />
</template>
