<script setup lang="ts">
import { ArrowUpRight, CalendarDays, CirclePlus } from "@lucide/vue";
import StatusPill from "~/components/StatusPill.vue";

const { state } = useKitTrack();

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
</script>

<template>
  <div class="space-y-8">
    <section
      class="flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p class="text-sm font-medium text-orange-600">Game management</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">Games</h1>
        <p class="mt-2 text-sm text-slate-500">
          Prepare rosters, issue jerseys, and reconcile every return.
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <CirclePlus class="size-4" />Create game
      </button>
    </section>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">All games</p>
        <p class="mt-2 text-3xl font-bold">{{ state.games.length }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Needs attention</p>
        <p class="mt-2 text-3xl font-bold text-orange-600">
          {{
            state.games.filter(
              (game) => game.status === "awaiting_reconciliation",
            ).length
          }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Closed</p>
        <p class="mt-2 text-3xl font-bold text-emerald-600">
          {{ state.games.filter((game) => game.status === "closed").length }}
        </p>
      </div>
    </div>
    <section
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div
        class="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:grid"
      >
        <span>Game</span><span>Date</span><span>Kit</span><span>Status</span
        ><span />
      </div>
      <div class="divide-y divide-slate-100">
        <NuxtLink
          v-for="game in state.games"
          :key="game.id"
          :to="`/games/${game.id}`"
          class="grid gap-3 px-5 py-5 transition hover:bg-slate-50 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center md:gap-4 md:px-6"
          ><div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
            >
              <CalendarDays class="size-4" />
            </div>
            <div>
              <p class="font-semibold text-slate-900">
                Leopards vs {{ game.opponent }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ game.venue }} · {{ game.participantIds.length }} participants
              </p>
            </div>
          </div>
          <p class="text-sm text-slate-600">
            {{ formatDate(game.date) }} · {{ game.time }}
          </p>
          <p class="text-sm text-slate-600">{{ game.kitColour }} kit</p>
          <div>
            <StatusPill
              :label="
                game.status === 'closed'
                  ? 'Closed'
                  : game.status === 'awaiting_reconciliation'
                    ? 'Collecting'
                    : 'Scheduled'
              "
              :tone="
                game.status === 'closed'
                  ? 'neutral'
                  : game.status === 'awaiting_reconciliation'
                    ? 'warning'
                    : 'success'
              "
            />
          </div>
          <ArrowUpRight class="size-4 text-slate-300"
        /></NuxtLink>
      </div>
    </section>
  </div>
</template>
