var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];


// ******* HANDLES THE INPUT AT THE TOP OF THE SCREEN *******
var taskFormHandler = function() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    // find out if this is an edit or new task
    var isEdit = formEl.hasAttribute("data-task-id");
    // if edit send it to the completeEditTask function
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // else send it to createtaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
            };

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }

};

// ******* CREATE NEW TASK  *******
var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // give it a class name
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // add item info to the task-item div
    listItemEl.appendChild(taskInfoEl);

    // run the function to create task actions (buttons)
    var taskActionsEl = createTaskActions(taskIdCounter);

    // add buttons created in above function to the li (list item).
    listItemEl.appendChild(taskActionsEl);

    // add the above list item to the ul (unordered list), "tasks-to-do"
    tasksToDoEl.appendChild(listItemEl);

    // update the array for local storage
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // save changes to local storage
    saveTasks();

    // increase task counter for next unique id
    taskIdCounter++;

};

// ******* CREATE TASK ITEM BUTTONS **************
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // create dropdown choices
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
 
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl
};


// ******* DID THE USER CLICK EDIT OR DELETE *******
var taskButtonHandler = function(event){
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};

// ******* DELETE THE SELECTED TASK *******
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    // save changes to local storage
    saveTasks();
};

// ******* BEGIN EDIT THE SELECTED TASK *******
var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};


// ******* FINISH EDITING THE SELECTED TASK *******
var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    alert ("Task Updated!");
    
    // loop through tasks array and task array object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
        }
    };

    // reset values
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    // save changes to local storage
    saveTasks();
};


// ******* HANDLE THE TASK DOWNDOWN LIST CHANGES *******
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array for local storage
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
        }
    }

    //save tasks to local storage
    saveTasks();
};


// SAVE TASKS TO LOCAL STORAGE
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};


// LOAD TASKS FROM LOCAL STORAGE
var loadTasks = function() {
    var loadedTasks = localStorage.getItem("tasks");
    // if there is nothing in local storage
    if (!loadedTasks) {
        return false;
    }
    
    // else load up saved tasks
    console.log("Stored tasks found");

    // parse into array of objects
    loadedTasks = JSON.parse(loadedTasks);

        // loop and pass each task object into the createTaskEl function
        for (i = 0; i < loadedTasks.length; i++) {

            console.log(loadedTasks[i].id);

            var listItemEl = document.createElement("li");
            listItemEl.className = "task-item";
            listItemEl.setAttribute("data-task-id", loadedTasks[i].id);

            var taskInfoEl = document.createElement("div");
            taskInfoEl.className = "task-info";
            taskInfoEl.innerHTML = "<h3 class='task-name'>" + loadedTasks[i].name + "</h3><span class='task-type'>" + loadedTasks[i].type + "</span>";
            listItemEl.appendChild(taskInfoEl);
            
            var actionContainerEl = document.createElement("div");
            actionContainerEl.className = "task-actions";

            // create edit button
            var editButtonEl = document.createElement("button");
            editButtonEl.textContent = "Edit";
            editButtonEl.className = "btn edit-btn";
            editButtonEl.setAttribute("data-task-id", loadedTasks[i].id);
            
            actionContainerEl.appendChild(editButtonEl);

            // create delete button
            var deleteButtonEl = document.createElement("button");
            deleteButtonEl.textContent = "Delete";
            deleteButtonEl.className = "btn delete-btn";
            deleteButtonEl.setAttribute("data-task-id", loadedTasks[i].id);

            actionContainerEl.appendChild(deleteButtonEl);

            // create dropdown
            var statusSelectEl = document.createElement("select");
            statusSelectEl.className = "select-status";
            statusSelectEl.setAttribute("name", "status-change");
            statusSelectEl.setAttribute("data-task-id", loadedTasks[i].id);

            actionContainerEl.appendChild(statusSelectEl);

            // create dropdown choices
            var statusChoices = ["To Do", "In Progress", "Completed"];
            for (var c = 0; c < statusChoices.length; c++) {
                var statusOptionEl = document.createElement("option");
                statusOptionEl.textContent = statusChoices[c];
                statusOptionEl.setAttribute("value", statusChoices[c]);
        
                statusSelectEl.appendChild(statusOptionEl);
                }

            listItemEl.appendChild(actionContainerEl);

                console.log(listItemEl);
                console.log(loadedTasks[i].status);

            switch(loadedTasks[i].status) {
                case "to do":
                    listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
                    tasksToDoEl.appendChild(listItemEl);
                    break
                case "in progress":
                    listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
                    tasksInProgressEl.appendChild(listItemEl);
                    break
                case "completed":
                    listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
                    tasksCompletedEl.appendChild(listItemEl);
                    break
            }

    };

};

// listener for the add task button
formEl.addEventListener("submit", taskFormHandler);

// event listener for the click on the main task section delete and edit buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// event listerer for the change on the dropdown list on the main task sectino
pageContentEl.addEventListener("change", taskStatusChangeHandler);

