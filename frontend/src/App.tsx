import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">To-Do</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-5">Add a New Task</h2>
            <TaskForm />
          </div>

          <div className="bg-blue-50 p-6 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
