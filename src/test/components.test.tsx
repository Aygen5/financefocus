import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DataTable from "../components/data-display/DataTable";

describe("Core UI Components Unit Tests", () => {
  describe("Button Component", () => {
    it("renders children correctly", () => {
      render(<Button>Giriş Yap</Button>);
      expect(screen.getByRole("button", { name: /Giriş Yap/i })).toBeInTheDocument();
    });

    it("triggers onClick callback when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Tıkla</Button>);
      fireEvent.click(screen.getByRole("button", { name: /Tıkla/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Engelli</Button>);
      expect(screen.getByRole("button", { name: /Engelli/i })).toBeDisabled();
    });
  });

  describe("Card Component", () => {
    it("renders card content and classes correctly", () => {
      const { container } = render(<Card className="test-card-class">Kart İçeriği</Card>);
      expect(screen.getByText("Kart İçeriği")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("test-card-class");
    });
  });

  describe("Input Component", () => {
    it("renders label and inputs values correctly", () => {
      const handleChange = vi.fn();
      render(<Input label="E-Posta" placeholder="E-posta yazın" onChange={handleChange} />);

      expect(screen.getByText("E-Posta")).toBeInTheDocument();
      const input = screen.getByPlaceholderText("E-posta yazın") as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "test@financefocus.com" } });
      expect(handleChange).toHaveBeenCalled();
    });

    it("displays error message when error prop is provided", () => {
      render(<Input error="Geçersiz e-posta" />);
      expect(screen.getByText("Geçersiz e-posta")).toBeInTheDocument();
    });
  });

  describe("Modal Component", () => {
    it("should not render when isOpen is false", () => {
      const { container } = render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          İçerik
        </Modal>,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should render title and children when isOpen is true", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Detay İçeriği</p>
        </Modal>,
      );
      expect(screen.getByText("Test Modal")).toBeInTheDocument();
      expect(screen.getByText("Detay İçeriği")).toBeInTheDocument();
    });
  });

  describe("DataTable (Table) Component", () => {
    const columns = [
      { key: "name", header: "İsim" },
      { key: "role", header: "Rol" },
    ];
    const data = [
      { id: "1", name: "Aygen", role: "Yönetici" },
      { id: "2", name: "Can", role: "Kullanıcı" },
    ];

    it("renders headers and table cell data correctly", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getAllByText("İsim")[0]).toBeInTheDocument();
      expect(screen.getByText("Aygen")).toBeInTheDocument();
      expect(screen.getByText("Kullanıcı")).toBeInTheDocument();
    });
  });
});
