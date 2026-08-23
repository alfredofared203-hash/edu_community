import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── 1. grades utility ──────────────────────────────────────────────────────
import { GRADES, SUBJECTS, gradeLabel, MATERIAL_TYPES } from "../lib/grades";

describe("grades.js", () => {
  it("exports GRADES array with 12 items", () => {
    expect(GRADES).toHaveLength(12);
  });

  it("gradeLabel returns correct Arabic label", () => {
    expect(gradeLabel("sec-1")).toBe("الأول الثانوي");
    expect(gradeLabel("primary-1")).toBe("الأول الابتدائي");
  });

  it("gradeLabel falls back to value when not found", () => {
    expect(gradeLabel("unknown")).toBe("unknown");
  });

  it("SUBJECTS is a non-empty array of strings", () => {
    expect(Array.isArray(SUBJECTS)).toBe(true);
    expect(SUBJECTS.length).toBeGreaterThan(0);
    expect(typeof SUBJECTS[0]).toBe("string");
  });

  it("MATERIAL_TYPES has pdf, video, graphic", () => {
    const values = MATERIAL_TYPES.map((t) => t.value);
    expect(values).toContain("pdf");
    expect(values).toContain("video");
    expect(values).toContain("graphic");
  });
});

// ── 2. api unwrap helper ───────────────────────────────────────────────────
describe("api response unwrap (u function)", () => {
  const u = (res) => res?.data ?? res;

  it("extracts data when present", () => {
    expect(u({ success: true, data: { rewards: [] } })).toEqual({ rewards: [] });
  });

  it("returns res itself when no data key", () => {
    expect(u({ rewards: [] })).toEqual({ rewards: [] });
  });

  it("handles null/undefined gracefully", () => {
    expect(u(null)).toBeNull();
    expect(u(undefined)).toBeUndefined();
  });
});

// ── 3. RoleHome redirect logic ─────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../context/AuthContext";
import RoleHome from "../components/RoleHome";

describe("RoleHome", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("redirects student to /dashboard/student", () => {
    useAuth.mockReturnValue({ user: { role: "student" }, loading: false });
    render(<MemoryRouter><RoleHome /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/student");
  });

  it("redirects teacher to /dashboard/teacher", () => {
    useAuth.mockReturnValue({ user: { role: "teacher" }, loading: false });
    render(<MemoryRouter><RoleHome /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/teacher");
  });

  it("redirects admin to /dashboard/admin", () => {
    useAuth.mockReturnValue({ user: { role: "admin" }, loading: false });
    render(<MemoryRouter><RoleHome /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/admin");
  });

  it("redirects unauthenticated user to /auth", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(<MemoryRouter><RoleHome /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });

  it("shows spinner while loading", () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    const { container } = render(<MemoryRouter><RoleHome /></MemoryRouter>);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
