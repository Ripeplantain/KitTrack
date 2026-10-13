<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  label: string;
  value: string | number;
  detail: string;
  icon: Component;
  tone?: "ink" | "orange" | "blue" | "green";
}>();

const toneClasses = {
  ink: "bg-slate-900 text-white",
  orange: "bg-orange-50 text-orange-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
};
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.55)]"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ label }}</p>
        <p class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {{ value }}
        </p>
      </div>
      <div
        class="flex size-10 items-center justify-center rounded-xl"
        :class="toneClasses[tone ?? 'ink']"
      >
        <component :is="icon" class="size-5" :stroke-width="1.8" />
      </div>
    </div>
    <p class="mt-4 text-xs text-slate-500">{{ detail }}</p>
  </div>
</template>
