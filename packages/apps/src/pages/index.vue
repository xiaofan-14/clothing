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
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore()

const user = auth.user!

const active = ref('all')

interface ListType extends Product {
  category: {
    id: string,
    name: string
  }
  isFavorite: boolean
}

const { data } = useQuery<Product[]>({
  queryKey: ['product', 'byCategory'],
  queryFn: async () => {

    let products
    if (user.name) {
      products = await trpc.product.getlist.query({})
    } else {
      products = await trpc.product.getlist.query({ userId: user.id })
    }

    return products.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))
  },
})

const products = computed(() => {
  const temp = data.value as ListType[]
  if (!temp) return []

  if (active.value === 'all') {
    return temp
  } else {
    return temp.filter(e => e.category.name === active.value)
  }
})
</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs v-model:active="active" />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="products.length > 0" :products="products" />
    </div>
  </div>
  <navigation-bar />
</template>
