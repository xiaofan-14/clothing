<script setup lang="ts">
import { ref } from "vue";

const item = {
  id: 1,
  name: "Modern Light Clothes",
  category: "T-shirt",
  price: "212.99",
  originalPrice: "250.99",
  rating: "5.0",
  reviews: "7,932",
  image:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
};

const quantity = ref(1);

const sizes = ["S", "M", "L", "XL"];

const selectedSize = ref("L");
const selectedColor = ref("black");

const colors = ref([
  { name: "gray", value: "#9CA3AF" },
  { name: "dark", value: "#374151" },
  { name: "black", value: "#111827" },
]);

const selectedProduct = ref<typeof item>(item);

function goBack() {
  console.log("back");
}

function addToCart() {
  console.log("add to cart");
}
</script>

<template>
  <!-- Header -->
  <header class="flex items-center justify-between p-4">
    <button @click="goBack()" class="w-8 h-8 flex items-center justify-center">
      <i class="fas fa-arrow-left text-gray-700"></i>
    </button>
    <button class="w-8 h-8 flex items-center justify-center">
      <i class="far fa-heart text-gray-700"></i>
    </button>
  </header>

  <!-- Product Image -->
  <div class="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 mx-4 rounded-lg overflow-hidden mb-6">
    <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-full object-cover" />
  </div>

  <!-- Product Info -->
  <div class="px-4">
    <h1 class="text-2xl font-semibold text-gray-900 mb-2">
      {{ selectedProduct.name }}
    </h1>

    <div class="flex items-center mb-4">
      <div class="flex items-center">
        <i class="fas fa-star text-yellow-400 text-sm"></i>
        <span class="ml-1 text-sm text-gray-600">{{ selectedProduct.rating }} ({{
          selectedProduct.reviews
        }}
          reviews)</span>
      </div>
    </div>

    <div class="flex items-center mb-6">
      <button class="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
        <i class="fas fa-minus text-gray-600 text-sm"></i>
      </button>
      <span class="mx-4 font-medium text-lg">{{ quantity }}</span>
      <button class="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center" @click="quantity++">
        <i class="fas fa-plus text-gray-600 text-sm"></i>
      </button>
    </div>

    <p class="text-gray-600 text-sm leading-relaxed mb-6">
      Its simple and elegant shape makes it perfect for those of you who like
      you who want minimalist clothes.
      <span class="text-blue-500 cursor-pointer">Read More...</span>
    </p>

    <!-- Size Selection -->
    <div class="mb-6">
      <h3 class="font-medium text-gray-900 mb-3">Choose Size</h3>
      <div class="flex gap-3">
        <button v-for="size in sizes" :key="size" :class="[
          'w-12 h-12 rounded-full border-2 font-medium text-sm',
          selectedSize === size
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-200 text-gray-600 hover:border-gray-300',
        ]" @click="selectedSize = size">
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Color Selection -->
    <div class="mb-8">
      <h3 class="font-medium text-gray-900 mb-3">Color</h3>
      <div class="flex gap-3">
        <button v-for="color in colors" :key="color.name" :class="[
          'w-8 h-8 rounded-full border-2',
          selectedColor === color.name
            ? 'border-gray-900'
            : 'border-gray-200',
        ]" :style="{ backgroundColor: color.value }" @click="selectedColor = color.name"></button>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <button class="w-full bg-gray-900 text-white py-4 rounded-full font-medium flex items-center justify-center mb-8"
      @click="addToCart()">
      <i class="fas fa-shopping-cart mr-2"></i>
      Add to Cart | ${{ selectedProduct.price }}
      <span class="ml-1 text-gray-400 line-through">${{ selectedProduct.originalPrice }}</span>
    </button>
  </div>
</template>
