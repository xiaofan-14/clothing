import { computed } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { trpc } from '@/trpc'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'

export function useCart() {
  const authStore = useAuthStore()

  // 1. 获取购物车列表
  const { data, refetch } = useQuery({
    queryKey: ['cart-list'],
    queryFn: async () => {
      if (!authStore.user) return { items: [] }
      return trpc.cart.get.query({ userId: authStore.user.id })
    },
    enabled: computed(() => !!authStore.user),
  })

  const list = computed(() => data.value?.items ?? [])

  const totalItems = computed(() =>
    list.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    list.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  )

  // 2. 增加/修改数量
  const setQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!authStore.user) throw new Error('未登录')
      return trpc.cart.setQuantity.mutate({
        userId: authStore.user.id,
        itemId,
        quantity,
      })
    },
    onSuccess: () => {
      refetch()
    },
    onError: (err) => {
      toast(`修改数量失败: ${err.message}`, 'error')
    },
  })

  // 3. 添加商品
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity?: number }) => {
      if (!authStore.user) throw new Error('未登录')
      return trpc.cart.addItem.mutate({
        userId: authStore.user.id,
        productId,
        quantity: quantity ?? 1,
      })
    },
    onSuccess: () => {
      refetch()
      toast('已加入购物车', 'success')
    },
    onError: (err) => {
      toast(`添加失败: ${err.message}`, 'error')
    },
  })

  // 4. 删除单项
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!authStore.user) throw new Error('未登录')
      return trpc.cart.removeItem.mutate({
        userId: authStore.user.id,
        itemId,
      })
    },
    onSuccess: () => {
      refetch()
      toast('已删除商品', 'success')
    },
    onError: (err) => {
      toast(`删除失败: ${err.message}`, 'error')
    },
  })

  // 5. 清空购物车
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!authStore.user) throw new Error('未登录')
      return trpc.cart.clear.mutate({ userId: authStore.user.id })
    },
    onSuccess: () => {
      refetch()
      toast('购物车已清空', 'success')
    },
    onError: (err) => {
      toast(`清空失败: ${err.message}`, 'error')
    },
  })

  // 操作函数
  const addItem = (productId: string, quantity?: number) =>
    addItemMutation.mutate({ productId, quantity })

  const setQuantity = (itemId: string, quantity: number) =>
    setQuantityMutation.mutate({ itemId, quantity })

  const removeItem = (itemId: string) => removeItemMutation.mutate(itemId)

  const clearCart = () => clearCartMutation.mutate()

  const increment = (itemId: string, current: number) => setQuantity(itemId, current + 1)
  const decrement = (itemId: string, current: number) => {
    const newQty = current - 1
    setQuantity(itemId, newQty >= 0 ? newQty : 0)
  }

  return {
    list,
    totalItems,
    totalPrice,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    increment,
    decrement,
  }
}
