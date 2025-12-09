import { pool } from "../db";

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
}

export class TaskService {
  static async createTask(title: string, description?: string): Promise<Task> {
    const res = await pool.query(
      `INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    return res.rows[0];
  }

  static async getRecentTasks(): Promise<Task[]> {
    const res = await pool.query(
      `SELECT id, title, description, created_at
       FROM task
       WHERE is_completed = false
       ORDER BY created_at DESC
       LIMIT 5`
    );
    return res.rows;
  }

  static async markComplete(id: string): Promise<Task | null> {
    const res = await pool.query(
      `UPDATE task SET is_completed = true WHERE id = $1 RETURNING *`,
      [id]
    );
    return res.rowCount ? res.rows[0] : null;
  }
}
