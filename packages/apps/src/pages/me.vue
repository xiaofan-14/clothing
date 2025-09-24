<script setup lang="ts">
import { ref } from "vue"
import {
  Package,
  Ticket,
  Heart,
  MapPin,
  MessageCircle,
  Settings,
  ChevronRight,
} from "lucide-vue-next"
import NavigationBar from "@/components/navigation-bar.vue"
import { useRouter } from "vue-router"

const router = useRouter()

const user = ref({
  avatar: "https://i.pravatar.cc/150?img=12",
  name: "John Doe",
  level: "VIP 2",
})

const features = [
  { id: "orders", name: "我的订单", icon: Package, to: "/orders" },
  { id: "coupon", name: "优惠券", icon: Ticket, to: "#" },
  { id: "favorite", name: "收藏夹", icon: Heart, to: "#" },
  { id: "address", name: "收货地址", icon: MapPin, to: "#" },
]

const services = [
  { id: "support", name: "客服中心", icon: MessageCircle },
  { id: "settings", name: "设置", icon: Settings },
]

function go(to: string){
  router.push(to)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部用户信息 -->
    <div class="bg-white shadow px-4 py-6 flex items-center gap-4">
      <img :src="user.avatar" alt="avatar" class="w-16 h-16 rounded-full object-cover" />
      <div>
        <p class="font-semibold text-lg">{{ user.name }}</p>
        <p class="text-sm text-gray-500">{{ user.level }}</p>
      </div>
      <div class="ml-auto">
        <button class="text-sm text-gray-700 hover:underline">
          编辑资料
        </button>
      </div>
    </div>

    <!-- 常用功能 -->
    <div class="mt-4 bg-white shadow rounded-lg p-4">
      <h2 class="font-medium mb-4">常用功能</h2>
      <div class="grid grid-cols-4 gap-4">
        <button v-for="f in features" :key="f.id" class="flex flex-col items-center justify-center gap-2 text-gray-700"
          @click="go(f.to)">
          <component :is="f.icon" class="w-6 h-6 text-red-400" />
          <span class="text-sm">{{ f.name }}</span>
        </button>
      </div>
    </div>

    <!-- 服务 -->
    <div class="mt-4 bg-white shadow rounded-lg divide-y divide-gray-300">
      <button v-for="s in services" :key="s.id"
        class="flex items-center justify-between px-4 py-3 w-full text-left hover:bg-gray-50">
        <div class="flex items-center gap-3">
          <component :is="s.icon" class="w-5 h-5 text-slate-500" />
          <span class="text-gray-700">{{ s.name }}</span>
        </div>
        <ChevronRight class="w-4 h-4 text-gray-400" />
      </button>
    </div>
    <navigation-bar />
  </div>
</template>
