import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { jsxRenderer } from 'hono/jsx-renderer';
import { clsx } from 'clsx';
import { Layout, RemainingTodoCount, TodoItem, TodoList } from './components';
import { Filter, Todos } from './todos';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));
app.use(
  '*',
  jsxRenderer(({ children }) => <Layout>{children}</Layout>, { docType: true }),
);

const todos = new Todos();

app.get('/', (c) => {
  const { filter = 'all' } = c.req.query();

  const data = todos.list(filter as Filter);

  return c.render(
    <>
      <section class="todoapp">
        <header class="header">
          <h1>todos + HTMX</h1>
          <input
            class="new-todo"
            name="text"
            placeholder="What needs to be done?"
            autofocus
            hx-post="/todo"
            hx-trigger="keyup[keyCode==13]"
            hx-target=".todo-list"
            hx-swap="beforeend"
            _="on htmx:afterOnLoad set target.value to ''"
          />
        </header>

        <section class="main">
          <TodoList todos={data} />
        </section>

        <footer class="footer">
          <RemainingTodoCount count={todos.remaining} />
          <ul class="filters" hx-boost="true">
            <li>
              <a
                href="/?filter=all"
                class={clsx({ selected: filter === 'all' })}
              >
                All
              </a>
            </li>
            <li>
              <a
                href="/?filter=active"
                class={clsx({ selected: filter === 'active' })}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="/?filter=completed"
                class={clsx({ selected: filter === 'completed' })}
              >
                Completed
              </a>
            </li>
          </ul>
          <button
            class="clear-completed"
            hx-put="/clear-completed"
            hx-target=".main"
            hx-swap="innerHTML"
          >
            Clear completed
          </button>
        </footer>
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="http://github.com/ryands17/">ryandsouza</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>,
  );
});

app.post('/todo/toggle/:id', async (c) => {
  const { id } = c.req.param();
  const todo = todos.toggleSingle(id);

  if (todo) {
    return c.html(
      <>
        <TodoItem todo={todo} />
        <RemainingTodoCount count={todos.remaining} oob />
      </>,
    );
  }
});

app.post('/todo', async (c) => {
  const body = await c.req.parseBody();
  const newTodo = todos.create(body['text'] as string);

  return c.html(
    <>
      <TodoItem todo={newTodo} />
      <RemainingTodoCount count={todos.remaining} oob />
    </>,
  );
});

app.put('/todo/toggle', (c) => {
  const toggledTodos = todos.toggleAll();

  return c.html(
    <>
      <TodoList todos={toggledTodos} />
      <RemainingTodoCount count={todos.remaining} oob />
    </>,
  );
});

app.put('/todo/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.parseBody();
  const updatedTodo = todos.update({ id, text: body['todoText'] as string });

  if (!updatedTodo) {
    return c.html('', 500);
  }

  return c.html(<TodoItem todo={updatedTodo} />);
});

app.delete('/todo/:id', (c) => {
  const { id } = c.req.param();
  const todo = todos.deleteSingle(id);

  if (!todo) {
    return c.html('', 204);
  }

  return c.html(<RemainingTodoCount count={todos.remaining} oob />, 200);
});

app.put('/clear-completed', (c) => {
  const remainingTodos = todos.clearCompleted();

  return c.html(
    <>
      <TodoList todos={remainingTodos} />
      <RemainingTodoCount count={todos.remaining} oob />
    </>,
  );
});

export default app;
