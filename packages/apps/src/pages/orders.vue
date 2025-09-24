<script setup lang="ts">
import { ref } from "vue"
import {
  Package,
} from "lucide-vue-next"

// Tab 列表
const tabs = [
  { id: "all", name: "全部" },
  { id: "pending", name: "待付款" },
  { id: "shipped", name: "待发货" },
  { id: "delivering", name: "待收货" },
  { id: "completed", name: "已完成" },
]

const activeTab = ref("all")

// 模拟订单数据
const orders = ref([
  {
    id: "ord1",
    status: "待付款",
    statusColor: "text-red-500",
    image: "https://picsum.photos/100/100?1",
    title: "夏季新款T恤",
    price: 129,
  },
  {
    id: "ord2",
    status: "待发货",
    statusColor: "text-yellow-500",
    image: "https://picsum.photos/100/100?2",
    title: "牛仔裤男宽松版",
    price: 199,
  },
  {
    id: "ord3",
    status: "待收货",
    statusColor: "text-blue-500",
    image: "https://picsum.photos/100/100?3",
    title: "运动鞋 Air Max",
    price: 499,
  },
  {
    id: "ord4",
    status: "已完成",
    statusColor: "text-green-600",
    image: "https://picsum.photos/100/100?4",
    title: "连衣裙 夏日清新风",
    price: 299,
  },
])
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部 Tab -->
    <div class="flex bg-white shadow px-4 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 py-3 text-center text-sm font-medium border-b-2"
        :class="
          activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="p-4 space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <!-- 头部：状态 -->
        <div
          class="flex items-center justify-between px-4 py-2 border-b text-sm"
        >
          <div class="flex items-center gap-2 text-gray-600">
            <Package class="w-4 h-4" />
            <span>订单号: {{ order.id }}</span>
          </div>
          <span :class="order.statusColor">{{ order.status }}</span>
        </div>

        <!-- 内容：商品 -->
        <div class="flex gap-4 p-4">
          <img
            :src="order.image"
            alt="product"
            class="w-20 h-20 object-cover rounded-md"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-800 line-clamp-2">
              {{ order.title }}
            </p>
            <p class="mt-2 text-red-500 font-semibold">￥{{ order.price }}</p>
          </div>
        </div>

        <!-- 底部：操作按钮 -->
        <div class="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            class="px-3 py-1 text-sm border rounded-md text-gray-600 hover:bg-gray-100"
          >
            查看详情
          </button>
          <button
            v-if="order.status === '待付款'"
            class="px-3 py-1 text-sm border rounded-md text-white bg-blue-500 hover:bg-blue-600"
          >
            去付款
          </button>
          <button
            v-else-if="order.status === '待收货'"
            class="px-3 py-1 text-sm border rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            确认收货
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
