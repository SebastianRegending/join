/**
 * initializes the function on body onload at login.html
 */
function initLoginHTML() {
    startLogoAnimation();
    startLogoAnimationMobile();
    preFillForm();
}

/**
 * initializes the function on body onload at addtask.html
 */
async function initAddTaskHTML() {
    await includeHTML();
    loadContacts();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at summary.html
 */
async function initSummaryHTML() {
    await includeHTML();
    await getNumberOfTasks();
    await getProgressOfTasks();
    setDaytimeOnGreeting();
    setUsernameOnGreeting();
    greetingOnMobile();
    showInitialsForHeader();
    getDeadlineDate();
}

/**
 * initializes the function on body onload at board.html
 */
async function initBoardHTML() {
    await includeHTML();
    loadTasks();
    loadContactsDialog();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at contacts.html
 */
async function initContactsHTML() {
    await includeHTML();
    loadContacts();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at privacypolicy.html
 */
async function initPrivacyPolicyHTML() {
    await includeHTML();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at legalnotice.html
 */
async function initLegalNoticeHTML() {
    await includeHTML();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at help.html
 */
async function initHelpHTML() {
    await includeHTML();
    setInitialsForHeader();
}

/**
 * initializes the function on body onload at summaryguest.html
 */
async function initGuestSummaryHTML() {
    await includeHTML();
    setDaytimeOnGreeting();
    showInitialsForHeaderGuest();
    greetingOnMobile();
}

/**
 * Includes HTML content from external files into the current document.
 * Elements with the attribute `w3-include-html` will have their content replaced by the fetched HTML.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        }
    }
    addActiveClass();
}

let currentDraggedElement;

/**
 * Initiates the drag operation for a task card.
 * @param {DragEvent} event - The drag event.
 */
function startDragging(event) {
    currentDraggedElement = event.target;
    event.dataTransfer.setData('text', currentDraggedElement.id);
    currentDraggedElement.classList.add('dragging');
}

/**
 * Allows the drop operation by preventing the default behavior.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Updates the "No tasks" message visibility based on the presence of tasks in the column.
 * If no tasks are present, it inserts a "No tasks" message.
 * @param {HTMLElement} container - The task column container to update.
 */
function updateNoTasksMessage(container) {
    let noTasksMessage = container.querySelector('.no-tasks');
    let hasTasks = container.querySelectorAll('.todo-card').length > 0;

    if (hasTasks && noTasksMessage) {
        noTasksMessage.remove();
    } else if (!hasTasks && !noTasksMessage) {
        container.insertAdjacentHTML('beforeend', '<div class="no-tasks">No tasks To do</div>');
    }
}

/**
 * Moves the dragged element to the specified column and updates the DOM accordingly.
 * 
 * @function moveElementToColumn
 * @param {HTMLElement} draggedElement - The task element being moved.
 * @param {string} columnId - The ID of the column to which the task is being moved.
 */
function moveElementToColumn(draggedElement, columnId) {
    let column = document.getElementById(columnId);

    if (draggedElement && column) {
        let originalContainer = draggedElement.parentElement;
        column.prepend(draggedElement);
        draggedElement.classList.remove('dragging');
        draggedElement.classList.add('elastic');
        setTimeout(() => draggedElement.classList.remove('elastic'), 600);

        column.classList.remove('drag-area-highlight');
        updateNoTasksMessage(originalContainer);
        updateNoTasksMessage(column);
    }
}

/**
 * Updates the task status in Firebase based on the column it was moved to.
 * 
 * @async
 * @function updateTaskStatus
 * @param {string} columnId - The ID of the column to which the task is moved.
 * @param {HTMLElement} draggedElement - The task element whose status is being updated.
 * @returns {Promise<void>} - A promise that resolves when the task status is updated in Firebase.
 */
async function updateTaskStatus(columnId, draggedElement) {
    let taskId = draggedElement.id.replace('task-', '');
    let newStatus = '';

    switch (columnId) {
        case 'ToDo':
            newStatus = 'To Do';
            break;
        case 'inProgress':
            newStatus = 'In Progress';
            break;
        case 'AwaitFeedback':
            newStatus = 'Await Feedback';
            break;
        case 'Done':
            newStatus = 'Done';
            break;
    }

    try {
        await updateTaskStatusInFirebase(taskId, newStatus);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

/**
 * Handles the drag-and-drop action, moves the task element to the new column,
 * and triggers a status update in Firebase.
 * 
 * @async
 * @function moveTo
 * @param {Event} event - The drag event triggered by the user.
 * @param {string} columnId - The ID of the column to which the task is being moved.
 * @returns {Promise<void>} - A promise that resolves when the task is moved and status is updated.
 */
async function moveTo(event, columnId) {
    let draggedElement;
    if (event && event.preventDefault) {
        event.preventDefault();
        draggedElement = document.getElementById(event.dataTransfer.getData('text'));
    } else {
        draggedElement = document.querySelector('.todo-card.active');
    }

    if (draggedElement) {
        moveElementToColumn(draggedElement, columnId);
        await updateTaskStatus(columnId, draggedElement);
    }
}

/**
 * Updates the task status in Firebase.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status to set for the task.
 */
async function updateTaskStatusInFirebase(taskId, newStatus) {
    const URL_task = `https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`;
    try {
        await fetch(URL_task, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ progress: newStatus })
        });
    } catch (error) {
        // Handle error if needed
    }
}

/**
 * Toggles the highlight state for a task column.
 * @param {string} columnId - The ID of the column to highlight or remove the highlight.
 * @param {boolean} [highlight=true] - Whether to add or remove the highlight.
 */
function toggleHighlight(columnId, highlight = true) {
    let column = document.getElementById(columnId);
    column.classList.toggle('drag-area-highlight', highlight);
}

/**
 * Highlights the target task column during a drag operation.
 * @param {string} columnId - The ID of the column to highlight.
 */
function highlight(columnId) {
    toggleHighlight(columnId, true);
}

/**
 * Removes the highlight from the target task column.
 * @param {string} columnId - The ID of the column to remove the highlight.
 */
function removeHighlight(columnId) {
    toggleHighlight(columnId, false);
}

/**
 * Opens the dialog window with a sliding animation from right to left.
 * @param {string} text - The text content to display in the dialog.
 */
function openDialog(text) {
    let dialog = document.getElementById('dialog');
    let dialogBox = dialog.querySelector('.dialog');

    dialog.classList.remove('d-none');

    setTimeout(() => {
        dialogBox.classList.add('show');
    }, 10);
}

/**
 * Closes the dialog window with a sliding animation.
 */
function closeDialog() {
    let dialog = document.getElementById('dialog');
    let dialogBox = dialog.querySelector('.dialog');

    dialogBox.classList.remove('show');

    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 500);
}

/**
 * toggles the log out menu show/hide
 */
function logOutButton() {
    const mediaQuery = window.matchMedia('(max-width: 650px)')
    if (mediaQuery.matches) {
        document.getElementById('logout-container').classList.toggle('d-none');        
        document.getElementById('logout-menu-mobile').classList.toggle('d-none');     
    } else {
        document.getElementById('logout-container').classList.toggle('d-none');        
        document.getElementById('logout-menu').classList.toggle('d-none');       
    }
}

/**
 * logs the user out and delete the datas from local and session storage
 */
function logOutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}

/**
 * switch to help
 */
function help() {
    window.location.href = 'help.html';
}

/**
 * switch to legalnotice
 */
function legalNotice() {
    window.location.href = 'legalnotice.html';
}

/**
 * switch to guest legalnotice
 */
function legalNoticeGuest() {
window.location.href = 'legalnoticeguest.html';
}

/**
 * switch to privacypolicy
 */
function privacyPolicy() {
    window.location.href = 'privacypolicy.html';
}

/**
 * switch to guest privacypolicy
 */
function privacyPolicyGuest() {
    window.location.href = 'privacypolicyguest.html';
}

/**
 * Finds the current page path and compares it with the href attributes of links that have the 'menu-item' class.
 * Adds the 'active' class to the matching menu item to visually highlight it.
 *
 * @function addActiveClass
 * @returns {void} Adds the 'active' class to the matching menu item.
 */
function addActiveClass() {
    let currentPath = window.location.pathname.split('/').pop();

    document.querySelectorAll('.menu-item').forEach(item => {
        let hrefPath = item.getAttribute('href').split('/').pop();

        if (currentPath === hrefPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * set the initials for the header button from logged in user from session storage
 */
function setInitialsForHeader() {
    let initialsHeader = JSON.parse(sessionStorage.getItem('Initials'));
    if (initialsHeader) {
        let firstInitial = initialsHeader[0];
        let secondInitial = initialsHeader[1];
        let combinedInitials = firstInitial + (secondInitial ? secondInitial : '');
        document.getElementById('initials-header').innerHTML = combinedInitials;
    }
}

/**
 * Toggles the visibility of the dropdown content associated with the specified element.
 * 
 * @function toggleDropdown
 * @param {HTMLElement} element - The element that contains the dropdown content.
 */
function toggleDropdown(element) {
    let dropdownContent = element.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('show');
}
