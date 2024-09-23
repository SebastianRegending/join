/**
 * Loads all contacts and displays them as checkboxes in the UI.
 */
async function loadContacts() {
    let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
    let response = await fetch(URL_contacts + ".json");
    let responseToJson = await response.json();
    let contactsToConvertLetters = jsonToArrayContacts(responseToJson);
    let compare = sessionStorage.getItem("userId");
    for (let n = 0; n < contactsToConvertLetters.length; n++) {
        let IDs = jsonToArrayIDs(contactsToConvertLetters[n]);
        for (let i = 0; i < IDs.length; i++) {
            if (compare && compare === IDs[i]['userid']) {
                document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplateYou(n, i);
            } else {
                document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplate(n, i);
            }
        }
    }
}

/**
 * Loads all tasks from the database and displays them in their respective columns.
 */
async function loadTasks() {
    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";

    try {
        let tasks = await fetchTasks(URL_tasks);
        let columns = getColumns();

        resetColumns(columns);

        Object.keys(tasks).forEach(taskID => {
            let task = tasks[taskID];
            let taskHTML = generateTaskHTML(task, taskID);
            let columnKey = task.progress.replace(/\s/g, '');
            columns[columnKey]?.insertAdjacentHTML('beforeend', taskHTML);
        });

        handleEmptyColumns(columns);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

/**
 * Fetches tasks from the given URL.
 * 
 * @param {string} url - The URL to fetch tasks from.
 * @returns {Promise<Object>} The tasks data as a JSON object.
 */
async function fetchTasks(url) {
    let response = await fetch(url + ".json");
    return await response.json();
}

/**
 * Retrieves the HTML elements for each task column.
 * 
 * @returns {Object} An object containing the column HTML elements.
 */
function getColumns() {
    return {
        'ToDo': document.getElementById('ToDo'),
        'InProgress': document.getElementById('inProgress'),
        'AwaitFeedback': document.getElementById('AwaitFeedback'),
        'Done': document.getElementById('Done')
    };
}

/**
 * Clears the content of each task column.
 * 
 * @param {Object} columns - The object containing the column HTML elements.
 */
function resetColumns(columns) {
    Object.keys(columns).forEach(key => columns[key].innerHTML = '');
}

/**
 * Generates the HTML for a single task.
 * 
 * @param {Object} task - The task object containing its data.
 * @param {string} taskID - The ID of the task.
 * @returns {string} The HTML string for the task.
 */
function generateTaskHTML(task, taskID) {
    let progressHTML = generateProgressHTML(task);
    let contactsHTML = generateContactsHTML(task.contacts);
    let labelClass = task.category === 'User Story' ? 'user-story-label' : 'technical-task-label';

    return taskTemplate(task, taskID, progressHTML, contactsHTML, labelClass);
}

/**
 * Converts a contact JSON object into an array of contact objects.
 * 
 * @param {Object} json - The contact JSON object.
 * @returns {Array} An array of contact objects.
 */
function jsonToArrayContacts(json) {
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}

/**
 * Extracts the unique IDs from a contact JSON object.
 * 
 * @param {Object} json - The contact JSON object.
 * @returns {Array} An array of contact objects with unique IDs.
 */
function jsonToArrayIDs(json) {
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function (key) {
        let contact = json[key];
        contact.id = key;
        result.push(json[key]);
    });
    return result;
}

/**
 * Creates a checkbox template for a contact.
 * 
 * @param {number} n - Index for the outer loop (used for letters).
 * @param {number} i - Index for the inner loop (used for contacts).
 * @returns {string} The HTML string for the contact checkbox template.
 */
function createContactsCheckboxTemplate(n, i) {
    let isChecked = assignedContactsEdit.includes(IDs[i]['id']) ? 'checked' : '';

    return getContactTemplate(n, i, IDs, isChecked);
}

/**
 * Creates a checkbox template for a contact with the additional label "You".
 * 
 * @param {number} n - Index for the outer loop (used for letters).
 * @param {number} i - Index for the inner loop (used for contacts).
 * @returns {string} The HTML string for the contact checkbox template with "You".
 */
function createContactsCheckboxTemplateYou(n, i) {
    let isChecked = assignedContactsEdit.includes(IDs[i]['id']) ? 'checked' : '';

    return getContactTemplateYou(n, i, IDs, isChecked);
}

/**
 * Toggles the visibility of the checkboxes dropdown.
 */
function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

/**
 * Generates the HTML for the progress bar of a task.
 * 
 * @param {Object} task - The task object containing its data.
 * @returns {string} The HTML string for the progress bar.
 */
function generateProgressHTML(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) return '';

    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.done).length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return generateProgressHTMLTemplate(completedSubtasks, totalSubtasks, progressPercentage);
}

/**
 * Generates the HTML for contact badges associated with a task.
 * 
 * @param {Array} [contacts=[]] - Array of contact objects.
 * @returns {string} The HTML string for the contact badges.
 */
function generateContactsHTML(contacts = []) {
    let displayedContacts = contacts.slice(0, 4);
    let remainingContacts = contacts.length - 4;
    let badgesHTML = displayedContacts.map((contact) => {
        let initials = getInitials(contact.name);
        return `<span class="user-badge circle-${contact.color}">${initials}</span>`;
        
    }).join('');
    

    if (remainingContacts > 0) {
        badgesHTML += `<span class="user-badge" style="background-color: #A8A8A8">+${remainingContacts}</span>`;
    }

    return badgesHTML;
}

/**
 * Retrieves the initials of a given name.
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function getInitials(name) {
    let nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
}

/**
 * Displays a message when a task column is empty.
 * 
 * @param {Object} columns - The object containing the column HTML elements.
 */
function handleEmptyColumns(columns) {
    Object.keys(columns).forEach(key => {
        if (columns[key].innerHTML.trim() === '') {
            let message = `No tasks ${key.replace(/([A-Z])/g, ' $1').trim()}`;
            columns[key].innerHTML = `<div class="no-tasks">${message}</div>`;
        }
    });
}

/**
 * Prepares the task data based on user input.
 * 
 * @returns {Object|null} The new task data object or null if required fields are missing.
 */
function prepareNewTaskData() {
    let title = document.getElementById('input-title').value;
    let description = document.getElementById('input-description').value;
    let deadline = document.getElementById('deadline').value;
    let category = document.getElementById('category').value;
    let assignedContacts = getSelectedContacts();

    if (!title || !category) {
        alert("Title and category are required!");
        return null;
    }

    return {
        title, description, deadline, category,
        contacts: assignedContacts,
        progress: "To Do",
        prio: "medium",
        subtasks: []
    };
}

/**
 * Uploads the task data to the server and adds it to the board.
 * 
 * @param {Object} taskData - The task data object to be uploaded.
 */
async function uploadTask(taskData) {
    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
    try {
        let response = await fetch(URL_tasks, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData)
        });

        let result = await response.json();
        addTaskToBoard(taskData, result.name);

    } catch (error) {
        console.error('Error uploading task:', error);
    }
}

/**
 * Main function to create a new task by preparing the data and uploading it.
 */
async function createNewTask() {
    let newTaskData = prepareNewTaskData();

    if (newTaskData) {
        await uploadTask(newTaskData);
    }
}

/**
 * Adds a new task to the task board.
 * 
 * @param {Object} task - The task object containing its data.
 * @param {string} taskID - The ID of the task.
 */
function addTaskToBoard(task, taskID) {
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.done === "true").length;

    let progressHTML = getProgressHTML(completedSubtasks, totalSubtasks);

    let taskHTML = getTaskHTML(task, taskID, progressHTML);

    document.getElementById('ToDo').insertAdjacentHTML('beforeend', taskHTML);
}

/**
 * Retrieves the selected contacts from the checkboxes.
 * 
 * @returns {Array} An array of selected contact objects.
 */
function getSelectedContacts() {
    let selectedContacts = [];
    let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
    checkboxes.forEach(checkbox => {
        selectedContacts.push({
            name: checkbox.value,
            initials: getInitials(checkbox.value)
        });
    });
    return selectedContacts;
}

/**
 * Filters the tasks on the board based on the search term.
 */
function filterTasks() {
    let searchTerm = document.getElementById('task-search-input').value.toLowerCase();
    let tasks = document.querySelectorAll('.todo-card');

    tasks.forEach(task => {
        let taskTitle = task.querySelector('.card-title').textContent.toLowerCase();
        if (taskTitle.includes(searchTerm)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}
