<script setup lang="ts">
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Shirt,
  UsersRound,
} from "@lucide/vue";

const route = useRoute();
const isMenuOpen = ref(false);

const navigation = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Games", to: "/games", icon: CalendarDays },
  { label: "Jersey inventory", to: "/jerseys", icon: Shirt },
  { label: "Roster", to: "/roster", icon: UsersRound },
];

function isActive(path: string) {
  return path === "/" ? route.path === "/" : route.path.startsWith(path);
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f8fa] text-slate-950">
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex"
    >
      <div class="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div
          class="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"
        >
          <Shirt class="size-5" :stroke-width="2" />
        </div>
        <div>
          <p class="text-base font-bold tracking-tight">KitTrack</p>
          <p class="text-[11px] font-medium text-slate-400">
            Jersey accountability
          </p>
        </div>
      </div>
      <div class="px-4 pt-7">
        <p
          class="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"
        >
          Workspace
        </p>
        <nav class="mt-3 space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
            :class="
              isActive(item.to)
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            "
            @click="isMenuOpen = false"
            ><component
              :is="item.icon"
              class="size-[18px]"
              :stroke-width="1.8"
            />{{ item.label }}</NuxtLink
          >
        </nav>
      </div>
      <div class="mt-auto border-t border-slate-100 p-4">
        <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div
            class="flex size-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700"
          >
            KA
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-slate-800">
              Kofi Asante
            </p>
            <p class="truncate text-xs text-slate-400">Captain</p>
          </div>
          <ChevronDown class="size-4 text-slate-400" />
        </div>
      </div>
    </aside>

    <div class="lg:pl-64">
      <header
        class="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-[#f7f8fa]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10"
      >
        <div class="flex items-center gap-3">
          <button
            class="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
            aria-label="Open navigation"
            @click="isMenuOpen = !isMenuOpen"
          >
            <Menu class="size-5" />
          </button>
          <div class="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <span>Leopards Basketball Club</span><span>/</span
            ><span class="font-medium text-slate-700">{{
              route.path === "/" ? "Overview" : route.name
            }}</span>
          </div>
          <p class="text-sm font-semibold text-slate-800 sm:hidden">KitTrack</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="relative flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell class="size-[18px]" :stroke-width="1.8" /><span
              class="absolute right-2 top-2 size-1.5 rounded-full bg-orange-500 ring-2 ring-white"
            /></button
          ><button
            class="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 sm:flex"
          >
            <span
              class="flex size-6 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700"
              >KA</span
            ><span>Kofi Asante</span
            ><ChevronDown class="size-4 text-slate-400" />
          </button>
        </div>
      </header>
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"
        @click="isMenuOpen = false"
      >
        <div
          class="w-72 border-r border-slate-200 bg-white p-4 shadow-2xl"
          @click.stop
        >
          <div class="mb-5 flex items-center gap-3 px-2 py-2">
            <div
              class="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white"
            >
              <Shirt class="size-5" />
            </div>
            <p class="font-bold">KitTrack</p>
          </div>
          <nav class="space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium"
              :class="
                isActive(item.to) ? 'bg-slate-950 text-white' : 'text-slate-600'
              "
              @click="isMenuOpen = false"
              ><component :is="item.icon" class="size-[18px]" />{{
                item.label
              }}</NuxtLink
            >
          </nav>
        </div>
      </div>
      <main class="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <slot />
      </main>
    </div>
  </div>
</template>
