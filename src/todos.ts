import { ulid } from 'ulid';

export type Filter = 'all' | 'active' | 'completed';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export class Todos {
  private todos: Todo[] = [
    {
      id: ulid(),
      text: 'Learn HTMX',
      completed: false,
    },
    {
      id: ulid(),
      text: 'Learn Neovim',
      completed: true,
    },
  ];

  list(filter: Filter) {
    switch (filter) {
      case 'all':
        return this.todos;
      case 'active':
        return this.todos.filter(({ completed }) => !completed);
      case 'completed':
        return this.todos.filter(({ completed }) => completed);
    }
  }

  get remaining() {
    return this.todos.filter(({ completed }) => !completed).length;
  }

  create(text: string) {
    const newTodo = {
      id: ulid(),
      text,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update({
    id,
    text,
    completed,
  }: {
    id: string;
    text?: string;
    completed?: boolean;
  }) {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return null;
    }

    if (text) {
      this.todos[index].text = text;
    }

    if (completed !== undefined) {
      this.todos[index].completed = completed;
    }

    return this.todos[index];
  }

  toggleSingle(id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return null;
    }

    this.todos[index].completed = !this.todos[index].completed;
    return this.todos[index];
  }

  toggleAll() {
    this.todos = this.todos.map(({ completed, ...rest }) => ({
      ...rest,
      completed: !completed,
    }));

    return this.todos;
  }

  deleteSingle(id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    return true;
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    return this.todos;
  }
}
