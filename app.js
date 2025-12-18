 
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
    li.textContent = taskText;
    li.addEventListener("click" , function(){
          li.remove();
    });
    taskList.appendChild(li);

      taskInput.value ="";
      console.log(taskText);
});
