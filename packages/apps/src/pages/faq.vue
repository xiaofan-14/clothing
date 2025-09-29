<script setup lang="ts">
import { ref } from "vue"
import { ArrowLeft, ChevronDown } from "lucide-vue-next"
import { useRouter } from "vue-router"


const router = useRouter()

// 常用问题列表
const faqs = ref([
  { id: 1, question: "如何下单？", answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, eaque.", open: false },
  { id: 2, question: "如何支付？", answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, eaque.", open: false },
  { id: 3, question: "如何退款？", answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, eaque.", open: false },
])

function toggleFaq(id: number) {
  faqs.value = faqs.value.map(faq => faq.id === id ? { ...faq, open: !faq.open } : faq)
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
  <div class="max-w-2xl mx-auto p-6">
    <div class="space-y-2">
      <div v-for="faq in faqs" :key="faq.id" class="bg-gray-700 rounded-lg overflow-hidden">
        <!-- 问题标题 -->
        <button @click="toggleFaq(faq.id)"
          class="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 focus:outline-none">
          <span class="text-gray-700 font-medium">{{ faq.question }}</span>
          <ChevronDown class="w-5 h-5 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': faq.open }" />
        </button>

        <!-- 答案内容 -->
        <div v-show="faq.open" class="px-4 py-3 text-gray-600 bg-white border-t border-gray-200">
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </div>
</template>
