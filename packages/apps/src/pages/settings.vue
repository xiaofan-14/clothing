<script setup lang="ts">
import { ref } from "vue"
import { User, Bell, Shield, ArrowLeft } from "lucide-vue-next"
import { useToast } from "@/composables/useToast"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const { toast } = useToast()
const router = useRouter()
const { clearAuth } = useAuthStore()

// 功能列表
const settings = ref([
  { id: 1, name: "个人资料", icon: User, to: '/profile' },
  { id: 2, name: "通知设置", icon: Bell, to: '#' },
  { id: 3, name: "隐私设置", icon: Shield, to: '#' },
])

function go(url: string) {
  if (url === '#') {
    toast('功能开发中', 'info')
    return
  }
  router.push(url)
}

function signout(){
  clearAuth()
  toast('已退出登录', 'success')
  router.push('/')
}

function back() {
  router.back()
}
</script>

<template>
  <header class="bg-white px-4 py-4 flex items-center justify-between">
    <button @click="back" class="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full">
      <ArrowLeft class="w-5 h-5 text-gray-700" />
    </button>
    <h1 class="text-lg font-semibold text-gray-900">设置</h1>
    <button class="w-8 h-8 flex items-center justify-center">
    </button>
  </header>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <div class="space-y-2">
      <!-- 常用功能列表 -->
      <div v-for="item in settings" :key="item.id" @click="go(item.to)"
        class="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        <component :is="item.icon" class="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
        <span class="text-gray-700 dark:text-gray-100">{{ item.name }}</span>
      </div>
    </div>
  </div>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
    <button @click="signout" class="border border-gray-600 w-full py-2 rounded-full shadow-xs">
      退出登录
    </button>
  </div>
</template>
