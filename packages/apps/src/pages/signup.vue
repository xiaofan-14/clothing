<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useRouter } from "vue-router"
import bg from "@/assets/login-bg.png"
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-vue-next"
import { trpc } from "@/lib/trpc"
import { useMutation } from "@tanstack/vue-query"
import { useToast } from "@/composables/useToast"
import { useCookie } from "@/composables/useCookie"

const cookie = useCookie<string>('token')

const BACKGROUND_URL = new URL(bg, import.meta.url).href

const router = useRouter()
const { toast } = useToast()

const form = reactive({
  phone: "",
  name: "",
  password: "",
})

const { mutate, isPending } = useMutation({
  mutationFn: async () => await trpc.auth.signup.mutate(form),
  onSuccess: (data) => {
    cookie.set(data.token, { days: 7 })
    toast('注册成功', 'success')
    router.push('/')
  },
  onError: (err) => {
    toast(`注册失败 ${err.message}`, 'error')
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
  router.push('/signin')
}

function onSignup() {
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
      <form class="px-6 py-5 space-y-4">
        <!-- 用户昵称 -->
        <label class="block">
          <div class="flex items-center text-sm mb-2">
            <User class="w-4 h-4 mr-2" />
            昵称
          </div>
          <input v-model="form.name" type="text" autocomplete="nickname"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
            placeholder="2-20 个字符" />
        </label>

        <!-- 手机号二次确认 -->
        <label class="block">
          <div class="flex items-center text-sm mb-2">
            <Phone class="w-4 h-4 mr-2" />
            手机号
          </div>
          <input v-model="form.phone" type="tel" autocomplete="tel" maxlength="11"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
            placeholder="11 位手机号" />
        </label>

        <label class="block relative">
          <div class="flex items-center text-sm mb-2">
            <Lock class="w-4 h-4 mr-2" />
            密码
          </div>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password"
              class="w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
              placeholder="请输入密码" />
            <button type="button" @click="toggleShow"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 p-1 rounded hover:bg-gray-100">
              <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
            </button>
          </div>
        </label>

        <!-- submit -->
        <div class="flex flex-col gap-3 mt-4">
          <button :disabled="!isValid"
            class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-white bg-[#483028] disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onSignup">
            <UserPlus class="w-4 h-4" />
            <span v-if="!isPending">注册</span>
            <span v-else>注册中...</span>
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

        <button class="mt-4 w-full px-4 rounded-lg" @click="gotoRegister">
          <div class="flex items-center justify-center gap-2">
            <LogIn class="w-4 h-4" />
            <span>登录</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
