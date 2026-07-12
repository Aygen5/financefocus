import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import SummaryCards from "../features/dashboard/components/SummaryCards";

describe("Dashboard SummaryCards Render Tests", () => {
  it("renders financial summary metrics correctly", () => {
    renderWithProviders(
      <SummaryCards
        netWorth={150000}
        income={45000}
        expenses={25000}
        savings={20000}
        loading={false}
      />,
    );

    expect(screen.getByText("Net Varlık")).toBeInTheDocument();
    expect(screen.getByText("Aylık Gelir")).toBeInTheDocument();
    expect(screen.getByText("Aylık Giderler")).toBeInTheDocument();

    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
    expect(screen.getByText(/45\.000/)).toBeInTheDocument();
    expect(screen.getByText(/25\.000/)).toBeInTheDocument();
  });

  it("renders loading skeletons when loading prop is true", () => {
    const { container } = renderWithProviders(
      <SummaryCards netWorth={0} income={0} expenses={0} savings={0} loading={true} />,
    );
    expect(container.getElementsByClassName("animate-pulse").length).toBeGreaterThan(0);
  });
});
