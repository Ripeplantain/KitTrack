<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center"
      role="presentation"
      @click.self="emit('close')"
    >
      <section
        class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-950">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm text-slate-500">
              {{ description }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
            @click="emit('close')"
          >
            ×
          </button>
        </div>
        <div class="mt-6">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
