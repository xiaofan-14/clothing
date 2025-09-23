<script setup lang="ts">
import HeaderBar from "@/components/home/header-bar.vue"
import SearchBar from "@/components/home/search-bar.vue"
import CategoryTabs from "@/components/home/category-tabs.vue"
import ProductCard from "@/components/home/product-card.vue"
import navigationBar from "@/components/navigation-bar.vue"

export interface Product {
  id: number
  name: string
  category: string
  price: string
  rating: string
  image: string
  originalPrice: string
  reviews: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Modern Light Clothes',
    category: 'T-shirt',
    price: '212.99',
    originalPrice: '250.99',
    rating: '5.0',
    reviews: '7,932',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop'
  },
  {
    id: 2,
    name: 'Light Dress Bless',
    category: 'Dress modern',
    price: '162.99',
    originalPrice: '190.99',
    rating: '5.0',
    reviews: '7,932',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'
  },
  {
    id: 3,
    name: 'Casual Summer Dress',
    category: 'Dress',
    price: '189.99',
    originalPrice: '220.99',
    rating: '4.8',
    reviews: '5,421',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop'
  },
  {
    id: 4,
    name: 'Urban Style Jacket',
    category: 'Jacket',
    price: '299.99',
    originalPrice: '350.99',
    rating: '4.9',
    reviews: '3,215',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop'
  }
]
</script>

<template>
  <HeaderBar />
  <SearchBar />
  <CategoryTabs />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
  <navigation-bar />
</template>
