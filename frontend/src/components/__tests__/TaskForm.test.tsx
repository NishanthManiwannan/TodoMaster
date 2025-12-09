import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "../TaskForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../api/api";

vi.mock("../../api/api", () => ({
  api: {
    post: vi.fn(() =>
      Promise.resolve({ data: { id: "1", title: "Test Task" } })
    ),
  },
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("TaskForm", () => {
  it("renders inputs and button", () => {
    renderWithClient(<TaskForm />);
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Description (optional)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("shows error if title is empty", async () => {
    renderWithClient(<TaskForm />);
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });

  it("calls API when submitting valid task", async () => {
    renderWithClient(<TaskForm />);
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "My Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description (optional)"), {
      target: { value: "Desc" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/tasks", {
        title: "My Task",
        description: "Desc",
      });
    });
  });
});
