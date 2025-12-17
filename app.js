console.log("Task Manager loaded");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

console.log(taskForm ,taskInput ,taskList);
taskForm.addEventListener("submit", function(event){
    event.preventDefault();
    const taskText = taskInput.value;
    console.log(taskText);
});