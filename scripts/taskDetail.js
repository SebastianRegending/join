function openPopUp(todoId) {
      // Hier wird die spezifische Task-ID verwendet, um die Daten aus Firebase abzurufen
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${todoId}.json`)
        .then(response => response.json())
        .then(todoData => {
            if (todoData) {
                // Füge die taskId zum todoData-Objekt hinzu
                todoData.id = todoId;  // taskId wird hinzugefügt
                
                // Standardwerte setzen, wenn Felder fehlen
                todoData.contacts = todoData.contacts || []; // Fallback auf leeres Array
                todoData.subtasks = todoData.subtasks || []; // Fallback auf leeres Array
                todoData.description = todoData.description || "No description available"; // Fallback auf Standardbeschreibung
                // PopUp-Inhalt mit den Task-Daten füllen
                document.getElementById('pop-up-content').innerHTML = popUp(todoData, todoId);
                document.getElementById('pop-up-task').classList.remove('d-none'); // Popup anzeigen
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}

function popUp(todoData, todoId) {
    IDsEdit = todoData.contacts;
    return generateTaskDetailsHTML(todoData, todoId); // Verwende die Template-Funktion
}


function toggleSubtaskStatus(taskId, subtaskIndex, currentStatus) {
    let newStatus = currentStatus === "true" ? "false" : "true";  // Status umkehren

    // Update Firebase: Ändere den Status des Subtasks
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}/subtasks/${subtaskIndex}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: newStatus })  // Aktualisiere den Subtask-Status
    })
    .then(response => response.json())
    .then(() => {
        // Aktualisiere das Bild in der UI
        let subtaskCheckbox = document.querySelector(`#task-details .subtask-list .subtask-item:nth-child(${subtaskIndex + 1}) .subtask-checkbox img`);
        subtaskCheckbox.src = `./assets/img/${newStatus === "true" ? "checkedBox.png" : "uncheckedBox.png"}`;

        // Aktualisiere den Fortschritt des Tasks
        updateTaskProgress(taskId);

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

function updateTaskProgress(taskId) {
    // Holen Sie sich den Task mit der gegebenen taskId
    fetch(`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`)
        .then(response => response.json())
        .then(taskData => {
            if (taskData && taskData.subtasks) {
                // Anzahl der Subtasks und abgeschlossene Subtasks
                const totalSubtasks = taskData.subtasks.length;
                const completedSubtasks = taskData.subtasks.filter(subtask => subtask.done === "true").length;

                // Berechne den Fortschritt in Prozent
                const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

                // Aktualisiere den Fortschrittsbalken
                const progressBar = document.querySelector(`#task-${taskId} .progress`);
                const subtasksText = document.querySelector(`#task-${taskId} .subtasks`);

                if (progressBar) {
                    progressBar.style.width = `${progressPercentage}%`;
                }

                // Aktualisiere den Text, der die Anzahl der Subtasks anzeigt
                if (subtasksText) {
                    subtasksText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
                }
            }
        })
        .catch(error => {
            console.log("Error updating task progress:", error);
        });
}

