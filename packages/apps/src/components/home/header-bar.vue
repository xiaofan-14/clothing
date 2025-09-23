<script setup lang="ts">
import { User } from "lucide-vue-next"
</script>

<template>
  <header class="bg-white px-4 py-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm">Hello, Welcome 👋</p>
        <h1 class="text-lg font-semibold text-gray-900">Albert Stevano</h1>
      </div>
      <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
        <User class="w-5 h-5 text-white" />
      </div>
    </div>
  </header>
</template>
