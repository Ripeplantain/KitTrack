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
    onMounted(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.value = JSON.parse(stored) as KitTrackState;
      }
      hydrated.value = true;
    });
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
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

  function resetDemo() {
    state.value = cloneState(demoState);
    persist();
  }

  return { state, markReturned, resetDemo };
}
