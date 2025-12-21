 console.log("Task Manager loaded");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let currentFilter = "all";
let tasks = loadTasks();   // ✅ MUST BE HERE
let clickTimer = null;
let draggedTaskId = null;
localStorage.clear();
 
//===================================================
//Form Submit || add New task
//===================================================
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();  // prevent page reload

    const taskText = taskInput.value.trim(); // get input text
    if (taskText === "") return; // ingore empty input


    // push new tak object into tasks array
    tasks.push({
        id: Date.now(),  // unique id
        text: taskText,  // task text
        completed: false  // default state
    });

    saveTasks(tasks);  // savee to localstorage
    renderTasks();     // re-render UI
    taskInput.value = "";  // clear input feild
});


//=======================================================
//single click handle (toggle/ delete)
//=========================================================
  taskList.addEventListener("click", function (event) {
    if (!event.target.classList.contains("task-text")&&
       !event.target.classList.contains("delete-btn")) return;

    const id = Number(event.target.dataset.id); // get clicked task ID

    //DELETE - logic
    // run immediatly when crossed is clicked


      if (event.target.classList.contains("delete-btn")){  
        const li = event.target.closest("li");
        li.classList.add("removing");

        setTimeout(() =>{
            tasks = tasks.filter(task => task.id !== id);
            saveTasks (tasks);
            renderTasks();
        }, 200);
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

  //===========================================
  //Save task to local storage
  //=========================================
 function saveTasks(tasks){
    localStorage.setItem("tasks",JSON.stringify(tasks));
 }

 //===================================
 // load tasks from local storage
 //=========================================

function loadTasks(){
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) :[];
}



//==========================================================
//Double click -- edit task
//===================================================
  taskList.addEventListener("dblclick", function (event) {
     clearTimeout(clickTimer); // cancle single click

    if (!event.target.classList.contains("task-text")) return;

    const id = Number(event.target.dataset.id);
    const task = tasks.find(task => task.id === id);

//  create input field for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    event.target.replaceWith(input); // Replace span with input
    input.focus(); // auto focus


// save edit on enter key
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const newText = input.value.trim();
            if (newText !== "") task.text = newText;
            
            saveTasks(tasks);
            renderTasks();
        }
    });

    // save edit when input loses focus
    input.addEventListener("blur", function () {
        saveTasks(tasks);
        renderTasks();
    });
});

//================================================================
// drag start-- store dragged task
//===================================================================================
taskList.addEventListener("dragstart", function(event){
    draggedTaskId = event.target.dataset.id; // store dragged id
    event.target.classList.add("dragging"); // visual feedback
});


//====================================================
// drag end -- cleanup UI
//==================================================
taskList.addEventListener("dragend", function(event){
    event.target.classList.remove("dragging");
});

//==========================================================
// drag over -- reorder tasks
//====================================================
taskList.addEventListener("dragover", function(event){
    event.preventDefault();// allow drop

    const target = event.target.closest("li");
    if (!target|| target.dataset.id === draggedTaskId) return;

    // remove dragged task and insert at new position 
    const draggedIndex = taks.findIndex(t => t.id == draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id == target.dataset.id);


    const draggedTask = tasks.splice(draggedIndex, 1)[0];
    tasks.splice(targetIndex, 0, draggedTask);

    saveTasks(tasks);
    renderTasks();
});

//==================================================================================
// Render task List
//==========================================================
function renderTasks() {
    taskList.innerHTML = "";  // clear UI

    //apply filter (all/active/completed)
     const filteredTasks = tasks.filter(task =>{
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
     });

     // create task element
     filteredTasks.forEach (task =>{
        const li = document.createElement("li");
        li.draggable= true;
        li.dataset.id = task.id;

        li.innerHTML =`
        <span class="task-text ${task.completed ? "completed" :""}" data-id="${task.id}">
        ${task.text}
        </span>
        <button class="delete-btn" data-id="${task.id}">❌</button>
        `;

        taskList.appendChild(li);
     });
     //====== Stats UPDATE ===================
     const total = tasks.length;
     const completed = tasks.filter(t => t.completed).length;

     document.getElementById("taskCount").textContent =
     `${completed} / ${total} completed` ;

     const percent = total === 0 ? 0 : (completed/ total)* 100;
     document.getElementById("progressBar").style.width = percent + "%";
     
}
// initial render
renderTasks();

const themeToggle = document.getElementById("themeToggle");

// load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
}


themeToggle.addEventListener("click", () =>{
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
 