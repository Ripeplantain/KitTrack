import { describe, expect, it } from "vitest";
import {
  getAvailableJerseys,
  getCollectionSummary,
  getJerseyLabel,
} from "../app/utils/jersey-accounting";

describe("jersey accounting", () => {
  it("counts physically issued jerseys and outstanding returns separately", () => {
    const summary = getCollectionSummary([
      {
        id: "1",
        gameId: "g",
        memberId: "m",
        jerseyId: "j",
        status: "issued",
        assignedAt: "",
      },
      {
        id: "2",
        gameId: "g",
        memberId: "m",
        jerseyId: "j",
        status: "returned",
        assignedAt: "",
      },
      {
        id: "3",
        gameId: "g",
        memberId: "m",
        jerseyId: "j",
        status: "lost",
        assignedAt: "",
      },
      {
        id: "4",
        gameId: "g",
        memberId: "m",
        jerseyId: "j",
        status: "assigned",
        assignedAt: "",
      },
    ]);

    expect(summary).toEqual({
      issued: 3,
      returned: 1,
      outstanding: 1,
      resolved: 2,
    });
  });

  it("only returns physically available jerseys for a future game", () => {
    expect(
      getAvailableJerseys([
        { id: "available", number: 7, kitColour: "Black", status: "available" },
        { id: "issued", number: 12, kitColour: "Black", status: "issued" },
        {
          id: "unavailable",
          number: 23,
          kitColour: "White",
          status: "unavailable",
        },
      ]).map((jersey) => jersey.id),
    ).toEqual(["available"]);
  });

  it("preserves the visible number formatting used in checklists", () => {
    expect(
      getJerseyLabel({
        id: "j",
        number: 4,
        kitColour: "Black",
        status: "available",
      }),
    ).toBe("#04");
  });
});
