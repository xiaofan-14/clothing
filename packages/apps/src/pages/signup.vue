<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useRouter } from "vue-router"
import bg from "@/assets/login-bg.png"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-vue-next"
import { Google, Apple, Wechat } from "@/components/icons"

const BACKGROUND_URL = new URL(bg, import.meta.url).href
const registerRoute = "/register"

const router = useRouter()

// 表单状态
const form = reactive({
  account: "", // 邮箱或手机号
  password: "",
  remember: true,
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref("")

// 简单校验
const isValid = computed(() => {
  return form.account.trim().length > 0 && form.password.length >= 6
})

function toggleShow() {
  showPassword.value = !showPassword.value
}

async function onSubmit() {
  error.value = ""
  if (!isValid.value) {
    error.value = "请填写账号并保证密码不少于 6 位。"
    return
  }
  loading.value = true
  try {
    // === 在这里调用你的登录接口 ===
    // await auth.login({ account: form.account, password: form.password, remember: form.remember })

    // 模拟延迟
    await new Promise((r) => setTimeout(r, 800))

    // 登录成功后跳转 (示例)
    router.push({ path: "/" })
  } catch (e: any) {
    // 根据后端返回设置友好错误
    error.value = e?.message || "登录失败，请重试。"
  } finally {
    loading.value = false
  }
}

function gotoRegister() {
  router.push({ path: registerRoute })
}

/** 第三方登录占位函数：在这里接入 OAuth 流程 */
function oauthLogin(provider: "github" | "google" | "wechat") {
  // 示例：打开 OAuth 跳转
  // window.location.href = `/api/oauth/${provider}/redirect`
  // 这里我们只展示交互
  alert(`trigger OAuth flow: ${provider}`)
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
            <Mail class="w-4 h-4 mr-2" />
            账号（邮箱或手机号）
          </div>
          <input v-model="form.account" type="text" autocomplete="username"
            class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-none transition"
            placeholder="请输入邮箱或手机号" />
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
          <button :disabled="!isValid || loading"
            class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-white bg-[#483028] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit">
            <UserPlus class="w-4 h-4" />
            <span v-if="!loading">注册</span>
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
