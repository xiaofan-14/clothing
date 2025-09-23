<script setup lang="ts">
import type { Product } from "@/pages/index.vue";
import { Heart, Star } from "lucide-vue-next"
import { useRouter } from "vue-router";

defineProps<{ product: Product }>()

const router = useRouter();

function toDetail(id: number){
  router.push(`/${id}`);
}

function star(){
  console.log('star');
}
</script>

<template>
  <div @click="toDetail(product.id)" class="overflow-hidden transition-shadow cursor-pointer">
    <div class="relative aspect-[3/4] bg-gradient-to-br">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover rounded-3xl" />
      <button class="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
        <Heart class="text-gray-600 w-4 h-4" @click.stop="star" />
        <!-- 点击 Heart 样式 fill-red-500 text-red-500 -->
      </button>
    </div>
    <div class="p-3">
      <h3 class="font-medium text-gray-900 text-sm mb-1">{{ product.name }}</h3>
      <p class="text-gray-500 text-xs mb-2">{{ product.category }}</p>
      <div class="flex items-center gap-4">
        <span class="font-semibold text-gray-900">${{ product.price }}</span>
        <div class="flex items-center">
          <Star class="text-yellow-400 w-3 h-3 fill-yellow-400" />
          <span class="ml-1 text-xs text-gray-500">{{ product.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
