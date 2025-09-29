<script setup lang="ts">
import { reactive, watchEffect } from "vue"
import { useToast } from "@/composables/useToast"
import { ArrowLeft, UserCircle, Phone, Lock, Save } from "lucide-vue-next"
import { useRouter } from "vue-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { trpc } from "@/lib/trpc"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@clothing/servers/type"

const { toast } = useToast()
const router = useRouter()
const auth = useAuthStore()
const user = auth.user!
const { token, setAuth } = auth

const { data } = useQuery({
  queryKey: ['user_profile'],
  queryFn: async () => await trpc.auth.me.query({ userId: user.id })
})

const queryClient = useQueryClient()

const { mutateAsync, isPending } = useMutation({
  mutationFn: async () => await trpc.auth.update.mutate({
    userId: user.id,
    name: form.name,
    phone: form.phone,
    password: form.password || undefined
  }),
  onSuccess: async (updatedUser) => {
    toast("资料已更新")

    // 更新 query 缓存
    queryClient.setQueryData(['user_profile'], updatedUser)

    // 更新本地状态
    setAuth(token!, updatedUser as unknown as User)
  },
  onError: (err) => {
    toast("更新失败：" + err.message)
  }
})

const form = reactive({
  name: "",
  phone: "",
  password: ""
})

watchEffect(() => {
  if (data.value) {
    form.name = data.value.name
    form.phone = data.value.phone
    form.password = ""
  }
})

async function handleSubmit() {
  await mutateAsync()
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
    <h1 class="text-lg font-semibold text-gray-900">个人资料</h1>
    <button class="w-8 h-8 flex items-center justify-center">
    </button>
  </header>
  <div class="max-w-md mx-auto p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 用户名 -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">用户名</label>
        <div class="relative">
          <UserCircle class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input v-model="form.name" type="text"
            class="block w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            placeholder="请输入用户名" />
        </div>
      </div>

      <!-- 手机号 -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">手机号</label>
        <div class="relative">
          <Phone class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input v-model="form.phone" type="tel"
            class="block w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            placeholder="请输入手机号" />
        </div>
      </div>

      <!-- 密码 -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">密码</label>
        <div class="relative">
          <Lock class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input v-model="form.password" type="password"
            class="block w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            placeholder="请输入密码" />
        </div>
      </div>

      <!-- 提交按钮 -->
      <button type="submit" :disabled="isPending"
        class="flex items-center justify-center gap-2 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:bg-gray-400">
        <Save class="h-4 w-4" />
        {{ isPending ? "更新中..." : "保存修改" }}
      </button>
    </form>
  </div>
</template>
