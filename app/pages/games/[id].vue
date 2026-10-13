<script setup lang="ts">
import {
  ArrowLeft,
  Check,
  ClipboardCheck,
  MapPin,
  Shirt,
  UserRound,
} from "@lucide/vue";
import StatusPill from "~/components/StatusPill.vue";
import {
  getCollectionSummary,
  getJerseyLabel,
} from "~/utils/jersey-accounting";

const route = useRoute();
const { state, markReturned } = useKitTrack();
const game = computed(() =>
  state.value.games.find((item) => item.id === route.params.id),
);
const issuances = computed(() =>
  state.value.issuances.filter(
    (issuance) => issuance.gameId === game.value?.id,
  ),
);
const summary = computed(() => getCollectionSummary(issuances.value));
const copied = ref(false);
const copyFailed = ref(false);
const rows = computed(() =>
  issuances.value.map((issuance) => ({
    issuance,
    member: state.value.members.find(
      (member) => member.id === issuance.memberId,
    ),
    jersey: state.value.jerseys.find(
      (jersey) => jersey.id === issuance.jerseyId,
    ),
  })),
);

function formatDate(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function printChecklist() {
  if (import.meta.client) window.print();
}

async function copyChecklist() {
  if (!import.meta.client || !game.value) return;
  const text = [
    `Leopards vs ${game.value.opponent}`,
    `${formatDate(game.value.date)} · ${game.value.time} · ${game.value.venue}`,
    "Jersey return checklist",
    ...rows.value.map(
      (row) =>
        `${row.member?.name ?? "Unknown"} — ${row.jersey ? getJerseyLabel(row.jersey) : "No jersey"} — ${row.issuance.status === "returned" ? "Returned" : "Outstanding"}`,
    ),
  ].join("\n");
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API unavailable");
    }
    copyFailed.value = false;
    copied.value = true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copiedWithFallback = document.execCommand("copy");
    textarea.remove();
    copyFailed.value = !copiedWithFallback;
    copied.value = copiedWithFallback;
  }
  window.setTimeout(() => {
    copied.value = false;
    copyFailed.value = false;
  }, 1800);
}

if (!game.value) {
  throw createError({ statusCode: 404, statusMessage: "Game not found" });
}
</script>

<template>
  <div v-if="game" class="space-y-8">
    <NuxtLink
      to="/games"
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      ><ArrowLeft class="size-4" />Back to games</NuxtLink
    >
    <section
      class="flex flex-col justify-between gap-6 md:flex-row md:items-end"
    >
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-sm font-medium text-orange-600">Game reconciliation</p>
          <StatusPill
            :label="
              game.status === 'closed' ? 'Closed' : 'Awaiting reconciliation'
            "
            :tone="game.status === 'closed' ? 'neutral' : 'warning'"
          />
        </div>
        <h1 class="mt-3 text-3xl font-bold tracking-tight">
          Leopards vs {{ game.opponent }}
        </h1>
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <span>{{ formatDate(game.date) }} · {{ game.time }}</span
          ><span class="inline-flex items-center gap-1.5"
            ><MapPin class="size-4" />{{ game.venue }}</span
          ><span class="inline-flex items-center gap-1.5"
            ><Shirt class="size-4" />{{ game.kitColour }} kit</span
          >
        </div>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
        type="button"
        @click="printChecklist"
      >
        <ClipboardCheck class="size-4" />Print return checklist
      </button>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        type="button"
        @click="copyChecklist"
      >
        {{ copied ? "Copied" : copyFailed ? "Copy failed" : "Copy plain text" }}
      </button>
    </section>
    <section class="grid gap-4 sm:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400">
          Issued
        </p>
        <p class="mt-2 text-3xl font-bold">{{ summary.issued }}</p>
      </div>
      <div class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
        <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Returned
        </p>
        <p class="mt-2 text-3xl font-bold text-emerald-700">
          {{ summary.returned }}
        </p>
      </div>
      <div class="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
        <p class="text-xs font-bold uppercase tracking-wider text-orange-600">
          Outstanding
        </p>
        <p class="mt-2 text-3xl font-bold text-orange-700">
          {{ summary.outstanding }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400">
          Participants
        </p>
        <p class="mt-2 text-3xl font-bold">
          {{
            game.participantIds.filter(
              (id) =>
                state.members.find((member) => member.id === id)?.type ===
                "player",
            ).length
          }}
        </p>
      </div>
    </section>
    <section class="rounded-2xl border border-slate-200 bg-white">
      <div class="border-b border-slate-100 p-5 sm:p-6">
        <h2 class="text-lg font-bold">Jersey return checklist</h2>
        <p class="mt-1 text-sm text-slate-500">
          Only physically issued jerseys appear here. Check each one in as it
          returns.
        </p>
      </div>
      <div class="divide-y divide-slate-100">
        <div
          v-for="row in rows"
          :key="row.issuance.id"
          class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-12 items-center justify-center rounded-xl"
              :class="
                row.issuance.status === 'returned'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-950 text-white'
              "
            >
              <Check
                v-if="row.issuance.status === 'returned'"
                class="size-5"
              /><span v-else class="text-sm font-bold">{{
                row.jersey ? getJerseyLabel(row.jersey) : "—"
              }}</span>
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ row.member?.name }}</p>
              <p class="mt-1 text-xs text-slate-500">
                {{ row.jersey?.kitColour }} kit
                <span class="mx-1 text-slate-300">·</span
                >{{ row.member?.type === "player" ? "Player" : "Coach" }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 sm:justify-end">
            <StatusPill
              :label="
                row.issuance.status === 'returned' ? 'Returned' : 'Outstanding'
              "
              :tone="row.issuance.status === 'returned' ? 'success' : 'warning'"
            /><button
              v-if="row.issuance.status === 'issued'"
              class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="markReturned(row.issuance.id)"
            >
              Mark returned</button
            ><span v-else class="text-xs font-medium text-slate-400"
              >Checked in</span
            >
          </div>
        </div>
      </div>
    </section>
    <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div class="flex gap-3">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500"
        >
          <UserRound class="size-4" />
        </div>
        <div>
          <p class="text-sm font-bold text-slate-800">Roster for this game</p>
          <p class="mt-1 text-sm text-slate-500">
            {{
              game.participantIds
                .map(
                  (id) =>
                    state.members.find((member) => member.id === id)?.name,
                )
                .filter(Boolean)
                .join(" · ")
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
  <div
    v-else
    class="rounded-2xl border border-slate-200 bg-white p-10 text-center"
  >
    <h1 class="text-xl font-bold">Game not found</h1>
    <NuxtLink
      to="/games"
      class="mt-3 inline-block text-sm font-semibold text-orange-600"
      >Return to games</NuxtLink
    >
  </div>
</template>
