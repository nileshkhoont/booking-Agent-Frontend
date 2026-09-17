import { describe, expect, it } from "vitest";
import { cn, istDateInputEndOfDayToUtcIso, istDateInputToUtcIso, istLocalInputToUtcIso } from "@/lib/utils";
import { parseTranscript } from "@/features/calls/types";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-medium")).toBe("text-sm font-medium");
  });
});

describe("parseTranscript", () => {
  it("returns an empty array for no transcript", () => {
    expect(parseTranscript(undefined)).toEqual([]);
    expect(parseTranscript(null)).toEqual([]);
    expect(parseTranscript("")).toEqual([]);
  });

  it("splits 'role: content' lines into turns", () => {
    const transcript = "agent: Hello!\nperson: Hi, I'd like to book an appointment.";
    expect(parseTranscript(transcript)).toEqual([
      { role: "agent", content: "Hello!" },
      { role: "person", content: "Hi, I'd like to book an appointment." },
    ]);
  });

  it("falls back to 'unknown' role for a line with no separator", () => {
    expect(parseTranscript("garbled line")).toEqual([{ role: "unknown", content: "garbled line" }]);
  });
});

describe("IST datetime conversion", () => {
  it("interprets a datetime-local value as IST (UTC+5:30), not the machine's local timezone", () => {
    // 10:00 IST is 04:30 UTC, regardless of what timezone this test runner's OS is set to.
    expect(istLocalInputToUtcIso("2026-09-20T10:00")).toBe("2026-09-20T04:30:00.000Z");
  });

  it("treats a date-only value as the start of that day in IST", () => {
    expect(istDateInputToUtcIso("2026-09-20")).toBe("2026-09-19T18:30:00.000Z");
  });

  it("treats a date-only 'to' filter as the end of that day in IST", () => {
    expect(istDateInputEndOfDayToUtcIso("2026-09-20")).toBe("2026-09-20T18:29:59.999Z");
  });
});
