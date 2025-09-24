<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useRouter } from "vue-router"
import bg from "@/assets/login-bg.png"
import {
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Phone,
} from "lucide-vue-next"
import { Google, Apple, Wechat } from "@/components/icons"
import { useMutation } from "@tanstack/vue-query"
import { trpc } from "@/lib/trpc"
import { useToast } from "@/composables/useToast"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@clothing/servers/type"

const BACKGROUND_URL = new URL(bg, import.meta.url).href

const router = useRouter()
const { toast } = useToast()
const authStore = useAuthStore()

// 表单状态
const form = reactive({
  phone: "",
  password: "",
})

const { mutate, isPending } = useMutation({
  mutationFn: async () => await trpc.auth.signin.mutate(form),
  onSuccess: (data) => {
    authStore.setAuth(data.token, data.user as unknown as User)
    toast('登录成功', 'success')
    router.push('/')
  },
  onError: (err) => {
    toast(`登录失败 ${err.message}`, 'error')
  }
})

const showPassword = ref(false)

// 简单校验
const isValid = computed(() => {
  return form.phone.trim().length > 0 && form.password.length >= 6
})

function toggleShow() {
  showPassword.value = !showPassword.value
}

function gotoRegister() {
  router.push('/signup')
}

function onSignin() {
  mutate()
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center" :style="{
    backgroundImage: `linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.45)), url('${BACKGROUND_URL}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <!-- container -->
    <div class="w-full max-w-md text-white mx-4 rounded-2xl overflow-hidden" role="main">
      <!-- form -->
      <form class="px-6 py-5 space-y-4">
        <!-- account -->
        <label class="block">
          <div class="flex items-center text-sm mb-2">
            <Phone class="w-4 h-4 mr-2" />
            手机号
          </div>
          <input v-model="form.phone" type="text" autocomplete="phone"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
            placeholder="请输入手机号" />
        </label>

        <!-- password -->
        <label class="block relative">
          <div class="flex items-center text-sm mb-2">
            <Lock class="w-4 h-4 mr-2" />
            密码
          </div>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password"
              class="w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
              placeholder="至少 6 位" />
            <button type="button" @click="toggleShow"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 p-1 rounded hover:bg-gray-100"
              :aria-pressed="showPassword" :title="showPassword ? '隐藏密码' : '显示密码'">
              <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
            </button>
          </div>
        </label>

        <!-- submit -->
        <div class="flex flex-col gap-3">
          <button :disabled="!isValid"
            class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-white bg-[#483028] disabled:opacity-50 disabled:cursor-not-allowed"
            @click.prevent="onSignin">
            <LogIn class="w-4 h-4" />
            <span v-if="!isPending">登录</span>
            <span v-else>登录中...</span>
          </button>
        </div>
      </form>

      <!-- divider -->
      <div class="px-6 py-3">
        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-gray-200"></div>
          <div class="text-xs">其他方式</div>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- third party -->
        <div class="mt-3 flex items-center justify-center gap-4">
          <button class="flex items-center justify-center px-2 py-2 rounded-full bg-white" aria-label="登录 Google">
            <Google />
          </button>
          <button class="flex items-center justify-center px-2 py-2 rounded-full bg-white" aria-label="登录 Apple">
            <Apple />
          </button>
          <button class="flex items-center justify-center px-2 py-2 rounded-full bg-white" aria-label="登录 Wechat">
            <Wechat />
          </button>
        </div>
        <button class="mt-4 w-full px-4 rounded-lg" @click="gotoRegister">
          <div class="flex items-center justify-center gap-2">
            <UserPlus class="w-4 h-4" />
            <span>注册新账号</span>
          </div>
        </button>
      </div>

    </div>
  </div>
</template>
