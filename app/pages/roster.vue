<script setup lang="ts">
import { Search, UserRound, UsersRound } from "@lucide/vue";

const { state } = useKitTrack();
const query = ref("");
const filteredMembers = computed(() =>
  state.value.members.filter((member) =>
    `${member.name} ${member.role} ${member.position ?? ""}`
      .toLowerCase()
      .includes(query.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="space-y-8">
    <section
      class="flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p class="text-sm font-medium text-orange-600">Permanent team roster</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">Roster</h1>
        <p class="mt-2 text-sm text-slate-500">
          Players and coaches stay available for every future game.
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <UserRound class="size-4" />Add member
      </button>
    </section>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Active players</p>
        <p class="mt-2 text-3xl font-bold">
          {{
            state.members.filter(
              (member) =>
                member.type === "player" && member.status === "active",
            ).length
          }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Coaches</p>
        <p class="mt-2 text-3xl font-bold">
          {{
            state.members.filter(
              (member) => member.type === "coach" && member.status === "active",
            ).length
          }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Preferred numbers</p>
        <p class="mt-2 text-3xl font-bold text-orange-600">
          {{ state.members.filter((member) => member.preferredNumber).length }}
        </p>
      </div>
    </div>
    <section class="rounded-2xl border border-slate-200 bg-white">
      <div
        class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <h2 class="text-lg font-bold">Team members</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ state.members.length }} people registered.
          </p>
        </div>
        <label class="relative block"
          ><Search
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input
            v-model="query"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:w-64"
            placeholder="Search roster"
        /></label>
      </div>
      <div class="divide-y divide-slate-100">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="flex items-center justify-between gap-4 p-5 sm:px-6"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl"
              :class="
                member.type === 'player'
                  ? 'bg-orange-50 text-orange-700'
                  : 'bg-blue-50 text-blue-700'
              "
            >
              <UsersRound class="size-4" />
            </div>
            <div class="min-w-0">
              <p class="truncate font-semibold text-slate-900">
                {{ member.name }}
              </p>
              <p class="mt-1 truncate text-xs text-slate-500">
                {{ member.role
                }}<span v-if="member.position" class="mx-1 text-slate-300"
                  >·</span
                >{{ member.position }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p
              v-if="member.preferredNumber"
              class="font-semibold text-slate-900"
            >
              #{{ String(member.preferredNumber).padStart(2, "0") }}
            </p>
            <p v-else class="text-sm text-slate-400">No jersey</p>
            <p class="mt-1 text-xs text-slate-400">Preferred number</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
