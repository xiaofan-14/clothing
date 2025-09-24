<script setup lang="ts">
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits(['close'])

const visible = ref(true)

/* 自动关闭 */
watch(visible, v => {
  if (v) setTimeout(() => { visible.value = false; emit('close') }, props.duration ?? 2500)
}, { immediate: true })
</script>

<template>
  <Transition enter-active-class="transition-all duration-300" enter-from-class="-translate-y-10 opacity-0"
    leave-active-class="transition-all duration-300" leave-to-class="-translate-y-10 opacity-0">
    <div v-if="visible" class="fixed top-20 left-1/2 z-50 -translate-x-1/2
             flex items-center gap-2
             rounded-xl border border-slate-200/80
             bg-white/80 px-4 py-3 text-sm
             shadow-lg backdrop-blur-sm
             dark:border-slate-700 dark:bg-slate-900/80">
      <!-- 图标 -->
      <component :is="type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info" :class="{
        'text-green-500': type === 'success',
        'text-red-500': type === 'error',
        'text-blue-500': type === 'info',
      }" class="w-5 h-5" />
      <span class="text-slate-800 dark:text-slate-100">{{ message }}</span>
    </div>
  </Transition>
</template>
