let IDsDialog;
let expandedDialog = false;
let URL_contactsDialog = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let URL_tasksdialog = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let prioDialog = "medium";
let subtasksDialog = [];
let taskIDDialog = [];
let checkedContactsCirclesDialog = [];
let progressDialog;

function openDialogAddTask(newProgress) {
  progressDialog = newProgress;
  document.getElementById('addTaskDialog').classList.remove('d-none');
}

function cancelDialogAddTask() {
  clearTasks();
  document.getElementById('addTaskDialog').classList.add('d-none');
  document.getElementById('dialog').classList.add('d-none');
  checkedContactsCirclesDialog = [];
  document.getElementById('circle-area-assigned-contacts').innerHTML = ``;

}

/**
 * Checks if the input is expanded and shows the checkboxes if it is
 */
function showCheckboxesDialog() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expandedDialog) {
    checkboxes.style.display = "block";
    expandedDialog = true;
    document.addEventListener('click', closeDropdownOnClickOutside);
  } else {
    checkboxes.style.display = "none";
    expandedDialog = false;
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Closes the Dropdown Menu
 * @param {*} event 
 */
function closeDropdownOnClickOutside(event) {
  let checkboxes = document.getElementById("checkboxes");
  let selectBox = document.querySelector(".selectBox");
  if (!selectBox.contains(event.target) && !checkboxes.contains(event.target)) {
    checkboxes.style.display = "none";
    expanded = false;
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Loads the contacts from database to the Checkbox-Input
 */
async function loadContactsDialog() {
  IDsDialog = [];
  let response = await fetch(URL_contactsDialog + ".json");
  let responseToJson = await response.json();
  let contactsToConvertLetters = jsonToArrayContacts(responseToJson);
  let compare = sessionStorage.getItem("userId");
  for (let n = 0; n < contactsToConvertLetters.length; n++) {
    IDsDialog = jsonToArrayIDs(contactsToConvertLetters[n])
    for (let i = 0; i < IDsDialog.length; i++) {
      if (compare && compare == IDsDialog[i]['userid']) {
        document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplateYou(n, i);
      } else {
        document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplate(n, i);
      }
    }
  }
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
      <label for="contact-editing-${n}${i}" class="contact-for-form">
            <div id="contact-${n}-circle" class="circle circle-${IDsDialog[i]['color']}">${IDsDialog[i]['initials']}
            </div>
            <div>${IDsDialog[i]['name']}
            </div> 
            <input class="input-check" type="checkbox" name="contacts" value="${IDsDialog[i]['name']}" id="contact-editing-${n}${i}" data-letter="${IDsDialog[i]['initials'].charAt(0)}" data-id="${IDsDialog[i]['id']}"  data-color="${IDsDialog[i]['color']}" onclick="addCircleDialog('${IDsDialog[i]['color']}', 'contact-editing-${n}${i}', '${IDsDialog[i]['initials']}')"/>
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
      <label for="contact-editing-${n}${i}" class="contact-for-form">
            <div id="contact-${n}-circle" class="circle circle-${IDsDialog[i]['color']}">${IDsDialog[i]['initials']}
            </div>
            <div>${IDsDialog[i]['name']}(You)
            </div> 
            <input class="input-check" type="checkbox" name="contacts" value="${IDsDialog[i]['name']}" id="contact-editing-${n}${i}" data-letter="${IDsDialog[i]['initials'].charAt(0)}" data-id="${IDsDialog[i]['id']}" onclick="addCircleDialog('${IDsDialog[i]['color']}', 'contact-editing-${n}${i}', '${IDsDialog[i]['initials']}')"/>
      </label>
    `
}

/**
 * Creates an initials-circle to the circle-area-assigned-contacts, if it's checked
 * 
 * @param {string} color 
 * @param {string} id 
 * @param {string} inits 
 */
function addCircle(color, id, inits, uniqueId) {
  let check = document.getElementById(id);
  if (check.checked == true) {
    checkedContactsCirclesDialog.push({ "id": id, "color": color, "inits": inits });
  } else {
    checkedContactsCirclesDialog.splice(checkedContactsCirclesDialog.findIndex(item => item.id === id), 1);
  }
  document.getElementById('circle-area-assigned-contacts').innerHTML = ``;
  if (checkedContactsCirclesDialog.length > 6) {
    for (let i = 0; i < 6; i++) {
      document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-${checkedContactsCirclesDialog[i]['color']} assigned-contacts z${i + 1}">${checkedContactsCirclesDialog[i]['inits']}</div>`;
    }
    document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-grey assigned-contacts z${7}">+${checkedContactsCirclesDialog.length - 6}</div>`
  } else {
    for (let i = 0; i < checkedContactsCirclesDialog.length; i++) {
      document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-${checkedContactsCirclesDialog[i]['color']} assigned-contacts z${i + 1}">${checkedContactsCirclesDialog[i]['inits']}</div>`;
    }
  }
}

/**
 * Prepares a task with the necessary parameters
 */
async function addTask() {
  let title = document.getElementById('input-title');
  let description = document.getElementById('input-description');
  let assignedContacts = getSelected();
  let deadline = document.getElementById('deadline');
  let category = document.getElementById('category');

  await uploadTask(title, description, deadline, category, assignedContacts);
  launchToaster();
  clearTasks();
  cancelDialogAddTask();
}

/**
 * Prepares the task for upload and returns its id
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} deadline 
 * @param {string} category 
 * @param {array} assignedContacts 
 * @returns 
 */
async function uploadTask(title, description, deadline, category, assignedContacts) {
  let response = await sumbitUploadTask(title, description, deadline, category, assignedContacts);
  let responseToJson = await response.json();
  if (responseToJson['tasks']) {
    responseToJson['tasks'].forEach(task => {
      taskIDDialog.push(task);
    });
  }
  taskIDDialog.push(responseToJson['name']);
  return responseToJson;
}

/**
 * Uploads the task to database
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} deadline 
 * @param {*} category 
 * @param {*} assignedContacts 
 */
async function sumbitUploadTask(title, description, deadline, category, assignedContacts) {
  data = ({ title: title.value, description: description.value, deadline: deadline.value, prio: prioDialog, category: category.value, contacts: assignedContacts, subtasks: subtasksDialog, progress: progressDialog });
  let response = await fetch(URL_tasksdialog + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  assignedContacts = [];
  return response;
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
 * Sets the global variable prio to "low", "medium" or "urgent"
 * 
 * @param {string} priority 
 */
function setPrio(priority) {
  prioDialog = priority;
}


/**
 * Searches for selected checkboxes and pushs them in an array
 * 
 * @returns selected checkboxes
 */
function getSelected() {
  let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
  let selectedData = [];

  checkboxes.forEach((checkbox) => {
    let name = checkbox.value;
    let id = checkbox.getAttribute('data-id');
    let letter = checkbox.getAttribute('data-letter');
    let color = checkbox.getAttribute('data-color');
    selectedData.push({ name: name, id: id, letter: letter, color: color });
  });
  return selectedData;
}


/**
 * Adds one subtask to subtask-array and loads it to subtask-html-area
 */
function addSubtask() {
  let subtask = document.getElementById('subtasks');
  if (subtask.value) {
    let subtaskobject = { title: `${subtask.value}`, done: "false" };
    subtasksDialog.push(subtaskobject);
    renderAddedSubtasks();
    document.getElementById('subtasks').value = ``;
    cancelAddSubtask()
  }
}

/**
 * Renders the global array subtasks into the div
 */
function renderAddedSubtasks(){
  document.getElementById('added-subtasks').innerHTML = ``;
    for (let i = 0; i < subtasksDialog.length; i++) {
      document.getElementById('added-subtasks').innerHTML += `<div id="outer-container-${i}" class="subtask-help-outer-container">
                                                                <li id="subtask${i}" class="subtask-help-inner-container">${subtasksDialog[i]['title']}</li>
                                                                <div id="edit-images-${i}" class="edit-images-area-subtasks">
                                                                    <div><img id="pen-${i}" onclick="prepareEditSubtask('${i}')"src="./assets/img/subtaskedit.svg"></div>|
                                                                    <div><img id="trash-${i}" onclick="deleteSubtask('${i}')" src="./assets/img/subtaskdelete.svg"></div>
                                                                </div> 
                                                              </div>`;
    }
}


/**
 * Deletes one added subtask from preparing
 * 
 * @param {number} i 
 */
function deleteSubtask(i){
subtasksDialog.splice(i, 1);
renderAddedSubtasks();
}


/**
 * Prepares the choosen subtask divs to edit it
 * @param {} i 
 */
function prepareEditSubtask(i){
let oldSubtask = document.getElementById(`subtask${i}`);
// oldSubtask.innerHTML = ``;
oldSubtask.innerHTML = `<input class="subtask-edit-input" id="new-subtask-for-edit-${i}" value="${oldSubtask.innerText}">`;
document.getElementById(`edit-images-${i}`).innerHTML = `<div><img id="trash-${i}" onmousedown="deleteSubtask('${i}')" src="./assets/img/subtaskdelete.svg"></div>
                                                          |
                                                          <div><img id="check-${i}" onmousedown="confirmEditSubtask('${i}')" src="./assets/img/subtaskcheck.svg"></div>`

document.getElementById(`outer-container-${i}`).classList.add('choosen-input');
document.getElementById(`new-subtask-for-edit-${i}`).focus();
document.getElementById(`new-subtask-for-edit-${i}`).addEventListener('blur', function() {
  renderAddedSubtasks();
  ;
});
}


/**
 * Confirms the editing and changes the array
 * @param {} i 
 */
function confirmEditSubtask(i){
subtasksDialog.splice(i, 1, {"title": document.getElementById(`new-subtask-for-edit-${i}`).value, "done": "false"});
renderAddedSubtasks();
}


/**
 * Colors the urgent-area and uncolors the other areas
 */
function colorPrioUrgent() {
  document.getElementById('prio-urgent').classList.add('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}


/**
 * Colors the medium-area and uncolors the other areas
 */
function colorPrioMedium() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.add('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}


/**
 * Colors the low-area and uncolors the other areas
 */
function colorPrioLow() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.add('prio-active-low');
}


/**
 * Designs the subtasks input to focus-mode
 */
function openAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.add('d-none');
  document.getElementById('add-button-icon-cancel').classList.remove('d-none');
  document.getElementById('add-button-icon-check').classList.remove('d-none');
  document.getElementById('subtasks').focus();
}


/**
 * Designs the subtasks input to blur-mode
 */
function cancelAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.remove('d-none');
  document.getElementById('add-button-icon-cancel').classList.add('d-none');
  document.getElementById('add-button-icon-check').classList.add('d-none');
}


function clearTasks() {
  document.getElementById('input-title').value = ``;
  document.getElementById('input-description').value = ``;
  clearCheckboxes()
  document.getElementById('deadline').value = ``;
  colorPrioMedium();
  prioDialog = "medium";
  document.getElementById('category').innerHTML = emptyCategory();
  document.getElementById('subtasks').innerHTML = ``;
  document.getElementById('subtasks').value = ``;
  cancelAddSubtask();
  document.getElementById('added-subtasks').innerHTML = ``;
  subtasksDialog = [];
}


/**
 * Clears the Checkboxes-Inputs
 */
function clearCheckboxes() {
  let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
  checkboxes.forEach(el => el.checked = false);
  checkedContactsCirclesDialog = [];
  document.getElementById('circle-area-assigned-contacts').innerHTML = ``;
}


/**
 * Sets category on default
 * 
 * @returns empty Category-Input
 */
function emptyCategory() {
  return /*html*/`
  <option value="" disabled selected hidden>Select your option</option>
  <option value="Technical Task">Technical Task</option>
  <option value="User Story">User Story</option>`
}


/**
 * Gives User-Feedback
 */
function launchToaster() {
  let x = document.getElementById("toaster-task-board")
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
    window.location.href = 'board.html';
  }, 2000);
}