<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from 'lucide-vue-next'
import { useRoute } from "vue-router";
import { useQuery } from '@tanstack/vue-query';
import { url } from "@/utils/url";
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { trpc } from '@/lib/trpc';
import type { Product } from '@clothing/servers/type';

const route = useRoute();
const router = useRouter()

const { toast } = useToast()
const id = route.params.id as string

const { data } = useQuery<Product>({
  queryKey: ['product', id],
  queryFn: async () => {
    const product = await trpc.product.getById.query({ id: id });
    if (!product) throw new Error('Product not found');
    return {
      ...product,
      createdAt: new Date(product.createdAt as string),
    };
  },
  enabled: !!id
});

const quantity = ref(1)
const selectedSize = ref('L')
const selectedColor = ref('gray')

const sizes = ['S', 'M', 'L', 'XL']
const colors = [
  { name: 'gray', value: '#9CA3AF' },
  { name: 'brown', value: '#8B4513' },
  { name: 'black', value: '#111827' }
] as Array<{ name: string; value: string }>

function goBack() {
  router.back()
}

function increaseQuantity() {
  quantity.value++
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const auth = ref(false)

function addToCart() {
  if (!auth.value) {
    toast('请先登录', 'info')
    router.push('/signin')
  } else {
    // 添加到购物车逻辑
    console.log('Adding to cart:', {
      product: data.value,
      quantity: quantity.value,
      size: selectedSize.value,
      color: selectedColor.value
    })
    toast('已加入购物车', 'success')
  }
}

</script>

<template>
  <div v-if="!data">
    error
  </div>
  <div v-else>
    <!-- Product Image with rounded corners -->
    <div class="px-4 py-6">
      <div class="aspect-square overflow-hidden relative rounded-2xl">
        <div class="absolute flex w-full justify-between p-4 z-100">
          <button @click="goBack()" class="bg-white w-10 h-10 flex items-center justify-center rounded-full">
            <ChevronLeftIcon class="w-6 h-6 text-gray-700" />
          </button>
          <button class="bg-white w-10 h-10 flex items-center justify-center rounded-full">
            <HeartIcon class="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div class="w-full h-full overflow-hidden">
          <div class="absolute inset-0 bg-cover bg-center blur-lg scale-110 opacity-40"
            :style="{ backgroundImage: `url(${url(data.image!)})` }" />

          <img :src="url(data.image!)" :alt="data.name" class="relative w-full h-full object-contain object-center" />
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="px-4">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-lg font-bold text-gray-900 mb-2">
            {{ data.name }}
          </h1>

          <!-- Rating -->
          <div class="flex items-center">
            <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
            <span class="ml-1 text-sm text-gray-600 font-medium">
              5.0 (100 reviews)
            </span>
          </div>
        </div>
        <!-- Quantity Selector -->
        <div class="flex items-center">
          <button @click="decreaseQuantity" :disabled="quantity <= 1"
            class="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center ">
            <MinusIcon class="w-4 h-4 text-gray-600" />
          </button>
          <span class="mx-2 text-gray-700 text-lg">{{ quantity }}</span>
          <button @click="increaseQuantity"
            class="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center">
            <PlusIcon class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-500 text-sm leading-relaxed mb-6">
        Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes.
        <button class="text-black text-md font-bold transition-colors">Read More...</button>
      </p>

      <div class="flex mb-8 justify-between">
        <!-- Size Selection -->
        <div>
          <span class="text-gray-900 text-md font-bold">Choose Size</span>
          <div class="flex gap-2 mt-4">
            <button v-for="size in sizes" :key="size" @click="selectedSize = size" :class="[
              'w-8 h-8 rounded-full font-semibold text-sm transition-all duration-200',
              selectedSize === size
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600'
            ]">
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Color Selection -->
        <div>
          <span class="text-gray-900 text-md font-bold">Color</span>
          <div class="flex gap-2 mt-4">
            <button v-for="color in colors" :key="color.name" @click="selectedColor = color.name" :class="[
              'w-8 h-8 rounded-full transition-all duration-200 hover:scale-110',
              selectedColor === color.name
                ? 'border-2 border-gray-700 shadow-lg'
                : 'border-gray-200'
            ]" :style="{ backgroundColor: color.value }">
            </button>
          </div>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button @click="addToCart()"
        class="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-semibold flex items-center justify-center mb-8 transition-all duration-200 shadow-lg hover:shadow-xl">
        <ShoppingCartIcon class="w-5 h-5 mr-3" />
        <span>Add to Cart | ${{ data.price }}</span>
      </button>
    </div>
  </div>
</template>
