import { demoState } from "~/data/demo";
import type { KitTrackState } from "~/types/kittrack";

const STORAGE_KEY = "kittrack-demo-state";

function cloneState(state: KitTrackState): KitTrackState {
  return JSON.parse(JSON.stringify(state)) as KitTrackState;
}

export function useKitTrack() {
  const state = useState<KitTrackState>("kittrack-state", () =>
    cloneState(demoState),
  );
  const hydrated = useState("kittrack-hydrated", () => false);

  if (import.meta.client && !hydrated.value) {
    onMounted(async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          state.value = JSON.parse(stored) as KitTrackState;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      try {
        state.value = await $fetch<KitTrackState>("/api/state");
      } catch {
        // Production uses the Postgres adapter until the relational API is enabled.
      }
      hydrated.value = true;
    });
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
      void $fetch("/api/state", { method: "PUT", body: state.value }).catch(
        () => undefined,
      );
    }
  }

  function markReturned(issuanceId: string) {
    const issuance = state.value.issuances.find(
      (item) => item.id === issuanceId,
    );
    state.value = {
      ...state.value,
      issuances: state.value.issuances.map((item) =>
        item.id === issuanceId
          ? {
              ...item,
              status: "returned",
              returnedAt: new Date().toISOString(),
            }
          : item,
      ),
      jerseys: state.value.jerseys.map((jersey) =>
        issuance?.jerseyId === jersey.id
          ? { ...jersey, status: "available" }
          : jersey,
      ),
    };
    persist();
  }

  function createGame(
    input: Omit<
      KitTrackState["games"][number],
      "id" | "status" | "participantIds"
    >,
  ) {
    const game = {
      ...input,
      id: `game-${Date.now()}`,
      status: "scheduled" as const,
      participantIds: [],
    };
    state.value = { ...state.value, games: [game, ...state.value.games] };
    persist();
    return game;
  }

  function addMember(
    input: Omit<KitTrackState["members"][number], "id" | "status">,
  ) {
    const member = {
      ...input,
      id: `member-${Date.now()}`,
      status: "active" as const,
    };
    state.value = { ...state.value, members: [member, ...state.value.members] };
    persist();
    return member;
  }

  function registerJersey(
    input: Omit<KitTrackState["jerseys"][number], "id" | "status">,
  ) {
    const jersey = {
      ...input,
      id: `jersey-${Date.now()}`,
      status:
        input.condition && input.condition !== "Good"
          ? ("unavailable" as const)
          : ("available" as const),
    };
    state.value = { ...state.value, jerseys: [jersey, ...state.value.jerseys] };
    persist();
    return jersey;
  }

  function resetDemo() {
    state.value = cloneState(demoState);
    persist();
  }

  return {
    state,
    markReturned,
    createGame,
    addMember,
    registerJersey,
    resetDemo,
  };
}
