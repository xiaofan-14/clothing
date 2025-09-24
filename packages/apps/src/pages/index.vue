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

// const fn = user
//   ? async () => await trpc.product.getlistOnLogin.query({ userId: user.id })
//   : async () => await trpc.product.getlist.query()

// const fn2 = user
//   ? async () => await trpc.product.getByCategoryOnLogin.query({ categoryId: active.value, userId: user.id })
//   : async () => await trpc.product.getByCategory.query({ categoryId: active.value })

// const { data: products } = useQuery<Product[]>({
//   queryKey: ['product', 'byCategory', active],
//   queryFn: async () => {
//     const products = active.value === 'all'
//       ? await fn()
//       : await fn2()
//     return products.map(p => ({
//       ...p,
//       createdAt: new Date(p.createdAt)
//     }));
//   },
//   enabled: computed(() => !!active.value),
// })

const { data: products } = useQuery<Product[]>({
  queryKey: ['product', 'byCategory', active.value, user],
  queryFn: async ({ queryKey }) => {
    const [_prefix, _type, categoryId, userId] = queryKey as [string, string, string, string]

    let products
    if (categoryId === 'all') {
      products = user
        ? await trpc.product.getlistOnLogin.query({ userId: user.id })
        : await trpc.product.getlist.query()
    } else {
      products = user
        ? await trpc.product.getByCategoryOnLogin.query({ categoryId: active.value, userId: user.id })
        : await trpc.product.getByCategory.query({ categoryId : active.value})
    }

    return products.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))
  },
  enabled: () => !!active.value,
})

</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs v-model:active="active" />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="products" :products="products" />
    </div>
  </div>
  <navigation-bar />
</template>
