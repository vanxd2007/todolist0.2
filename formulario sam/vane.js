document.addEventListener("DOMContentLoaded", loadTasks);

const subjectInput = document.getElementById('subject');
const taskInput = document.getElementById('n');
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addBtnClickHandler();
});

function addBtnClickHandler() {
  const subject = subjectInput.value.trim();
  const task = taskInput.value.trim();

  if (subject !== "" && task !== "") {
    const fullText = `${subject}: ${task}`;

    if (taskExists(fullText)) {
      alert("La tarea ya existe.");
      return;
    }

    const date = new Date().toLocaleDateString();
    addTaskToDOM(fullText, date);
    saveTaskToLocalStorage(fullText, date);

    subjectInput.value = "";
    taskInput.value = "";
    empty.classList.add("hidden");
  }
}

function addTaskToDOM(text, date) {
  const li = document.createElement("li");
  li.innerHTML = `
    <p>${text}</p>
    <span class="task-date"> (${date})</span>
  `;
  li.appendChild(createEditBtn());
  li.appendChild(createDeleteBtn());
  ul.appendChild(li);
}

function createButton(text, className, eventHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", eventHandler);
  return button;
}

function createEditBtn() {
  return createButton("Editar", "btn-edit", (e) => {
    const item = e.target.parentElement;
    const p = item.querySelector("p");

    if (item.querySelector(".edit-input")) {
      return;
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = p.textContent;

    const saveBtn = createButton("Guardar", "btn-save", () => {
      saveTask(editInput, p, item);
    });

    // Evento de "Enter" para guardar
    editInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        saveTask(editInput, p, item);
      }
    });

    p.style.display = "none";
    item.appendChild(editInput);
    item.appendChild(saveBtn);

    editInput.focus();
  });
}

function saveTask(editInput, p, item) {
  const newText = editInput.value.trim();

  if (newText === "") {
    alert("Por favor ingresa un texto válido.");
    return;
  }

  const oldText = p.textContent;
  p.textContent = newText;
  updateTaskInLocalStorage(oldText, newText);

  item.removeChild(editInput);
  item.removeChild(item.querySelector(".btn-save"));
  p.style.display = "";
}

function createDeleteBtn() {
  return createButton("X", "btn-delete", (e) => {
    const item = e.target.parentElement;
    const text = item.querySelector("p").textContent;

    deleteTaskFromLocalStorage(text);
    ul.removeChild(item);

    if (ul.children.length === 0) {
      empty.classList.remove("hidden");
    }
  });
}

function safeParseJSON(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveTaskToLocalStorage(text, date) {
  try {
    let tasks = safeParseJSON(localStorage.getItem("tasks"));
    tasks.push({ text, date });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error al guardar tareas en localStorage:", e);
  }
}

function updateTaskInLocalStorage(oldText, newText) {
  try {
    let tasks = safeParseJSON(localStorage.getItem("tasks"));
    tasks = tasks.map(task => task.text === oldText ? { ...task, text: newText } : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error al actualizar tarea en localStorage:", e);
  }
}

function deleteTaskFromLocalStorage(text) {
  try {
    let tasks = safeParseJSON(localStorage.getItem("tasks"));
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error al eliminar tarea de localStorage:", e);
  }
}

function loadTasks() {
  try {
    let tasks = safeParseJSON(localStorage.getItem("tasks"));
    tasks.forEach(task => addTaskToDOM(task.text, task.date));

    if (tasks.length === 0) {
      empty.classList.remove("hidden");
    } else {
      empty.classList.add("hidden");
    }
  } catch (e) {
    console.error("Error al cargar tareas:", e);
  }
}

function taskExists(text) {
  try {
    let tasks = safeParseJSON(localStorage.getItem("tasks"));
    return tasks.some(task => task.text === text);
  } catch (e) {
    console.error("Error al comprobar si la tarea existe:", e);
    return false;
  }
}
