<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronLeftIcon,
  Menu
} from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'
import { trpc } from '@/lib/trpc'
import { useAuthStore } from '@/stores/auth'
import { url } from '@/utils/url'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { toast } = useToast()
const router = useRouter()

const user = auth.user!

const { data } = useQuery({
  queryKey: ['order-list'],
  queryFn: async () => await trpc.order.list.query({
    userId: user.id,
    limit: 20,
  })
})

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待付款', color: 'text-orange-500 bg-orange-50', icon: Clock },
  paid: { label: '待发货', color: 'text-blue-500 bg-blue-50', icon: Package },
  shipped: { label: '待收货', color: 'text-green-500 bg-green-50', icon: Truck },
  completed: { label: '已完成', color: 'text-gray-500 bg-gray-50', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-red-500 bg-red-50', icon: XCircle },
}

const actionText: Record<string, string> = {
  pending: '去付款',
  paid: '提醒发货',
  shipped: '确认收货',
  completed: '评价',
  cancelled: '删除订单',
}

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'pending', name: '待付款' },
  { id: 'shipped', name: '待收货' },
]
const activeTab = ref('all')

const orders = computed(() =>
  activeTab.value === 'all'
    ? data.value?.orders
    : data.value?.orders.filter((o) => o.status === activeTab.value),
)

function toDetail() {
  toast('功能开发中', 'info')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部标签 -->
    <div class="sticky top-0 z-10 bg-white shadow px-4 overflow-x-auto">
      <header class="px-4 py-4 flex items-center justify-between">
        <ChevronLeftIcon @click="goBack()" class="w-6 h-6 text-gray-700" />
        <h1 class="text-lg font-semibold text-gray-900">订单</h1>
        <button class="w-8 h-8 flex items-center justify-center">
          <Menu class="w-6 h-6 text-gray-700" />
        </button>
      </header>
      <div class="flex">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="flex-1 py-3 text-center text-sm font-medium border-b-2 transition" :class="activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            ">
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 订单卡片 -->
    <div class="p-4 space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <Package class="w-4 h-4" />
            <span>{{ order.id.slice(-10) }}</span>
          </div>
          <span class="px-2 py-1 text-xs rounded-full font-medium" :class="statusMap[order.status]!.color">
            <component :is="statusMap[order.status]!.icon" class="inline w-3 h-3 mr-1" />
            {{ statusMap[order.status]!.label }}
          </span>
        </div>

        <!-- 商品列表 -->
        <div class="divide-y divide-gray-600">
          <div v-for="item in order.items" :key="item.id" class="flex gap-4 p-4">
            <img :src="url(item.product.image!)" alt="product" class="w-20 h-20 object-cover rounded-lg" />
            <div class="flex-1">
              <p class="font-medium text-gray-800 line-clamp-2">
                {{ item.product.name }}
              </p>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-gray-500">x{{ item.quantity }}</span>
                <span class="text-red-500 font-semibold">
                  ￥{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部：总计 + 操作 -->
        <div class="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div class="text-sm text-gray-600">
            共 {{ order.items.length }} 件 · 合计
            <span class="text-red-500 font-semibold ml-1">￥{{ order.total.toFixed(2) }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="toDetail" class="px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-gray-100">
              查看详情
            </button>
            <button v-if="order.status !== 'completed' && order.status !== 'cancelled'"
              class="px-3 py-1.5 text-sm rounded-lg text-white" :class="{
                'bg-orange-500 hover:bg-orange-600': order.status === 'pending',
                'bg-blue-500 hover:bg-blue-600': order.status === 'paid',
                'bg-green-500 hover:bg-green-600': order.status === 'shipped',
              }">
              {{ actionText[order.status] }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空态 -->
      <div v-if="orders && orders!.length === 0" class="text-center py-10 text-gray-400">
        <Package class="mx-auto w-12 h-12 mb-2" />
        <p>暂无订单</p>
      </div>
    </div>
  </div>
</template>
