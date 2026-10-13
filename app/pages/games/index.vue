<script setup lang="ts">
import { ArrowUpRight, CalendarDays, CirclePlus } from "@lucide/vue";
import StatusPill from "~/components/StatusPill.vue";

const { state, createGame } = useKitTrack();
const route = useRoute();
const router = useRouter();
const showCreate = ref(route.query.create === "1");
const form = reactive({
  opponent: "",
  date: new Date().toISOString().slice(0, 10),
  time: "18:00",
  venue: "",
  competition: "",
  kitColour: "Black",
});
const formError = ref("");

watch(
  () => route.query.create,
  (create) => {
    showCreate.value = create === "1";
  },
);

function closeCreate() {
  showCreate.value = false;
  if (route.query.create) router.replace({ query: {} });
}

function submitGame() {
  if (!form.opponent || !form.date || !form.time || !form.venue) {
    formError.value = "Opponent, date, time, and venue are required.";
    return;
  }
  formError.value = "";
  const game = createGame({ ...form });
  closeCreate();
  router.push(`/games/${game.id}`);
}

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
        type="button"
        @click="showCreate = true"
      >
        <CirclePlus class="size-4" />Create game
      </button>
    </section>
    <ActionModal
      v-if="showCreate"
      title="Create a game"
      description="Set up the fixture before selecting participants and issuing kit."
      @close="closeCreate"
    >
      <form class="space-y-4" @submit.prevent="submitGame">
        <p
          v-if="formError"
          class="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {{ formError }}
        </p>
        <label class="block text-sm font-medium text-slate-700"
          >Opponent<input
            v-model="form.opponent"
            class="form-input"
            placeholder="e.g. Titans"
        /></label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700"
            >Date<input v-model="form.date" type="date" class="form-input"
          /></label>
          <label class="block text-sm font-medium text-slate-700"
            >Time<input v-model="form.time" type="time" class="form-input"
          /></label>
        </div>
        <label class="block text-sm font-medium text-slate-700"
          >Venue<input
            v-model="form.venue"
            class="form-input"
            placeholder="e.g. Bukom Arena"
        /></label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700"
            >Competition<input
              v-model="form.competition"
              class="form-input"
              placeholder="Optional"
          /></label>
          <label class="block text-sm font-medium text-slate-700"
            >Kit<select v-model="form.kitColour" class="form-input">
              <option>Black</option>
              <option>White</option>
            </select></label
          >
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
            @click="closeCreate"
          >
            Cancel</button
          ><button
            type="submit"
            class="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create game
          </button>
        </div>
      </form>
    </ActionModal>
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
