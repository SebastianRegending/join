async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } 
    }
}



let currentDraggedElement;

function startDragging(event) {
    currentDraggedElement = event.target;
    event.dataTransfer.setData('text', currentDraggedElement.id);
    currentDraggedElement.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
}

function updateNoTasksMessage(container) {
    let noTasksMessage = container.querySelector('.no-tasks');
    let hasTasks = container.querySelectorAll('.todo-card').length > 0;

    if (hasTasks && noTasksMessage) {
        noTasksMessage.remove();
    } else if (!hasTasks && !noTasksMessage) {
        container.insertAdjacentHTML('beforeend', '<div class="no-tasks">No tasks To do</div>');
    }
}

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

function toggleHighlight(columnId, highlight = true) {
    let column = document.getElementById(columnId);
    column.classList.toggle('drag-area-highlight', highlight);
}

function highlight(columnId) {
    toggleHighlight(columnId, true);
}

function removeHighlight(columnId) {
    toggleHighlight(columnId, false);
}
