import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { jsxRenderer } from 'hono/jsx-renderer';
import { clsx } from 'clsx';
import { Layout, RemainingTodoCount, TodoList } from './components';
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
    <div>
      <section class="todoapp">
        <header class="header">
          <h1>todos + HTMX</h1>
          <input
            class="new-todo"
            name="text"
            placeholder="What needs to be done?"
            autofocus
          />
        </header>

        <section class="main">
          <TodoList todos={data} />
        </section>

        <footer class="footer">
          <span id="todo-count" class="todo-count">
            <RemainingTodoCount count={todos.remaining} />
          </span>
          <ul class="filters">
            <li>
              <a href="/" class={clsx({ selected: filter === 'all' })}>
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
          <button class="clear-completed">Clear completed</button>
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
    </div>,
  );
});

export default app;
