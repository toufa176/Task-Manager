 
console.log("Task Manager loaded");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if(taskText === ""){
        return;
    }
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">❌</button>
        `;
    
    taskList.appendChild(li);

      taskInput.value ="";
});

 taskList.addEventListener("click", function(event){
    if (event.target.cllassList.contains("delete-btn")){
        event.target.parentElement.remove();
        return;
    }
 });