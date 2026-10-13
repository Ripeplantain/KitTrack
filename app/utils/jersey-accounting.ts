import type { Jersey, JerseyIssuance } from "~/types/kittrack";

export function isPhysicallyIssued(issuance: JerseyIssuance) {
  return ["issued", "returned", "lost", "damaged"].includes(issuance.status);
}

export function isOutstanding(issuance: JerseyIssuance) {
  return issuance.status === "issued";
}

export function getCollectionSummary(issuances: JerseyIssuance[]) {
  const issued = issuances.filter(isPhysicallyIssued).length;
  const returned = issuances.filter(
    (issuance) => issuance.status === "returned",
  ).length;
  const outstanding = issuances.filter(isOutstanding).length;
  const resolved = issuances.filter((issuance) =>
    ["returned", "lost", "damaged"].includes(issuance.status),
  ).length;

  return { issued, returned, outstanding, resolved };
}

export function getAvailableJerseys(jerseys: Jersey[]) {
  return jerseys.filter((jersey) => jersey.status === "available");
}

export function getJerseyLabel(jersey: Jersey) {
  return `#${String(jersey.number).padStart(2, "0")}`;
}
