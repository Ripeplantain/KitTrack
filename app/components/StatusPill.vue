<script setup lang="ts">
const props = defineProps<{
  label: string;
  tone?: "success" | "warning" | "neutral" | "danger";
}>();

const toneClasses = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/10",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="toneClasses[props.tone ?? 'neutral']"
  >
    <span class="size-1.5 rounded-full bg-current opacity-70" />
    {{ label }}
  </span>
</template>
