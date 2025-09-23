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
import type { Product } from '../index.vue';

const route = useRoute();

const id = route.params.id;
console.log(id);
const selectedProduct = ref<Product>({
  id: 1,
  name: 'Modern Light Clothes',
  category: 'T-shirt',
  price: '212.99',
  originalPrice: '250.99',
  rating: '5.0',
  reviews: '7,932',
  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop'
})

// Reactive data
const quantity = ref(1)
const selectedSize = ref('L')
const selectedColor = ref('black')

const sizes = ['S', 'M', 'L', 'XL']
const colors = [
  { name: 'gray', value: '#9CA3AF' },
  { name: 'brown', value: '#8B4513' },
  { name: 'black', value: '#111827' }
] as Array<{ name: string; value: string }>

// Methods
const goBack = () => {
  // 返回上一页逻辑
  console.log('Going back...')
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  // 添加到购物车逻辑
  console.log('Adding to cart:', {
    product: selectedProduct,
    quantity: quantity.value,
    size: selectedSize.value,
    color: selectedColor.value
  })
}
</script>

<template>
  <!-- Product Image with rounded corners -->
  <div class="px-4 py-6">
    <div class="aspect-square overflow-hidden relative rounded-2xl">
      <div class="absolute flex w-full justify-between p-4">
        <button @click="goBack()"
          class="bg-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeftIcon class="w-6 h-6 text-gray-700" />
        </button>
        <button
          class="bg-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <HeartIcon class="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-full object-cover" />
    </div>
  </div>

  <!-- Product Info -->
  <div class="px-4">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h1 class="text-lg font-bold text-gray-900 mb-2">
          {{ selectedProduct.name }}
        </h1>

        <!-- Rating -->
        <div class="flex items-center">
          <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
          <span class="ml-1 text-sm text-gray-600 font-medium">
            {{ selectedProduct.rating }} ({{ selectedProduct.reviews }} reviews)
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
      <div >
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
      <span>Add to Cart | ${{ selectedProduct.price }}</span>
      <span class="ml-2 text-gray-400 line-through text-sm">
        ${{ selectedProduct.originalPrice }}
      </span>
    </button>
  </div>
</template>
