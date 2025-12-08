import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { Task } from "../types/type";

const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get("/tasks");
  return data;
};

export default function TaskList() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
  });

  const markDone = useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data.length) return <div className="text-gray-600">No open tasks</div>;

  return (
    <div className="grid gap-3">
      {data.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded shadow flex justify-between items-start"
        >
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            <small className="text-xs text-gray-400">
              {new Date(task.created_at).toLocaleString()}
            </small>
          </div>
          <div>
            <button
              onClick={() => markDone.mutate(task.id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Done
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
