import { pool } from "../../db";
import { createTaskBody } from "../../schema/createTodoTask";
import { TaskService } from "../../services/taskService";
import router from "../tasks";

jest.mock("../../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));
jest.mock("../../schema/createTodoTask", () => ({
  createTaskBody: {
    safeParse: jest.fn(),
  },
}));

describe("TaskService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createTask should create task and return created row", async () => {
    const mockTask = {
      id: "1",
      title: "Test Task",
      description: "Desc",
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

    const result = await TaskService.createTask("Test Task", "Desc");
    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *`,
      ["Test Task", "Desc"]
    );
    expect(result).toEqual(mockTask);
  });

  it("should return 400 when validation fails", async () => {
    const mockedSafeParse = createTaskBody.safeParse as jest.Mock;
    mockedSafeParse.mockReturnValue({
      success: false,
      error: {
        issues: [{ path: ["title"], message: "Required" }],
      },
    });

    const req = {
      body: { description: "no title" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const routeHandler = (
      router.stack.find(
        (r: any) => r.route?.path === "/" && r.route?.methods.post
      ) as any
    ).route.stack[0].handle;

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: [{ path: ["title"], message: "Required" }],
    });
  });

  test("getRecentTasks should return latest uncompleted tasks", async () => {
    const mockTasks = [{ id: "1", title: "Task", created_at: "2025" }];
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockTasks });

    const result = await TaskService.getRecentTasks();

    expect(pool.query).toHaveBeenCalled();
    expect(result).toEqual(mockTasks);
  });

  test("markComplete should update the task and return it", async () => {
    const mockTask = { id: "1", title: "Done", is_completed: true };
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [mockTask],
    });

    const result = await TaskService.markComplete("1");

    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE task SET is_completed = true WHERE id = $1 RETURNING *`,
      ["1"]
    );
    expect(result).toEqual(mockTask);
  });

  it("returns 404 when task is not found", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    const req = { params: { id: "2" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const routeHandler = (
      router.stack.find(
        (r: any) => r.route?.path === "/:id/complete" && r.route?.methods.patch
      ) as any
    ).route.stack[0].handle;

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });

  it("returns 404 when task is not found", async () => {
    (pool.query as jest.Mock).mockRejectedValue

    const req = { params: { id: "2" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const routeHandler = (
      router.stack.find(
        (r: any) => r.route?.path === "/:id/complete" && r.route?.methods.patch
      ) as any
    ).route.stack[0].handle;

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to complete task" });
  });

  test("markComplete returns null when no task found", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    const result = await TaskService.markComplete("123");
    expect(result).toBeNull();
  });
});
