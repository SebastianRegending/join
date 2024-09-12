document.addEventListener('DOMContentLoaded', function () {

    // Öffnet das Dialogfenster zum Hinzufügen eines neuen Tasks
    function openDialog() {
        fetch('./addtask.html')
            .then(response => response.text())
            .then(data => {
                const dialogContent = document.getElementById('dialog-content');
                if (dialogContent) {
                    dialogContent.innerHTML = data;

                    // Hinzufügen der Schaltfläche zum Schließen des Dialogs
                    const closeButton = document.createElement('div');
                    closeButton.innerHTML = `
                        <img class="close-popup" src="./assets/img/close.png" alt="close-img">
                    `;
                    closeButton.addEventListener('click', closeDialog);

                    dialogContent.insertBefore(closeButton, dialogContent.firstChild);
                    document.getElementById('dialog').classList.remove('d-none');
                    
                    // Verhindert, dass sich der Dialog schließt, wenn auf den Inhalt geklickt wird
                    document.getElementById('dialog-content').addEventListener('click', function (event) {
                        event.stopPropagation(); // Stoppt das Ereignis, damit es nicht den Dialog-Hintergrund erreicht
                    });

                    // Lädt das zusätzliche Skript und die Kontakte, nachdem das Dialogfenster geöffnet wurde
                    loadScripts().then(() => {
                        loadContacts(); // Lädt Kontakte für das "Select contacts to assign"-Feld

                        const createTaskButton = document.getElementById('create-task-btn');
                        if (createTaskButton) {
                            createTaskButton.removeEventListener('click', createTaskHandler);
                            createTaskButton.addEventListener('click', createTaskHandler);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading the form:', error);
            });
    }

    // Schließt das Dialogfenster
    function closeDialog() {
        const dialog = document.getElementById('dialog');
        if (dialog) {
            dialog.classList.add('d-none');  // Dialog ausblenden
        }
    }

    // Event Listener, um den Dialog zu schließen, wenn auf den Hintergrund (außerhalb des Dialog-Inhalts) geklickt wird
    document.getElementById('dialog').addEventListener('click', function (event) {
        closeDialog();  // Schließt den Dialog, wenn auf den Hintergrund geklickt wurde
    });

    // Funktion zum Laden des zusätzlichen Skripts `addtask.js`
    function loadScripts() {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = './scripts/addtask.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Fügt den Event Listener für das Öffnen des Dialogs hinzu
    document.querySelector('.add-task').addEventListener('click', openDialog);

    // Funktion zum Erstellen eines neuen Tasks und Ausführen der Animation, bevor der Dialog geschlossen wird
    async function createTaskHandler(e) {
        e.preventDefault();  // Verhindert das Neuladen der Seite

        await createNewTask();  // Erstellt den neuen Task

        // Zeigt die "Task added" Animation
        showTaskAddedAnimation().then(() => {
            closeDialog();  // Schließt den Dialog nach der Animation
        });
    }

    // Funktion zum Anzeigen der Animation "Task added"
    function showTaskAddedAnimation() {
        return new Promise(resolve => {
            const animationElement = document.getElementById('task-added-animation');
            animationElement.classList.remove('d-none');  // Zeigt das Element an
            animationElement.classList.add('show');  // Startet die Animation

            setTimeout(() => {
                animationElement.classList.remove('show');  // Entfernt die Animation
                setTimeout(() => {
                    animationElement.classList.add('d-none');  // Versteckt das Element wieder
                    resolve();
                }, 300);
            }, 3000);
        });
    }
});



// Funktion zum Laden der Tasks und deren Darstellung im Board
async function loadTasks() {
    const URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";

    try {
        let response = await fetch(URL_tasks + ".json");
        let tasks = await response.json();

        const columns = {
            'ToDo': document.getElementById('ToDo'),
            'InProgress': document.getElementById('inProgress'),
            'AwaitFeedback': document.getElementById('AwaitFeedback'),
            'Done': document.getElementById('Done')
        };

        // Spalten leeren, bevor neue Tasks hinzugefügt werden
        Object.keys(columns).forEach(key => columns[key].innerHTML = '');

        // Farben für Benutzer-Badges
        const colors = ['#FF7A00', '#1FD7C1', '#462F8A', '#6e52ff', '#00bee8'];

        // Wiederverwendbare Funktion zum Abrufen der Initialen
        function getInitials(name) {
            const nameParts = name.split(' ');
            return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
        }

        // Fügt Tasks in die entsprechenden Spalten ein
        for (let taskID in tasks) {
            let task = tasks[taskID];

            let progressHTML = '';
            if (task.subtasks && Array.isArray(task.subtasks)) {
                let totalSubtasks = task.subtasks.length;
                let completedSubtasks = task.subtasks.filter(subtask => subtask.done).length;
                let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

                progressHTML = `
                    <div class="card-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progressPercentage}%;"></div>
                        </div>
                        <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
                    </div>
                `;
            }

            // Benutzer-Badges
            let contactsHTML = '';
            if (task.contacts) {
                task.contacts.forEach((contact, index) => {
                    let color = colors[index % colors.length];
                    let initials = getInitials(contact.name);
                    contactsHTML += `<span class="user-badge" style="background-color:${color}">${initials}</span>`;
                });
            }

            // Klassifizierung nach Kategorie des Tasks
            let labelClass = task.category === 'User Story' ? 'user-story-label' : 'technical-task-label';

            let taskHTML = `
                <div id="task-${taskID}" class="todo-card" draggable="true" ondragstart="startDragging(event)" onclick="openPopUp('${taskID}')">
                    <div class="card-labels ${labelClass}">
                        <span class="label">${task.category}</span>
                    </div>

                    <div class="card-content">
                        <h3 class="card-title">${task.title}</h3>
                        <p class="card-description">${task.description || 'No description available'}</p>
                    </div>

                    ${progressHTML}

                    <div class="card-footer">
                        <div class="card-users">
                            ${contactsHTML}
                        </div>
                        <div class="priority">
                            <span class="priority-symbol">
                                <img src="./assets/img/priority-${task.prio}.png" alt="${task.prio}">
                            </span>
                        </div>
                    </div>
                </div>
            `;

            // Task in die entsprechende Spalte einfügen
            columns[task.progress.replace(/\s/g, '')]?.insertAdjacentHTML('beforeend', taskHTML);
        }

        // Falls keine Tasks in den Spalten sind, eine Nachricht anzeigen
        Object.keys(columns).forEach(key => {
            if (columns[key].innerHTML.trim() === '') {
                let message = `No tasks ${key.replace(/([A-Z])/g, ' $1').trim()}`;
                columns[key].innerHTML = `<div class="no-tasks">${message}</div>`;
            }
        });

    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Funktion zum Erstellen eines neuen Tasks und Hinzufügen zum Board
async function createNewTask() {
    let title = document.getElementById('input-title').value;
    let description = document.getElementById('input-description').value;
    let deadline = document.getElementById('deadline').value;
    let category = document.getElementById('category').value;
    let assignedContacts = getSelectedContacts(); // Ausgewählte Kontakte bekommen

    if (!title || !category) {
        alert("Title and category are required!");
        return;
    }

    let newTaskData = {
        title, description, deadline, category,
        contacts: assignedContacts,
        progress: "To Do",
        prio: "medium",
        subtasks: []
    };

    const URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
    try {
        let response = await fetch(URL_tasks, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTaskData)
        });

        let result = await response.json();
        addTaskToBoard(newTaskData, result.name);

    } catch (error) {
        console.error('Error uploading task:', error);
    }
}

// Funktion, um den Task sofort im Board anzuzeigen
function addTaskToBoard(task, taskID) {
    let progressHTML = '';
    if (task.subtasks && Array.isArray(task.subtasks)) {
        let totalSubtasks = task.subtasks.length;
        let completedSubtasks = task.subtasks.filter(subtask => subtask.done).length;
        let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        progressHTML = `
            <div class="card-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercentage}%;"></div>
                </div>
                <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
            </div>
        `;
    }

    let contactsHTML = '';
    if (task.contacts) {
        task.contacts.forEach((contact) => {
            let initials = getInitials(contact.name);
            contactsHTML += `<span class="user-badge">${initials}</span>`;
        });
    }

    let taskHTML = `
        <div id="task-${taskID}" class="todo-card" draggable="true" ondragstart="startDragging(event)">
            <div class="card-labels ${task.category === 'User Story' ? 'user-story-label' : 'technical-task-label'}">
                <span class="label">${task.category}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${task.title}</h3>
                <p class="card-description">${task.description || 'No description available'}</p>
            </div>
            ${progressHTML}
            <div class="card-footer">
                <div class="card-users">
                    ${contactsHTML}
                </div>
                <div class="priority">
                    <span class="priority-symbol">
                        <img src="./assets/img/priority-${task.prio}.png" alt="${task.prio}">
                    </span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('ToDo').insertAdjacentHTML('beforeend', taskHTML);
}

// Funktion, um die ausgewählten Kontakte zu erhalten
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
