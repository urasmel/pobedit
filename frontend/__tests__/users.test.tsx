import { Users } from "@/components/features/Users";
import { describe, expect, it, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";


describe("Users", () => {
    it('should render the button with "Reload" text', () => {
        const mockFn = vi.fn(() => 0);
        const { getByRole } = render(<Users setSelectedUser={mockFn} />);
        expect(
            getByRole('button', { name: "Reload" })
        ).toBeDefined();
    });

    it('should render the button with "add" text', () => {
        const mockFn = vi.fn(() => 0);
        const { getByRole } = render(<Users setSelectedUser={mockFn} />);
        expect(
            getByRole('button', { name: "Add" })
        ).toBeDefined();
    });
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});
