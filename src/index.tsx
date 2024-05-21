import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from './components';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));
app.use(
  '*',
  jsxRenderer(({ children }) => <Layout>{children}</Layout>, { docType: true }),
);

app.get('/', (c) => {
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
        <footer class="footer">
          <span id="todo-count" class="todo-count" />
          <ul class="filters">
            <li>
              <a href="/" class="selected">
                All
              </a>
            </li>
            <li>
              <a
                href="/?filter=active"
                // class={clsx({ selected: filter === 'active' })}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="/?filter=completed"
                // class={clsx({ selected: filter === 'completed' })}
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
