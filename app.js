 console.log("Task Manager loaded");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let currentFilter = "all";
let tasks = loadTasks();   // ✅ MUST BE HERE
let clickTimer = null;
localStorage.clear();
 

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    saveTasks(tasks);
    renderTasks();
    taskInput.value = "";
});


  taskList.addEventListener("click", function (event) {
    if (!event.target.classList.contains("task-text")&&
       !event.target.classList.contains("delete-btn")) return;

    const id = Number(event.target.dataset.id);

    //DELETE - execute immediately


     if (event.target.classList.contains("delete-btn")){
        clearTimeout(clickTimer);
        tasks =tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        renderTasks();
        return;
     }
    // TOGGLE - delay to allow dblclick cancle
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() =>{
        const task =tasks.find(task=> task.id === id);
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    }, 250);

  });

 function saveTasks(tasks){
    localStorage.setItem("tasks",JSON.stringify(tasks));
 }

function loadTasks(){
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) :[];
}


  taskList.addEventListener("dblclick", function (event) {
     clearTimeout(clickTimer); // cancle single click

    if (!event.target.classList.contains("task-text")) return;

    const id = Number(event.target.dataset.id);
    const task = tasks.find(task => task.id === id);

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    event.target.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const newText = input.value.trim();
            if (newText !== "") task.text = newText;
            
            saveTasks(tasks);
            renderTasks();
        }
    });

    input.addEventListener("blur", function () {
        saveTasks(tasks);
        renderTasks();
    });
});



 

function renderTasks() {
    taskList.innerHTML = "";

     const filteredTasks = tasks.filter(task =>{
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
     });

     filteredTasks.forEach (task =>{
        const li = document.createElement("li");

        li.innerHTML =`
        <span class="task-text ${task.completed ? "completed" :""}" data-id="${task.id}">
        ${task.text}
        </span>
        <button class="delete-btn" data-id="${task.id}">❌</button>
        `;

        taskList.appendChild(li);
     });
}

renderTasks();

 