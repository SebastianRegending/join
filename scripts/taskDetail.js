function openPopUp(todoId) {
    // Hier wird die spezifische Task-ID verwendet, um die Daten aus Firebase abzurufen
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${todoId}.json`)
        .then(response => response.json())
        .then(todoData => {
            if (todoData) {
                // Standardwerte setzen, wenn Felder fehlen
                todoData.contacts = todoData.contacts || []; // Fallback auf leeres Array
                todoData.subtasks = todoData.subtasks || []; // Fallback auf leeres Array
                todoData.description = todoData.description || "No description available"; // Fallback auf Standardbeschreibung
                
                // PopUp-Inhalt mit den Task-Daten füllen
                document.getElementById('pop-up-content').innerHTML = popUp(todoData);
                document.getElementById('pop-up-task').classList.remove('d-none'); // Popup anzeigen
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}

function popUp(todoData) {
    let contacts = todoData.contacts ? todoData.contacts : [];
    let subtasks = todoData.subtasks ? todoData.subtasks : [];

    let taskTypeClass = todoData.category === 'User Story' ? 'user-story' :
                          todoData.category === 'Technical Task' ? 'technical-task' : '';

    return `
        <div id="task-details" class="task-details">
            <div class="task-header">
                <div class="task-type ${taskTypeClass}">
                    <span>${todoData.category}</span>
                </div>
                <img src="./assets/img/close.png" alt="Close" class="btn-close-popup" onclick="closePopUp()">
            </div>
            <div class="task-body">
                <span class="task-title">${todoData.title}</span>
                <span class="task-description">${todoData.description}</span>
                <div class="task-due-date">
                    <p>Due Date:</p>
                    <span>${todoData.deadline}</span>
                </div>
                <div class="task-priority">
                    <p>Priority:</p>
                    <div class="priority-level">
                        <p>${todoData.prio}</p>
                        <img src="./assets/img/${todoData.prio === 'urgent' ? 'urgent-icon' : 'medium-icon'}.svg" alt="${todoData.prio} Priority">
                    </div>
                </div>
                <div class="task-assignees">
                    <p class="assigned-to-label">Assigned To:</p>
                    <div class="assignee-list">
                        ${contacts.map(contact => `
                        <div class="assignee-item">
                            <div class="assignee-avatar" style="background-color: ${getRandomColor()}">
                                ${getInitials(contact.name)}
                            </div>
                            <span>${contact.name}</span>
                        </div>`).join('')}
                    </div>
                </div>
                <div class="subtasks" id="subtask-container">
                    <p class="subtasks-label">Subtasks:</p>
                    <div class="subtask-list" id="subtask-list">
                        ${subtasks.map((subtask, index) => `
                        <div class="subtask-item">
                            <div class="subtask-checkbox" onclick="toggleSubtaskStatus('${todoData.id}', ${index}, '${subtask.done}')">
                                <img src="./assets/img/${subtask.done === "true" ? "checkedBox.png" : "uncheckedBox.png"}" alt="${subtask.done}">
                            </div>
                            <span>${subtask.title}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
            <div class="task-footer">
                <div class="btn-delete-task">
                    <svg class="icon-delete-task" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- SVG Inhalt -->
                    </svg>
                    <span>Delete</span>
                </div>
                <div class="divider"></div>
                <div class="btn-edit-task">
                    <svg class="icon-edit-task" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- SVG Inhalt -->
                    </svg>
                    <span>Edit</span>
                </div>
            </div>
        </div>
    `;
}

function toggleSubtaskStatus(taskId, subtaskIndex, currentStatus) {
    // Überprüfe, ob taskId und subtaskIndex definiert sind
    if (!taskId || subtaskIndex === undefined) {
        console.error("Task ID or Subtask Index is missing!");
        return;
    }

    // Status umkehren
    let newStatus = currentStatus === "true" ? "false" : "true";  

    // Korrekte URL für das Subtask-Update in Firebase
    let url = `https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/subtasks/${subtaskIndex}/done.json`;

    // Sende den PATCH-Request an Firebase, um den 'done'-Status zu ändern
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newStatus)  // Aktualisiere nur den 'done'-Status
    })
    .then(response => response.json())
    .then(() => {
        // Aktualisiere das Bild in der UI nach dem Firebase-Update
        let subtaskCheckbox = document.querySelector(`#task-details .subtask-list .subtask-item:nth-child(${subtaskIndex + 1}) .subtask-checkbox img`);
        subtaskCheckbox.src = `./assets/img/${newStatus === "true" ? "checkedBox.png" : "uncheckedBox.png"}`;
    })
    .catch((error) => {
        console.error("Error updating subtask:", error);
    });
}

function getInitials(name) {
    let nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase(); 
}

function getRandomColor() {
    let colors = ['#3568D8', '#F35B80', '#FF7A00', '#1FD7C1', '#462F8A'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function closePopUpIfOutside(event) {
    if (event.target.id === 'pop-up-task') {
        closePopUp();
    }
}

function closePopUp() {
    document.getElementById('pop-up-task').classList.add('d-none'); 
}
