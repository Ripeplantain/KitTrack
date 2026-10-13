<script setup lang="ts">
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Check,
  CirclePlus,
  Shirt,
  UsersRound,
} from "@lucide/vue";
import MetricCard from "~/components/MetricCard.vue";
import StatusPill from "~/components/StatusPill.vue";
import {
  getAvailableJerseys,
  getCollectionSummary,
  getJerseyLabel,
} from "~/utils/jersey-accounting";

const { state, markReturned, resetDemo } = useKitTrack();
const activeGame = computed(
  () =>
    state.value.games.find(
      (game) => game.status === "awaiting_reconciliation",
    ) ?? state.value.games[0],
);
const activeIssuances = computed(() =>
  state.value.issuances.filter(
    (issuance) => issuance.gameId === activeGame.value?.id,
  ),
);
const summary = computed(() => getCollectionSummary(activeIssuances.value));
const availableJerseys = computed(
  () => getAvailableJerseys(state.value.jerseys).length,
);
const players = computed(
  () =>
    state.value.members.filter(
      (member) => member.type === "player" && member.status === "active",
    ).length,
);
const issuanceRows = computed(() =>
  activeIssuances.value.map((issuance) => ({
    issuance,
    member: state.value.members.find((item) => item.id === issuance.memberId),
    jersey: state.value.jerseys.find((item) => item.id === issuance.jerseyId),
  })),
);
const recentGames = computed(() => state.value.games.slice(0, 3));

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function gameStatusLabel(status: string) {
  return status === "closed"
    ? "Closed"
    : status === "awaiting_reconciliation"
      ? "Collecting"
      : "Scheduled";
}

function gameStatusTone(status: string) {
  return status === "closed"
    ? "neutral"
    : status === "awaiting_reconciliation"
      ? "warning"
      : "success";
}
</script>

<template>
  <div class="space-y-8">
    <section
      class="flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p class="text-sm font-medium text-orange-600">
          Sunday, 18 October 2026
        </p>
        <h1
          class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
        >
          Good evening, Kofi.
        </h1>
        <p class="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Keep every jersey accounted for. You have one game awaiting
          reconciliation.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <CirclePlus class="size-4" />Create game</button
        ><button
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          @click="resetDemo"
        >
          Reset demo
        </button>
      </div>
    </section>
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Registered players"
        :value="players"
        detail="Active team members"
        :icon="UsersRound"
        tone="blue"
      /><MetricCard
        label="Team jerseys"
        :value="state.jerseys.length"
        detail="Across black and white kits"
        :icon="Shirt"
        tone="ink"
      /><MetricCard
        label="Available now"
        :value="availableJerseys"
        detail="Ready to issue for a game"
        :icon="Check"
        tone="green"
      /><MetricCard
        label="Outstanding"
        :value="summary.outstanding"
        detail="Need to be collected"
        :icon="AlertTriangle"
        tone="orange"
      />
    </section>

    <section
      class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]"
    >
      <div
        class="rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.55)]"
      >
        <div
          class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-slate-950">
                Jersey collection
              </h2>
              <StatusPill
                :label="gameStatusLabel(activeGame?.status ?? '')"
                :tone="gameStatusTone(activeGame?.status ?? '')"
              />
            </div>
            <p class="mt-1 text-sm text-slate-500">
              {{
                activeGame?.opponent
                  ? `Leopards vs ${activeGame.opponent}`
                  : "No active game"
              }}
              · {{ activeGame ? formatGameDate(activeGame.date) : "" }}
            </p>
          </div>
          <NuxtLink
            :to="`/games/${activeGame?.id ?? ''}`"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >Open game<ArrowUpRight class="size-4"
          /></NuxtLink>
        </div>
        <div class="grid grid-cols-3 border-b border-slate-100 bg-slate-50/60">
          <div class="p-5 sm:p-6">
            <p
              class="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Issued
            </p>
            <p class="mt-2 text-2xl font-bold text-slate-950">
              {{ summary.issued }}
            </p>
          </div>
          <div class="border-x border-slate-100 p-5 sm:p-6">
            <p
              class="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Returned
            </p>
            <p class="mt-2 text-2xl font-bold text-emerald-600">
              {{ summary.returned }}
            </p>
          </div>
          <div class="p-5 sm:p-6">
            <p
              class="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Outstanding
            </p>
            <p class="mt-2 text-2xl font-bold text-orange-600">
              {{ summary.outstanding }}
            </p>
          </div>
        </div>
        <div class="divide-y divide-slate-100">
          <div
            v-for="row in issuanceRows"
            :key="row.issuance.id"
            class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white"
              >
                {{ row.jersey ? getJerseyLabel(row.jersey) : "—" }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">
                  {{ row.member?.name }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ row.jersey?.kitColour }} kit
                  <span class="mx-1 text-slate-300">·</span
                  >{{ row.jersey?.size }} size
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <StatusPill
                :label="
                  row.issuance.status === 'returned'
                    ? 'Returned'
                    : 'Outstanding'
                "
                :tone="
                  row.issuance.status === 'returned' ? 'success' : 'warning'
                "
              /><button
                v-if="row.issuance.status === 'issued'"
                class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                @click="markReturned(row.issuance.id)"
              >
                Mark returned</button
              ><span v-else class="text-xs font-medium text-slate-400"
                >Checked in</span
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_35px_-22px_rgba(15,23,42,0.9)] sm:p-7"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p
              class="text-xs font-bold uppercase tracking-[0.18em] text-orange-300"
            >
              Next game
            </p>
            <h2 class="mt-3 text-2xl font-bold tracking-tight">
              vs {{ activeGame?.opponent }}
            </h2>
            <p class="mt-2 text-sm text-slate-300">
              {{ activeGame?.venue }} · {{ activeGame?.time }}
            </p>
          </div>
          <div
            class="flex size-11 items-center justify-center rounded-2xl bg-white/10"
          >
            <CalendarDays class="size-5 text-orange-300" />
          </div>
        </div>
        <div class="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-300">Roster confirmed</span
            ><span class="font-semibold"
              >{{ activeGame?.participantIds.length }} people</span
            >
          </div>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div class="h-full w-3/4 rounded-full bg-orange-400" />
          </div>
          <p class="mt-3 text-xs text-slate-400">
            {{ activeGame?.competition }} · {{ activeGame?.kitColour }} kit
            selected
          </p>
        </div>
        <NuxtLink
          :to="`/games/${activeGame?.id ?? ''}`"
          class="mt-6 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
          >Continue game setup<ArrowUpRight class="size-4"
        /></NuxtLink>
      </div>
    </section>

    <section
      class="rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.55)]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6"
      >
        <div>
          <h2 class="text-lg font-bold text-slate-950">Recent games</h2>
          <p class="mt-1 text-sm text-slate-500">
            A quick view of your team's accountability history.
          </p>
        </div>
        <NuxtLink
          to="/games"
          class="hidden items-center gap-1.5 text-sm font-semibold text-orange-600 sm:flex"
          >View all<ArrowUpRight class="size-4"
        /></NuxtLink>
      </div>
      <div class="divide-y divide-slate-100">
        <NuxtLink
          v-for="game in recentGames"
          :key="game.id"
          :to="`/games/${game.id}`"
          class="flex flex-col gap-3 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          ><div class="flex items-center gap-4">
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
                {{ formatGameDate(game.date) }} · {{ game.venue }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 sm:justify-end">
            <span class="text-xs font-medium text-slate-400"
              >{{
                game.participantIds.filter(
                  (id) =>
                    state.members.find((member) => member.id === id)?.type ===
                    "player",
                ).length
              }}
              players</span
            ><StatusPill
              :label="gameStatusLabel(game.status)"
              :tone="gameStatusTone(game.status)"
            /><ArrowUpRight
              class="hidden size-4 text-slate-300 sm:block"
            /></div
        ></NuxtLink>
      </div>
    </section>
    <p class="text-center text-xs text-slate-400">
      Demo data is saved in this browser only. Connect Neon to make records
      team-owned and persistent.
    </p>
  </div>
</template>
