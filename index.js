let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");





let todos = [];

const API_BASE_URL = `https://cors-anywhere.herokuapp.com/https://todos.edgehub.in`;
const TOKEN = `0da9cb45-4698-4fc5-8ae3-19af96476bde`;

function fetchTodos() {
  fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((todosResponse) => {
      todos = todosResponse;
      for (let todo of todoList) {
        createAndAppendTodo(todo);
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

function createTodos(todo) {
  fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(todo)
  })
    .catch((e) => {
      console.log(e);
      alert(e.message);
    });
}

function updateTodos(id, data) {
  fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .catch((e) => {
      console.log(e);
      alert(e.message);
    });
}

function deleteTodos(id) {
  fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
    .then((res) => {
      onDeleteTodo(id);
    })
    .catch((e) => {
      console.log(e);
      alert(e.message);
    });
}


function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {
    return [];
  } else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;

  let newTodo = {
    text: userInputValue,
    id: todosCount,
    isCompleted: false
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  createTodos(newTodo)
  userInputElement.value = "";
}

addTodoButton.onclick = function() {
  onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.id;

    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  let todoObject = todoList[todoObjectIndex];

  if(todoObject.isCompleted === true){
    todoObject.isCompleted = false;
  } else {
    todoObject.isCompleted = true;
  }
  updateTodos(todoObject.id, todoObject)

}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  let deleteElementIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.id;
    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  todoList.splice(deleteElementIndex, 1);
}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.id;
  let checkboxId = "checkbox" + todo.id;
  let labelId = "label" + todo.id;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isCompleted;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isCompleted === true) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);

  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  deleteIcon.onclick = function () {
    deleteTodos(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);
}

fetchTodos()
