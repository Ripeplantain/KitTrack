<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "default" | "sm";
  }>(),
  {
    variant: "primary",
    size: "default",
  },
);

const buttonClass = computed(() =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:pointer-events-none disabled:opacity-50",
    props.size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
    props.variant === "primary" &&
      "bg-slate-950 text-white shadow-sm hover:bg-slate-800",
    props.variant === "secondary" &&
      "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    props.variant === "ghost" &&
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ),
);
</script>

<template>
  <button :class="buttonClass"><slot /></button>
</template>
