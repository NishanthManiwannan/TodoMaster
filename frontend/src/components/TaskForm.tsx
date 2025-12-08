import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/api";
import { z } from "zod";
import { taskSchema } from "../schema/createTaskSchema";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      api.post("/tasks", data),
    onSuccess: () => {
      setTitle("");
      setDesc("");
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = taskSchema.safeParse({
      title: title.trim(),
      description: desc.trim(),
    });

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors({
        title: tree.properties?.title?.errors?.[0],
        description: tree.properties?.description?.errors?.[0],
      });
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <div className="mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={`w-full border rounded px-3 py-2 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-3">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          className={`w-full border rounded px-3 py-2 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:opacity-90"
      >
        Add Task
      </button>
    </form>
  );
}
