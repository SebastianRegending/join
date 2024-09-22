/**
 * Opens a pop-up displaying task details fetched from the database.
 * 
 * @param {string} todoId - The ID of the task to be retrieved and displayed.
 */
function openPopUp(todoId) {
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${todoId}.json`)
        .then(response => response.json())
        .then(todoData => {
            if (todoData) {
                todoData.id = todoId;
                todoData.contacts = todoData.contacts || [];
                todoData.subtasks = todoData.subtasks || [];
                todoData.description = todoData.description || "No description available";
                document.getElementById('pop-up-content').innerHTML = popUp(todoData, todoId);
                document.getElementById('pop-up-task').classList.remove('d-none');
            }
        })
        .catch((error) => {});
}

/**
 * Generates and returns the HTML content for the task pop-up.
 * 
 * @param {Object} todoData - The task data fetched from the database.
 * @param {string} todoId - The ID of the task.
 * @returns {string} The generated HTML content for the task details.
 */
function popUp(todoData, todoId) {
    IDsEdit = todoData.contacts;
    return generateTaskDetailsHTML(todoData, todoId);
}

/**
 * Toggles the status of a subtask (completed or not completed) and updates the database and UI.
 * 
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task's subtasks array.
 * @param {string} currentStatus - The current status of the subtask ("true" for completed, "false" for not completed).
 */
function toggleSubtaskStatus(taskId, subtaskIndex, currentStatus) {
    let newStatus = currentStatus === "true" ? "false" : "true";

    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/subtasks/${subtaskIndex}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: newStatus })
    })
    .then(response => response.json())
    .then(() => {
        let subtaskCheckbox = document.querySelector(`#task-details .subtask-list .subtask-item:nth-child(${subtaskIndex + 1}) .subtask-checkbox img`);
        subtaskCheckbox.src = `./assets/img/${newStatus === "true" ? "checkedBox.png" : "uncheckedBox.png"}`;
        updateTaskProgress(taskId);
    })
    .catch((error) => {});
}

/**
 * Returns the initials of a name.
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials of the name in uppercase.
 */
function getInitials(name) {
    let nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
}

/**
 * Returns a random color from a predefined list of colors.
 * 
 * @returns {string} A random color in hexadecimal format.
 */
function getRandomColor() {
    let colors = ['#3568D8', '#F35B80', '#FF7A00', '#1FD7C1', '#462F8A'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Closes the pop-up if the user clicks outside of the pop-up content.
 * 
 * @param {Event} event - The click event that triggers the function.
 */
function closePopUpIfOutside(event) {
    if (event.target.id === 'pop-up-task') {
        closePopUp();
    }
}

/**
 * Closes the task pop-up by adding a 'd-none' class to hide it.
 */
function closePopUp() {
    document.getElementById('pop-up-task').classList.add('d-none');
}

/**
 * Updates the progress of a task based on the completion status of its subtasks.
 * 
 * @param {string} taskId - The ID of the task to update.
 */
function updateTaskProgress(taskId) {
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`)
        .then(response => response.json())
        .then(taskData => {
            if (taskData && taskData.subtasks) {
                let totalSubtasks = taskData.subtasks.length;
                let completedSubtasks = taskData.subtasks.filter(subtask => subtask.done === "true").length;
                let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
                let progressBar = document.querySelector(`#task-${taskId} .progress`);
                let subtasksText = document.querySelector(`#task-${taskId} .subtasks`);

                if (progressBar) {
                    progressBar.style.width = `${progressPercentage}%`;
                }

                if (subtasksText) {
                    subtasksText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
                }
            }
        })
        .catch(error => {});
}
