<script setup lang="ts">
import { Search, Shirt } from "@lucide/vue";
import StatusPill from "~/components/StatusPill.vue";
import { getJerseyLabel } from "~/utils/jersey-accounting";

const { state, registerJersey } = useKitTrack();
const query = ref("");
const showRegister = ref(false);
const form = reactive({
  number: "",
  kitColour: "Black",
  size: "",
  condition: "Good",
});
const formError = ref("");
const filteredJerseys = computed(() =>
  state.value.jerseys.filter((jersey) =>
    `${jersey.number} ${jersey.kitColour} ${jersey.size ?? ""} ${jersey.condition ?? ""}`
      .toLowerCase()
      .includes(query.value.toLowerCase()),
  ),
);

function submitJersey() {
  const number = Number(form.number);
  if (!Number.isInteger(number) || number < 0) {
    formError.value = "Enter a valid jersey number.";
    return;
  }
  registerJersey({
    number,
    kitColour: form.kitColour,
    size: form.size || undefined,
    condition: form.condition,
  });
  showRegister.value = false;
  form.number = "";
  form.size = "";
  form.condition = "Good";
  formError.value = "";
}
</script>

<template>
  <div class="space-y-8">
    <section
      class="flex flex-col justify-between gap-5 md:flex-row md:items-end"
    >
      <div>
        <p class="text-sm font-medium text-orange-600">Physical inventory</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">Jersey inventory</h1>
        <p class="mt-2 text-sm text-slate-500">
          Track every physical jersey by its own internal identity.
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
        type="button"
        @click="showRegister = true"
      >
        <Shirt class="size-4" />Register jersey
      </button>
    </section>
    <ActionModal
      v-if="showRegister"
      title="Register a jersey"
      description="Numbers may repeat across kit colours; every physical jersey gets its own record."
      @close="showRegister = false"
    >
      <form class="space-y-4" @submit.prevent="submitJersey">
        <p
          v-if="formError"
          class="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {{ formError }}
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700"
            >Number<input
              v-model="form.number"
              type="number"
              min="0"
              class="form-input"
          /></label>
          <label class="block text-sm font-medium text-slate-700"
            >Kit<select v-model="form.kitColour" class="form-input">
              <option>Black</option>
              <option>White</option>
            </select></label
          >
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700"
            >Size<input
              v-model="form.size"
              class="form-input"
              placeholder="Optional"
          /></label>
          <label class="block text-sm font-medium text-slate-700"
            >Condition<select v-model="form.condition" class="form-input">
              <option>Good</option>
              <option>Awaiting repair</option>
              <option>Damaged</option>
            </select></label
          >
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
            @click="showRegister = false"
          >
            Cancel</button
          ><button
            type="submit"
            class="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Register jersey
          </button>
        </div>
      </form>
    </ActionModal>
    <section class="rounded-2xl border border-slate-200 bg-white">
      <div
        class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <h2 class="text-lg font-bold">All jerseys</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ state.jerseys.length }} physical items registered.
          </p>
        </div>
        <label class="relative block"
          ><Search
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input
            v-model="query"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:w-64"
            placeholder="Search jerseys"
        /></label>
      </div>
      <div
        class="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:p-6"
      >
        <div
          v-for="jersey in filteredJerseys"
          :key="jersey.id"
          class="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div
              class="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white"
            >
              {{ getJerseyLabel(jersey) }}
            </div>
            <StatusPill
              :label="jersey.status"
              :tone="
                jersey.status === 'available'
                  ? 'success'
                  : jersey.status === 'issued'
                    ? 'warning'
                    : jersey.status === 'unavailable'
                      ? 'danger'
                      : 'neutral'
              "
            />
          </div>
          <p class="mt-5 font-semibold text-slate-900">
            {{ jersey.kitColour }} kit
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ jersey.size ? `Size ${jersey.size}` : "Size not recorded" }}
            <span v-if="jersey.condition" class="mx-1 text-slate-300">·</span
            >{{ jersey.condition }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
