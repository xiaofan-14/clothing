<script setup lang="ts">
import { ref } from "vue"
import { House, ShoppingCart, Heart, UserRound } from "lucide-vue-next"
import { useRouter } from "vue-router"

const router = useRouter()

interface Tab {
  id: number
  icon: any
  badge?: number
  active: boolean
  to: string
}

const bottomTabs = ref<Tab[]>([
  { id: 1, icon: House, active: true, to: '/' },
  { id: 2, icon: ShoppingCart, badge: 2, active: false, to: '/checkout' },
  { id: 3, icon: Heart, active: false, to: '/' },
  { id: 4, icon: UserRound, active: false, to: '/me' },
])

function setActiveTab(tabId: number) {
  let to = '/'
  bottomTabs.value.forEach((tab) => {
    if (tab.id === tabId)
      to = tab.to
    tab.active = tab.id === tabId
  })
  router.push(to)
}
</script>

<template>
  <nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[327px] h-[60px] bg-[#292526] rounded-full shadow-lg flex items-center justify-around px-4">
    <button v-for="tab in bottomTabs" :key="tab.id"
      class="relative w-10 h-10 flex items-center justify-center rounded-full"
      :class="tab.active ? 'bg-white/10 text-white' : 'text-gray-400'" @click="setActiveTab(tab.id)">
      <!-- 图标 -->
      <component :is="tab.icon" class="w-6 h-6" />

      <!-- badge -->
      <span v-if="tab.badge"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ tab.badge }}
      </span>
    </button>
  </nav>
</template>
