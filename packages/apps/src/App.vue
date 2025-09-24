<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { trpc } from "./lib/trpc";
import type { User } from "@clothing/servers/type";

const auth = useAuthStore()

onMounted(async () => {
  if (!auth.token) {
    try {
      const me = await trpc.auth.me.query()
      auth.user = me as unknown as User
      console.log(me);
    } catch {
      auth.clearAuth()
    }
  }
})
</script>

<template>
  <RouterView />
</template>
