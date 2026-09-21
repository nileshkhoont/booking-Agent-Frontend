import { describe, expect, it } from "vitest";
import { computeSlotPreview } from "@/features/business-config/slot-preview";

describe("computeSlotPreview", () => {
  it("matches the reported morning window: 11:00-13:30, 20-min slots", () => {
    expect(computeSlotPreview("11:00", "13:30", 20)).toEqual([
      "11:00-11:20",
      "11:20-11:40",
      "11:40-12:00",
      "12:00-12:20",
      "12:20-12:40",
      "12:40-13:00",
      "13:00-13:20",
    ]);
  });

  it("matches the reported evening window: 17:00-18:30, 20-min slots", () => {
    expect(computeSlotPreview("17:00", "18:30", 20)).toEqual([
      "17:00-17:20",
      "17:20-17:40",
      "17:40-18:00",
      "18:00-18:20",
    ]);
  });

  it("returns an empty list for invalid or incomplete input", () => {
    expect(computeSlotPreview("", "18:30", 20)).toEqual([]);
    expect(computeSlotPreview("17:00", "", 20)).toEqual([]);
    expect(computeSlotPreview("17:00", "18:30", 0)).toEqual([]);
    expect(computeSlotPreview("18:30", "17:00", 20)).toEqual([]);
  });
});
