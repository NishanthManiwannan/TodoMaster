import { TaskService } from "../taskService";
import { pool } from "../../db";

jest.mock("../../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("TaskService Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTask should insert task correctly", async () => {
    const mockTask = {
      id: "123",
      title: "New Task",
      description: "Test desc",
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    const result = await TaskService.createTask("New Task", "Test desc");

    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *`,
      ["New Task", "Test desc"]
    );
    expect(result).toEqual(mockTask);
  });

  test("getRecentTasks should fetch only incomplete tasks", async () => {
    const mockTasks = [{ id: "1", title: "A" }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockTasks });

    const result = await TaskService.getRecentTasks();

    expect(pool.query).toHaveBeenCalledWith(
      `SELECT id, title, description, created_at
       FROM task
       WHERE is_completed = false
       ORDER BY created_at DESC
       LIMIT 5`
    );
    expect(result).toEqual(mockTasks);
  });

  test("markComplete returns updated task when exists", async () => {
    const updated = { id: "123", is_completed: true };
    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [updated],
    });

    const result = await TaskService.markComplete("123");

    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE task SET is_completed = true WHERE id = $1 RETURNING *`,
      ["123"]
    );
    expect(result).toEqual(updated);
  });

  test("markComplete returns null when no task updated", async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0, rows: [] });

    const result = await TaskService.markComplete("missing");

    expect(result).toBeNull();
  });
});
