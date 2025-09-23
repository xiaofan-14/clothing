<script setup lang="ts">
import { ref, computed } from "vue";

const cartItems = ref([
    {
        id: 1,
        name: "Modern light clothes",
        category: "Dress modern",
        price: "212.99",
        quantity: 4,
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
    },
    {
        id: 2,
        name: "Modern light clothes",
        category: "Dress modern",
        price: "162.99",
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
    },
]);

function goBack() {
    console.log("back");
}

const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalPrice = computed(() => {
    return cartItems.value
        .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);
});
</script>

<template>
    <!-- Header -->
    <header class="bg-white px-4 py-4 flex items-center justify-between">
        <button @click="goBack()" class="w-8 h-8 flex items-center justify-center">
            <i class="fas fa-arrow-left text-gray-700"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Checkout</h1>
        <button class="w-8 h-8 flex items-center justify-center">
            <i class="fas fa-ellipsis-h text-gray-700"></i>
        </button>
    </header>

    <!-- Cart Items -->
    <div class="p-4 space-y-4">
        <div v-for="item in cartItems" :key="item.id" class="bg-white rounded-lg p-4 flex items-center gap-4">
            <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg" />
            <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-gray-500 text-sm">{{ item.category }}</p>
                <p class="font-semibold text-gray-900">${{ item.price }}</p>
            </div>
            <div class="flex items-center gap-3">
                <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-minus text-gray-600 text-sm"></i>
                </button>
                <span class="font-medium">{{ item.quantity }}</span>
                <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-plus text-gray-600 text-sm"></i>
                </button>
            </div>
            <button class="w-8 h-8 flex items-center justify-center">
                <i class="fas fa-ellipsis-v text-gray-400"></i>
            </button>
        </div>
    </div>

    <!-- Payment Info -->
    <div class="p-4">
        <div class="bg-white rounded-lg p-4 mb-4">
            <h3 class="font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center gap-3">
                    <i class="fab fa-cc-visa text-blue-600 text-xl"></i>
                    <span class="text-gray-700">**** **** **** 2143</span>
                </div>
                <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-4">
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
                <hr class="my-3" />
                <div class="flex justify-between text-lg font-semibold">
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
