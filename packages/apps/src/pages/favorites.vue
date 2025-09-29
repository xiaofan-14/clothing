<script setup lang="ts">
import NavigationBar from "@/components/navigation-bar.vue"
import ProductCard from "@/components/home/product-card.vue"
import { trpc } from "@/lib/trpc"
import { useAuthStore } from "@/stores/auth"
import { useQuery } from "@tanstack/vue-query"
import { computed, type Ref } from "vue"
import type { ProductExt } from "@/type"

const auth = useAuthStore()
const user = auth.user!

const { data, isLoading } = useQuery({
  queryKey: ['favorite', 'list', user.id],
  queryFn: async () => await trpc.favorite.list.query({ userId: user.id, limit: 20 }),
})

const favorites = computed(() => data.value?.items ?? []) as unknown as Ref<ProductExt[]>
</script>

<template>
  <header class="sticky top-0 px-4 py-4 flex items-center justify-between">
    <button class="w-8 h-8 flex items-center justify-center">
    </button>
    <h1 class="text-lg font-semibold text-gray-900">收藏夹</h1>
    <button class="w-8 h-8 flex items-center justify-center">
    </button>
  </header>
  <div class="px-4 py-4">
    <div v-if="isLoading">加载中...</div>
    <div v-else class="grid grid-cols-2 gap-4">
      <ProductCard v-if="favorites.length > 0" :products="favorites" />
      <div v-else class="text-gray-500 text-center col-span-2">
        暂无收藏
      </div>
    </div>
  </div>
  <navigation-bar />
</template>
