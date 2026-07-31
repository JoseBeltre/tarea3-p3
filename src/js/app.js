const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const searchInput = document.querySelector("#search-input");
const todoList = document.querySelector("#todo-list");
const taskCounter = document.querySelector("#task-counter");
const emptyState = document.querySelector("#empty-state");
const TASKS_STORAGE_KEY = "todo-app-tasks";

if (!todoForm || !taskInput || !searchInput || !todoList || !taskCounter || !emptyState) {
  throw new Error("No se encontraron elementos requeridos de la app TODO.");
}

const loadTasks = () => {
  const rawTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

  if (rawTasks === null) {
    return [];
  }

  let parsedTasks;
  try {
    parsedTasks = JSON.parse(rawTasks);
  } catch (error) {
    throw new Error(`No se pudieron leer las tareas guardadas en localStorage: ${error}`);
  }

  if (!Array.isArray(parsedTasks) || parsedTasks.some((task) => typeof task !== "string")) {
    throw new Error("El formato de tareas guardadas en localStorage es invalido.");
  }

  return parsedTasks;
};

const saveTasks = (tasksToSave) => {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
};

const formatTaskCounter = (visibleTasks, totalTasks, isSearching) => {
  if (!isSearching) {
    return `${totalTasks} ${totalTasks === 1 ? "tarea" : "tareas"}`;
  }

  return `${visibleTasks}/${totalTasks} ${totalTasks === 1 ? "tarea" : "tareas"}`;
};

const tasks = loadTasks();
let searchTerm = "";

const showTaskValidationError = () => {
  taskInput.classList.add("is-invalid");
};

const clearTaskValidationError = () => {
  taskInput.classList.remove("is-invalid");
};

const renderTasks = () => {
  todoList.innerHTML = "";

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTasks = tasks
    .map((task, index) => ({ task, index }))
    .filter((taskItem) => taskItem.task.toLowerCase().includes(normalizedSearchTerm));

  filteredTasks.forEach((taskItem, visibleIndex) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

    const label = document.createElement("span");
    label.className = "flex-grow-1";
    label.textContent = taskItem.task;

    const actions = document.createElement("div");
    actions.className = "d-flex align-items-center gap-2";

    const number = document.createElement("span");
    number.className = "badge text-bg-light border";
    number.textContent = `#${visibleIndex + 1}`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-sm btn-outline-primary";
    editButton.dataset.action = "edit";
    editButton.dataset.index = String(taskItem.index);
    editButton.textContent = "Editar";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm btn-outline-danger";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.index = String(taskItem.index);
    deleteButton.textContent = "Eliminar";

    actions.append(number, editButton, deleteButton);

    item.append(label, actions);
    todoList.appendChild(item);
  });

  const totalTasks = tasks.length;
  const visibleTasks = filteredTasks.length;
  taskCounter.textContent = formatTaskCounter(visibleTasks, totalTasks, normalizedSearchTerm !== "");

  if (totalTasks === 0) {
    emptyState.textContent = "Aún no hay tareas. Agrega la primera.";
    emptyState.classList.remove("d-none");
    return;
  }

  if (visibleTasks === 0) {
    emptyState.textContent = "No hay tareas que coincidan con tu búsqueda.";
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");
};

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTask = taskInput.value.trim();

  if (newTask === "") {
    showTaskValidationError();
    taskInput.focus();
    return;
  }

  clearTaskValidationError();
  tasks.push(newTask);
  saveTasks(tasks);
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

taskInput.addEventListener("input", () => {
  if (taskInput.classList.contains("is-invalid")) {
    clearTaskValidationError();
  }
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
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
    saveTasks(tasks);
    renderTasks();
    return;
  }

  if (action === "edit") {
    const updatedTask = window.prompt("Editar tarea", tasks[index]);

    if (updatedTask === null) {
      return;
    }

    const normalizedTask = updatedTask.trim();

    if (normalizedTask === "") {
      window.alert("La tarea no puede estar vacía.");
      return;
    }

    tasks[index] = normalizedTask;
    saveTasks(tasks);
    renderTasks();
  }
});

renderTasks();
