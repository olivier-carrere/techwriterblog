import type { APIRoute } from "astro";

// In-memory store (resets on redeploy)
let todos = [
  { id: 1, task: "Learn Astro APIs", done: false },
  { id: 2, task: "Deploy to Vercel", done: false }
];

// GET /api/todos → list all todos
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(todos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/todos → create new todo
export const POST: APIRoute = async ({ request }) => {
  try {
    const { task } = await request.json();
    if (!task) {
      return new Response(JSON.stringify({ error: "Task is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const newTodo = {
      id: Date.now(),
      task,
      done: false,
    };
    todos.push(newTodo);

    return new Response(JSON.stringify(newTodo), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
