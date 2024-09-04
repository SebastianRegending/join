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
 * Moves the dragged task card to the specified column.
 * @param {DragEvent} event - The drop event.
 * @param {string} columnId - The ID of the target column where the card will be moved.
 */
function moveTo(event, columnId) {
    event.preventDefault();
    let column = document.getElementById(columnId);
    let draggedElement = document.getElementById(event.dataTransfer.getData('text'));

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
    
    document.getElementById('dialog-message').innerHTML = text;
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

function logOutButton() {
    document.getElementById('logout-container-container').classList.toggle('d-none');
    document.getElementById('logout-menu').classList.toggle('d-none');
}

function logOutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function legalNotice() {
    window.location.href = 'legalnotice.html';
}

function privacyPolicy() {
    window.location.href = 'privacypolicy.html';
}
