import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskList from "../TaskList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../api/api";

vi.mock("../../api/api", () => ({
  api: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            id: "1",
            title: "Task 1",
            description: "Desc",
            created_at: new Date().toISOString(),
          },
        ],
      })
    ),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("TaskList", () => {
  it("renders tasks", async () => {
    renderWithClient(<TaskList />);
    expect(await screen.findByText("Task 1")).toBeInTheDocument();
  });

  it("calls API to mark task done", async () => {
    renderWithClient(<TaskList />);
    fireEvent.click(await screen.findByText("Done"));
    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/tasks/1/complete");
    });
  });
});
