var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

    // add item info to the task-item div
    listItemEl.appendChild(taskInfoEl);
    // add above to the ul, tasks-to-do
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);

