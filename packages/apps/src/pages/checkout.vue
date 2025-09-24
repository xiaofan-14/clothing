<script setup lang="ts">
import { computed } from "vue"
import { CircleEqual, Minus, Plus, CircleX } from "lucide-vue-next"
import NavigationBar from "@/components/navigation-bar.vue"
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/stores/auth";
import { url } from "@/utils/url";
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from "@/composables/useToast";
import type { CartItem } from "@clothing/servers/type";

const { toast } = useToast()
const auth = useAuthStore()
const queryClient = useQueryClient()

const user = auth.user!

const { data } = useQuery({
  queryKey: ['cart-list'],
  queryFn: async () => await trpc.cart.get.query({ userId: user.id })
})

const setQuantityMutation = useMutation({
  mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) =>
    trpc.cart.setQuantity.mutate({
      userId: user.id,
      itemId,
      quantity,
    }),
  onSuccess: () => {
    // 更新购物车缓存，重新请求 cart-list
    queryClient.invalidateQueries({ queryKey: ['cart-list'] })
  },
  onError: (err) => {
    toast(`修改失败: ${err.message}`, 'error')
  },
})

const removeItemMutation = useMutation({
  mutationFn: async (itemId: string) =>
    trpc.cart.removeItem.mutate({
      userId: user.id,
      itemId,
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart-list'] })
    toast('商品已删除', 'success')
  },
  onError: (err) => {
    toast(`删除失败: ${err.message}`, 'error')
  },
})

// const clearCartMutation = useMutation({
//   mutationFn: async () =>
//     trpc.cart.clear.mutate({
//       userId: user.id,
//     }),
//   onSuccess: () => {
//     queryClient.invalidateQueries({ queryKey: ['cart-list'] })
//     toast('购物车已清空', 'success')
//   },
//   onError: (err) => {
//     toast(`清空失败: ${err.message}`, 'error')
//   },
// })

const createOrderMutation = useMutation({
  mutationFn: async (items: {
    productId: string;
    quantity: number
  }[]) => await trpc.order.create.mutate({
    userId: user.id,
    items: items
  }),
  onSuccess: () => {
    toast('支付成功', 'success')
  },
  onError: (err) => {
    toast(`支付失败: ${err.message}`, 'error')
  }
})

const list = computed(() => data.value?.items ?? [])

const totalItems = computed(() => {
  return list.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalPrice = computed(() => {
  return list.value
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);
});

function increment(item: CartItem) {
  const newQty = item.quantity + 1
  setQuantityMutation.mutate({ itemId: item.id, quantity: newQty })
}

function decrement(item: CartItem) {
  const newQty = item.quantity - 1
  if (newQty >= 0) {
    setQuantityMutation.mutate({ itemId: item.id, quantity: newQty })
  }
}

function removeItem(itemId: string) {
  removeItemMutation.mutate(itemId)
}

// function clearCart() {
//   clearCartMutation.mutate()
// }

function pay() {
  const items = list.value.map(({ productId, quantity }) => ({ productId, quantity }))
  createOrderMutation.mutate(items)
}
</script>

<template>
  <header class="bg-white px-4 py-4 flex items-center justify-between">
    <button class="w-8 h-8 flex items-center justify-center">
    </button>
    <h1 class="text-lg font-semibold text-gray-900">购物车</h1>
    <button class="w-8 h-8 flex items-center justify-center">
      <CircleEqual class="w-5 h-5 text-gray-700" />
    </button>
  </header>

  <!-- Cart Items -->
  <div class="px-4 space-y-4">
    <div v-for="item in list" :key="item.id" class="p-4 flex items-center gap-4">
      <img :src="url(item.product.image!)" :alt="item.product.name" class="w-20 h-20 object-cover rounded-2xl" />

      <!-- Info -->
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">{{ item.product.name }}</h3>
        <p class="text-gray-500 text-sm">{{ item.product.category?.name }}</p>
        <p class="font-semibold text-gray-900">${{ item.product.price }}</p>
      </div>

      <!-- Quantity -->
      <div class="flex flex-col items-end gap-2">
        <button @click="removeItem(item.id)" class="w-8 h-8 flex items-center justify-center">
          <CircleX class="w-5 h-5 text-gray-800" />
        </button>

        <!-- Quantity -->
        <div class="flex items-center gap-3">
          <button @click="decrement(item)" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Minus class="w-4 h-4 text-gray-600" />
          </button>
          <span class="font-medium">{{ item.quantity }}</span>
          <button @click="increment(item)" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Info -->
  <div class="p-4">
    <!-- Order Summary -->
    <div class="p-4 border-t border-gray-200">
      <div class="space-y-3 mb-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Total ({{ totalItems }} items)</span>
          <span class="font-medium">${{ totalPrice }}</span>
        </div>
        <!-- <div class="flex justify-between">
          <span class="text-gray-600">Shipping Fee</span>
          <span class="font-medium">$0.00</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Discount</span>
          <span class="font-medium">$0.00</span>
        </div> -->
        <div class="flex justify-between text-lg font-semibold border-t border-gray-700 pt-2">
          <span>Sub Total</span>
          <span>${{ totalPrice }}</span>
        </div>
      </div>

      <button @click="pay" class="w-full bg-gray-900 text-white py-4 rounded-full font-medium">
        支付
      </button>
    </div>
  </div>

  <navigation-bar />
</template>
