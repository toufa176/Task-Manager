 
console.log("Task Manager loaded");


const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
let currentFilter = "all";

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if(taskText === ""){
        return;
    }
    tasks.push({
        text: taskText,
        completed: false
    });
    saveTasks(tasks);
    renderTasks();
    
    taskInput.value = "";
});

document.querySelector(".filters").addEventListener("click", function (event){
    if(event.target.tagName === "BUTTON"){
        currentFilter = event.target.dataset.filter;
        renderTasks();
    }
});

  taskList.addEventListener("click", function(event){
    if (event.target.classList.contains("delete-btn")){
        const index = event.target.dataset.index;
        tasks.splice(index,1);
    }

    if (event.target.classList.contains("task-text")){
        const index = event.target.nextElementSibling.dataset.index;
        tasks[index].completed = !tasks[index].completed;
    }

    saveTasks(tasks);
    renderTasks();
  })

 function saveTasks(tasks){
    localStorage.setItem("tasks",JSON.stringify(tasks));
 }

function loadTasks(){
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) :[];
}

let tasks = loadTasks();

function renderTasks() {
    taskList.innerHTML = "";

     const filteredTasks = tasks.filter(task =>{
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
     });

     filteredTasks.forEach ((task, index) =>{
        const li = document.createElement("li");

        li.innerHTML =`
        <span class="task-text ${task.completed ? "completed" :""}">
        ${task.text}
        </span>
        <button class="delete-btn" data-index="${index}">❌</button>
        `;

        taskList.appendChild(li);
     });
}

renderTasks();

 