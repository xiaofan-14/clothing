<script setup lang="ts">
import { Heart, Star } from "lucide-vue-next"
import { useRouter } from "vue-router";
import { url } from "@/utils/url";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/stores/auth";
import type { ProductExt } from "@/type";

const { products: list } = defineProps<{ products: ProductExt[] }>()

const router = useRouter();
const auth = useAuthStore()

const user = auth.user!

const queryClient = useQueryClient()

const toggleFavorite = useMutation({
  mutationFn: async (id: string) => await trpc.favorite.toggle.mutate({
    userId: user.id,
    productId: id
  }),
  onMutate: async (id: string) => {
    // 取消正在进行的请求，避免覆盖
    await queryClient.cancelQueries({ queryKey: ['product', 'byCategory'] })

    // 本地更新缓存
    const previous = queryClient.getQueryData<ProductExt[]>(['product', 'byCategory'])

    if (previous) {
      queryClient.setQueryData<ProductExt[]>(['product', 'byCategory'], old =>
        old?.map(p =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ) ?? []
      )
    }

    return { previous }
  },
  onError: (_err, _id, context) => {
    // 出错回滚
    if (context?.previous) {
      queryClient.setQueryData(['product', 'byCategory'], context.previous)
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['product', 'byCategory'] })
    queryClient.invalidateQueries({ queryKey: ['favorite', 'list'] })
  }
})


function toDetail(id: string) {
  router.push(`/${id}`);
}

function star(productId: string) {
  toggleFavorite.mutate(productId)
}
</script>

<template>
  <div v-if="!list">
    error
  </div>
  <div v-else v-for="product in list" :key="product.id">
    <div @click="toDetail(product.id)" class="overflow-hidden transition-shadow cursor-pointer">
      <div class="relative aspect-[3/4] bg-gradient-to-br">
        <img :src="url(product.image!)" :alt="product.name" class="w-full h-full object-cover rounded-3xl" />
        <button class="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Heart class="w-4 h-4 cursor-pointer transition"
            :class="product.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'"
            @click.stop="star(product.id)" />
        </button>
      </div>
      <div class="p-3">
        <h3 class="font-medium text-gray-900 text-sm mb-1">{{ product.name }}</h3>
        <p class="text-gray-500 text-xs mb-2">{{ product.category.name }}</p>
        <div class="flex items-center gap-4">
          <span class="font-semibold text-gray-900">${{ product.price }}</span>
          <div class="flex items-center">
            <Star class="text-yellow-400 w-3 h-3 fill-yellow-400" />
            <span class="ml-1 text-xs text-gray-500">5.0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-6" />
</template>
