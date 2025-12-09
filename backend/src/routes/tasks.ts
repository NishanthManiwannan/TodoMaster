import { Router, Request, Response } from "express";
import { createTaskBody } from "../schema/createTodoTask";
import { TaskService } from "../services/taskService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const parsed = createTaskBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues });
  }

  const { title, description } = parsed.data;
  try {
    const task = await TaskService.createTask(title, description);
    return res.status(201).json(task);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create task" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getRecentTasks();
    return res.json(tasks);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.patch("/:id/complete", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await TaskService.markComplete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to complete task" });
  }
});

export default router;
