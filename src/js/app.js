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
    item.className = "list-group-item d-flex justify-content-between align-items-center";

    const label = document.createElement("span");
    label.textContent = task;

    const number = document.createElement("span");
    number.className = "badge text-bg-light border";
    number.textContent = `#${index + 1}`;

    item.append(label, number);
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

renderTasks();
