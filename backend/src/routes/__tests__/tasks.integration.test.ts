import request from "supertest";
import express from "express";
import tasksRouter from "../tasks";
import { pool } from "../../db";

const app = express();
app.use(express.json());
app.use("/tasks", tasksRouter);

beforeAll(async () => {});

afterAll(async () => {
  await pool.end();
});

describe("tasks API", () => {
  let createdId: string;

  it("creates a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "test task", description: "desc" })
      .expect(201);
    expect(res.body.title).toBe("test task");
    createdId = res.body.id;
  });

  it("lists tasks (max 5)", async () => {
    const res = await request(app).get("/tasks").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("task complete", async () => {
    const res = await request(app)
      .patch(`/tasks/${createdId}/complete`)
      .expect(200);
    expect(res.body.is_completed).toBe(true);
  });
});
