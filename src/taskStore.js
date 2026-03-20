class TaskStore {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  list() {
    return this.items;
  }

  create(input) {
    const task = {
      id: this.nextId++,
      title: input.title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.items.push(task);
    return task;
  }

  markComplete(id) {
    const task = this.items.find((item) => item.id === id);
    if (!task) {
      return null;
    }

    task.completed = true;
    return task;
  }
}

module.exports = { TaskStore };
