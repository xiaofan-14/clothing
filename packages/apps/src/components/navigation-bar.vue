<script setup lang="ts">
import { computed, ref } from "vue"
import { House, ShoppingCart, Heart, UserRound } from "lucide-vue-next"
import { useRouter, useRoute } from "vue-router"

interface Tab {
  id: number
  icon: any
  badge?: number
  to: string
}

const router = useRouter()
const route = useRoute()

const bottomTabs = ref<Tab[]>([
  { id: 1, icon: House, to: '/' },
  { id: 2, icon: ShoppingCart, to: '/checkout' },
  { id: 3, icon: Heart, to: '/favorites' },
  { id: 4, icon: UserRound, to: '/me' },
])

async function go(to: string) {
  await router.push(to)
}

const isActive = (to: string) => computed(() => route.path === to)

</script>

<template>
  <nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[327px] h-[60px] backdrop-blur-md rounded-full shadow-lg flex items-center justify-around px-4">
    <button v-for="tab in bottomTabs" :key="tab.id"
      class="relative w-10 h-10 flex items-center justify-center rounded-full"
      :class="isActive(tab.to).value ? 'bg-black/50 text-white' : 'text-gray-400'" @click="go(tab.to)">
      <!-- 图标 -->
      <component :is="tab.icon" :class="isActive(tab.to).value ? 'w-6 h-6 text-red-700' : 'w-6 h-6 text-red-300'" />

      <!-- badge -->
      <span v-if="tab.badge"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ tab.badge }}
      </span>
    </button>
  </nav>
</template>
