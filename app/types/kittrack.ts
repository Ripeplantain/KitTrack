export type MemberType = "player" | "coach";
export type MemberStatus = "active" | "inactive";
export type JerseyStatus = "available" | "reserved" | "issued" | "unavailable";
export type IssuanceStatus =
  "assigned" | "issued" | "returned" | "lost" | "damaged";
export type GameStatus =
  "scheduled" | "in_progress" | "awaiting_reconciliation" | "closed";

export interface TeamMember {
  id: string;
  name: string;
  type: MemberType;
  role: string;
  position?: string;
  preferredNumber?: number;
  status: MemberStatus;
}

export interface Jersey {
  id: string;
  number: number;
  kitColour: string;
  size?: string;
  status: JerseyStatus;
  condition?: string;
}

export interface Game {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  kitColour: string;
  status: GameStatus;
  participantIds: string[];
}

export interface JerseyIssuance {
  id: string;
  gameId: string;
  memberId: string;
  jerseyId: string;
  status: IssuanceStatus;
  assignedAt: string;
  issuedAt?: string;
  returnedAt?: string;
  note?: string;
}

export interface KitTrackState {
  teamName: string;
  members: TeamMember[];
  jerseys: Jersey[];
  games: Game[];
  issuances: JerseyIssuance[];
}
