let expanded = false;
let prioEdit;
let contactIds = [];
let subtasksEdit = [];

document.addEventListener('DOMContentLoaded', function () {

    // Öffnet das Dialogfenster zum Hinzufügen eines neuen Tasks
    function openDialog() {
        fetch('./addtask.html')
            .then(response => response.text())
            .then(data => {
                let dialogContent = document.getElementById('dialog-content');
                if (dialogContent) {
                    dialogContent.innerHTML = data;

                    // Hinzufügen der Schaltfläche zum Schließen des Dialogs
                    let closeButton = document.createElement('div');
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

                        let createTaskButton = document.getElementById('create-task-btn');
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
        let dialog = document.getElementById('dialog');
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
            let animationElement = document.getElementById('task-added-animation');
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

/// Hauptfunktion zum Laden der Tasks
async function loadTasks() {
    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";

    try {
        let tasks = await fetchTasks(URL_tasks);
        let columns = getColumns();

        resetColumns(columns); // Spalten leeren

        Object.keys(tasks).forEach(taskID => {
            let task = tasks[taskID];
            let taskHTML = generateTaskHTML(task, taskID);
            let columnKey = task.progress.replace(/\s/g, '');
            columns[columnKey]?.insertAdjacentHTML('beforeend', taskHTML);
        });

        handleEmptyColumns(columns); // Zeige Nachricht an, wenn Spalten leer sind

    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Funktion zum Abrufen der Tasks von der Datenbank
async function fetchTasks(url) {
    let response = await fetch(url + ".json");
    return await response.json();
}

// Funktion, um die HTML-Elemente der Spalten zu erhalten
function getColumns() {
    return {
        'ToDo': document.getElementById('ToDo'),
        'InProgress': document.getElementById('inProgress'),
        'AwaitFeedback': document.getElementById('AwaitFeedback'),
        'Done': document.getElementById('Done')
    };
}

// Funktion zum Leeren der Spalten
function resetColumns(columns) {
    Object.keys(columns).forEach(key => columns[key].innerHTML = '');
}

// Funktion zum Generieren der Task-HTML
function generateTaskHTML(task, taskID) {
    let progressHTML = generateProgressHTML(task);
    let contactsHTML = generateContactsHTML(task.contacts);
    let labelClass = task.category === 'User Story' ? 'user-story-label' : 'technical-task-label';

    return `
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
}


async function deleteTask(id) {
    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
    await fetch(`${URL_tasks}/${id}.json`, {
        method: "DELETE"
    });
    closePopUp();
    loadTasks();
}


function prepareEditTask(id, title, description, contacts, deadline, prio, category, subtasks) {
    loadContacts() ;
    document.getElementById('pop-up-content').innerHTML = generateEditPage(id, title, description, contacts, deadline, prio, category, subtasks);
    readPrioEdit(prio);
    for(let i = 0; i < subtasksEdit.length; i++){
    document.getElementById('added-subtasks-edit').innerHTML += `<div>${subtasksEdit[i]}</div>`;
    console.log(contactIds);
}
}


async function loadContacts() {
    let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts"
    let response = await fetch(URL_contacts + ".json");
    let responseToJson = await response.json();
    let contactsToConvertLetters = jsonToArrayContacts(responseToJson);
    let compare = sessionStorage.getItem("userId");
    for (let n = 0; n < contactsToConvertLetters.length; n++) {
      IDs = jsonToArrayIDs(contactsToConvertLetters[n])
      for (let i = 0; i < IDs.length; i++) {
        if (compare && compare == IDs[i]['userid']) {
          document.getElementById('checkboxes-edit').innerHTML += createContactsCheckboxTemplateYou(n, i);
        } else {
          document.getElementById('checkboxes-edit').innerHTML += createContactsCheckboxTemplate(n, i);
        }
      }
    }
  }


  /**
 * Converts the contact-JSON into an array with all contacts as an object
 * 
 * @param {*} json 
 * @returns array with all contacts
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
 * Extracts the unique IDs
 * 
 * @param {json} json 
 * @returns unique ID, used by database
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
 * Creates a contacts-template
 * 
 * @param {number} - while loop, that are the letters
 * @param {number} - for loop, that are the indexed of the contacts 
 * @returns Contacts-Template in HTML
 */
function createContactsCheckboxTemplate(n, i) {
    return /*html*/`
        <label for="contacts${n}" class="contact-for-form">
              <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
              </div>
              <div>${IDs[i]['name']}
              </div> 
              <input class="input-check" type="checkbox" name="contacts" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" onclick="addCircle('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}')"/>
        </label>
      `
  }


  /**
 * Creates a contacts-template
 * 
 * @param {number} - for loop, that are the letters
 * @param {number} - for loop, that are the indexed of the contacts 
 * @returns Contacts-Template in HTML with additional You
 */
function createContactsCheckboxTemplateYou(n, i) {
  return /*html*/`
      <label for="contacts${n}" class="contact-for-form">
            <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
            </div>
            <div>${IDs[i]['name']}(You)
            </div> 
            <input class="input-check" type="checkbox" name="contacts" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" onclick="addCircle('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}')"/>
      </label>
    `
}



/**
 * Designs the subtasks input to focus-mode
 */
function openAddSubtaskEdit() {
    document.getElementById('add-button-icon-plus-edit').classList.add('d-none');
    document.getElementById('add-button-icon-cancel-edit').classList.remove('d-none');
    document.getElementById('add-button-icon-check-edit').classList.remove('d-none');
    document.getElementById('subtasks').focus();
  }


function setPrioEdit(priority){
    prioEdit = priority;
    readPrioEdit(priority);
}


function readPrioEdit(prio){
    if (prio == "urgent"){
        colorPrioUrgentEdit();
    } else if(prio == "medium"){
        colorPrioMediumEdit();
    } else if(prio == "low"){
        colorPrioLowEdit();
    }
}


function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes-edit");
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  }


/**
 * Colors the urgent-area and uncolors the other areas
 */
function colorPrioUrgentEdit() {
    document.getElementById('prio-urgent-edit').classList.add('prio-active-urgent');
    document.getElementById('prio-medium-edit').classList.remove('prio-active-medium');
    document.getElementById('prio-low-edit').classList.remove('prio-active-low');
  }
  
  
  /**
   * Colors the medium-area and uncolors the other areas
   */
  function colorPrioMediumEdit() {
    document.getElementById('prio-urgent-edit').classList.remove('prio-active-urgent');
    document.getElementById('prio-medium-edit').classList.add('prio-active-medium');
    document.getElementById('prio-low-edit').classList.remove('prio-active-low');
  }
  
  
  /**
   * Colors the low-area and uncolors the other areas
   */
  function colorPrioLowEdit() {
    document.getElementById('prio-urgent-edit').classList.remove('prio-active-urgent');
    document.getElementById('prio-medium-edit').classList.remove('prio-active-medium');
    document.getElementById('prio-low-edit').classList.add('prio-active-low');
  }

function generateProgressHTML(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) return '';

    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.done).length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return generateProgressHTMLTemplate(completedSubtasks, totalSubtasks, progressPercentage);
}


// Funktion zum Generieren der Kontakt-Badges-HTML
function generateContactsHTML(contacts = []) {
    let colors = ['#FF7A00', '#1FD7C1', '#462F8A', '#6e52ff', '#00bee8'];

    return contacts.map((contact, index) => {
        let color = colors[index % colors.length];
        let initials = getInitials(contact.name);
        return `<span class="user-badge" style="background-color:${color}">${initials}</span>`;
    }).join('');
}

// Funktion zum Abrufen der Initialen eines Namens
function getInitials(name) {
    let nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
}

// Funktion, um eine Nachricht anzuzeigen, wenn keine Tasks in einer Spalte sind
function handleEmptyColumns(columns) {
    Object.keys(columns).forEach(key => {
        if (columns[key].innerHTML.trim() === '') {
            let message = `No tasks ${key.replace(/([A-Z])/g, ' $1').trim()}`;
            columns[key].innerHTML = `<div class="no-tasks">${message}</div>`;
        }
    });
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

    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
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
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.done === "true").length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressHTML = `
        <div class="card-progress">
            <div class="progress-bar">
                <div class="progress" style="width: ${progressPercentage}%;"></div>
            </div>
            <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
    `;

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
                    ${generateContactsHTML(task.contacts)}
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


function filterTasks() {
    const searchTerm = document.getElementById('task-search-input').value.toLowerCase();
    const tasks = document.querySelectorAll('.todo-card'); // Alle Task-Elemente

    tasks.forEach(task => {
        const taskTitle = task.querySelector('.card-title').textContent.toLowerCase();
        if (taskTitle.includes(searchTerm)) {
            task.style.display = 'block'; // Task anzeigen
        } else {
            task.style.display = 'none';  // Task ausblenden
        }
    });
}