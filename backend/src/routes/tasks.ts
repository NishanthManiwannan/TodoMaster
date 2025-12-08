import { Router, Request, Response } from "express";
import { pool } from "../db";
import { createTaskBody } from "../schema/createTodoTask";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createTaskBody.parse(req.body);
    const { title, description } = parsed;
    const r = await pool.query(
      `INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    res.status(201).json(r.rows[0]);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT id, title, description, created_at
       FROM task
       WHERE is_completed = false
       ORDER BY created_at DESC
       LIMIT 5`
    );
    res.json(r.rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/complete", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const r = await pool.query(
      `UPDATE task SET is_completed = true WHERE id = $1 RETURNING *`,
      [id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json(r.rows[0]);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
