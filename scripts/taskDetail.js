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
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
}




function popUp(todoData) {
    const contacts = todoData.contacts ? todoData.contacts : [];
    const subtasks = todoData.subtasks ? todoData.subtasks : [];

    const taskTypeClass = todoData.category === 'User Story' ? 'user-story' :
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
                                ${getInitials(contact.name)} <!-- Verwende getInitials() hier -->
                            </div>
                            <span>${contact.name}</span>
                        </div>`).join('')}
                    </div>
                </div>
                <div class="subtasks" id="subtask-container">
                    <p class="subtasks-label">Subtasks:</p>
                    <div class="subtask-list" id="subtask-list">
                        ${subtasks.map(subtask => `
                        <div class="subtask-item">
                            <div class="subtask-checkbox">
                                <img src="./assets/img/uncheckedBox.png" alt="unchecked">
                            </div>
                            <span>${subtask}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
            <div class="task-footer">
                <div class="btn-delete-task">
                <svg class="icon-delete-task" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
                </svg>
                    <span>Delete</span>
                </div>

                <div class="divider"></div>

                <div class="btn-edit-task">
                <svg class="icon-edit-task" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                </svg>
                    <span>Edit</span>
                </div>
        </div>
    `;
}


function getInitials(name) {
    const nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase(); 
}


function getRandomColor() {
    const colors = ['#3568D8', '#F35B80', '#FF7A00', '#1FD7C1', '#462F8A'];
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
