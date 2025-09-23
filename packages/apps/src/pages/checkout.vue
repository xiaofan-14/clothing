<script setup lang="ts">
import { CircleEqual, Minus, Plus, CircleX  } from "lucide-vue-next"
import { ref, computed } from "vue"

const cartItems = ref([
  {
    id: 1,
    name: "Casual Shirt",
    category: "Men • Shirt",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    quantity: 1,
  },
  {
    id: 2,
    name: "Denim Jacket",
    category: "Women • Jacket",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    quantity: 2,
  },
])

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalPrice = computed(() => {
  return cartItems.value
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);
});
</script>

<template>
  <header class="bg-white px-4 py-4 flex items-center justify-between">
    <button  class="w-8 h-8 flex items-center justify-center">
    </button>
    <h1 class="text-lg font-semibold text-gray-900">Checkout</h1>
    <button class="w-8 h-8 flex items-center justify-center">
      <CircleEqual class="w-5 h-5 text-gray-700" />
    </button>
  </header>

  <!-- Cart Items -->
  <div class="px-4 space-y-4">
    <div v-for="item in cartItems" :key="item.id" class="p-4 flex items-center gap-4">
      <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-2xl" />

      <!-- Info -->
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
        <p class="text-gray-500 text-sm">{{ item.category }}</p>
        <p class="font-semibold text-gray-900">${{ item.price }}</p>
      </div>

      <!-- Quantity -->
      <div class="flex flex-col items-end gap-2">
        <button class="w-8 h-8 flex items-center justify-center">
          <CircleX  class="w-5 h-5 text-gray-800" />
        </button>

        <!-- Quantity -->
        <div class="flex items-center gap-3">
          <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Minus class="w-4 h-4 text-gray-600" />
          </button>
          <span class="font-medium">{{ item.quantity }}</span>
          <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Info -->
  <div class="p-4">
    <!-- <div class="bg-white rounded-lg p-4 mb-4">
      <h3 class="font-medium text-gray-900 mb-4">Shipping Information</h3>
      <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-3">
          <i class="fab fa-cc-visa text-blue-600 text-xl"></i>
          <span class="text-gray-700">**** **** **** 2143</span>
        </div>
        <i class="fas fa-chevron-down text-gray-400"></i>
      </div>
    </div> -->

    <!-- Order Summary -->
    <div class="p-4 border-t border-gray-200">
      <div class="space-y-3 mb-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Total ({{ totalItems }} items)</span>
          <span class="font-medium">${{ totalPrice }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Shipping Fee</span>
          <span class="font-medium">$0.00</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Discount</span>
          <span class="font-medium">$0.00</span>
        </div>
        <div class="flex justify-between text-lg font-semibold border-t border-gray-700 pt-2">
          <span>Sub Total</span>
          <span>${{ totalPrice }}</span>
        </div>
      </div>

      <button class="w-full bg-gray-900 text-white py-4 rounded-full font-medium">
        Pay
      </button>
    </div>
  </div>
</template>
