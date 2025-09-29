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
import { useToast } from "@/composables/useToast";

const auth = useAuthStore()
const { toast } = useToast()
const user = auth.user!

const active = ref('all')
const keyword = ref('')

interface ListType extends Product {
  category: {
    id: string,
    name: string
  }
  isFavorite: boolean
}

const { data } = useQuery<Product[]>({
  queryKey: ['product', 'byCategory'],
  queryFn: async () => {

    let products
    if (user.name) {
      products = await trpc.product.getlist.query({})
    } else {
      products = await trpc.product.getlist.query({ userId: user.id })
    }

    return products.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))
  },
})

const products = computed(() => {
  const temp = data.value as ListType[]
  if (!temp) return []

  // 分类过滤
  let result =
    active.value === "all"
      ? temp
      : temp.filter(e => e.category.name === active.value)

  // 关键字过滤逻辑
  if (keyword.value.trim()) {
    const filtered = result.filter(e =>
      e.name.toLowerCase().includes(keyword.value.toLowerCase())
    )
    if (filtered.length === 0) {
      toast("没有找到这个商品")
      return result // 没找到，回退到分类数据
    }
    return filtered // 找到，返回过滤结果
  }

  return result
})

</script>

<template>
  <HeaderBar />
  <SearchBar v-model:keyword="keyword" />
  <CategoryTabs v-model:active="active" />
  <div class="px-4 py-4">
    <div class="grid grid-cols-2 gap-4">
      <ProductCard v-if="products.length > 0" :products="products" />
    </div>
  </div>
  <navigation-bar />
</template>
