const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const todoList = document.querySelector("#todo-list");
const taskCounter = document.querySelector("#task-counter");
const emptyState = document.querySelector("#empty-state");

if (!todoForm || !taskInput || !todoList || !taskCounter || !emptyState) {
  throw new Error("No se encontraron elementos requeridos de la app TODO.");
}

const tasks = [];

const renderTasks = () => {
  todoList.innerHTML = "";

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

    const label = document.createElement("span");
    label.className = "flex-grow-1";
    label.textContent = task;

    const actions = document.createElement("div");
    actions.className = "d-flex align-items-center gap-2";

    const number = document.createElement("span");
    number.className = "badge text-bg-light border";
    number.textContent = `#${index + 1}`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-sm btn-outline-primary";
    editButton.dataset.action = "edit";
    editButton.dataset.index = String(index);
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm btn-outline-danger";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.index = String(index);
    deleteButton.textContent = "Delete";

    actions.append(number, editButton, deleteButton);

    item.append(label, actions);
    todoList.appendChild(item);
  });

  const totalTasks = tasks.length;
  taskCounter.textContent = `${totalTasks} tasks`;
  emptyState.classList.toggle("d-none", totalTasks > 0);
};

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  tasks.push(taskInput.value.trim());
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

todoList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  const index = Number(target.dataset.index);

  if (!Number.isInteger(index) || index < 0 || index >= tasks.length) {
    throw new Error("Indice de tarea invalido.");
  }

  if (action === "delete") {
    tasks.splice(index, 1);
    renderTasks();
    return;
  }

  if (action === "edit") {
    const updatedTask = window.prompt("Update task", tasks[index]);

    if (updatedTask === null) {
      return;
    }

    tasks[index] = updatedTask.trim();
    renderTasks();
  }
});

renderTasks();
