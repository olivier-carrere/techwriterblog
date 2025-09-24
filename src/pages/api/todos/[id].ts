import type { APIRoute } from "astro";

let todos: { id: number; task: string; done: boolean }[] = [];

// GET /api/todos/:id → fetch single todo
export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(todo), { status: 200 });
};

// PUT /api/todos/:id → update todo
export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  const body = await request.json();
  todos[index] = { ...todos[index], ...body };

  return new Response(JSON.stringify(todos[index]), { status: 200 });
};

// DELETE /api/todos/:id → delete todo
export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  const deleted = todos.splice(index, 1)[0];
  return new Response(JSON.stringify(deleted), { status: 200 });
};
