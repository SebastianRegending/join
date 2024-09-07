let contacts = [];
let IDs;
let expanded = false;
let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let prio = "medium";
let contactsArray = [];
let subtasks = [];
let taskID = [];
let checkedContacts = [];
let checkedContactsColors = [];
let checkedContactsInits = [];
let progress = "To Do";



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

async function loadContacts() {
  let response = await fetch(URL_contacts + ".json");
  let responseToJson = await response.json();

  let contactsToConvert = json2arrayContacts(responseToJson);
  let n = 0;
  while (n < contactsToConvert.length) {

    IDs = json2arrayIDs(contactsToConvert[n])
    for (let i = 0; i < IDs.length; i++) {

      document.getElementById('checkboxes').innerHTML += `
      <label for="contacts${n}" class="contact-for-form">
          <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}</div>
          <div>${IDs[i]['name']}</div> 
          <input class="input-check" type="checkbox" name="contacts" value="${IDs[i]['name']}" id="contact-${n}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" onclick="addCircle('${IDs[i]['color']}', 'contact-${n}', '${IDs[i]['initials']}')"/>
      </label>`;

    }
    n++
  }
}


function addCircle(color, id, inits) {
  let check = document.getElementById(id);

  if (check.checked == true) {
    checkedContacts.push(id);
    checkedContactsColors.push(color);
    checkedContactsInits.push(inits);
  }
  else {
    let indexForSplicing = checkedContacts.findIndex(item => item === id);
    checkedContacts.splice(indexForSplicing, 1);
    checkedContactsColors.splice(indexForSplicing, 1);
    checkedContactsInits.splice(indexForSplicing, 1);
  }
  document.getElementById('circle-area-assigned-contacts').innerHTML = ``;

  for (let i = 0; i < checkedContacts.length; i++) {
    document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-${checkedContactsColors[i]} assigned-contacts z${i + 1}">${checkedContactsInits[i]}</div>`;
  }
}

async function addTask() {
  let title = document.getElementById('input-title');
  let description = document.getElementById('input-description');
  let assignedContacts = getSelected();
  let deadline = document.getElementById('deadline');

  let category = document.getElementById('category');

  await uploadTask(title, description, deadline, category, assignedContacts);


  await updateContactsTask(assignedContacts);
}



async function uploadTask(title, description, deadline, category, assignedContacts) {

  data = ({ title: title.value, description: description.value, deadline: deadline.value, prio: prio, category: category.value, contacts: assignedContacts, subtasks: subtasks, progress: progress  });

  let response = await fetch(URL_tasks + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  let responseToJson = await response.json();

  if (responseToJson['tasks']) {
    responseToJson['tasks'].forEach(task => {
      taskID.push(task);
    });
  }

  taskID.push(responseToJson['name']);
  return responseToJson;
}


function json2arrayContacts(json) {
  let result = [];
  let keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

function json2arrayIDs(json) {
  let result = [];
  let keys = Object.keys(json);
  keys.forEach(function (key) {
    let contact = json[key];
    contact.id = key;
    result.push(json[key]);
  });
  return result;
}

function setPrio(priority) {
  prio = priority;
}


function getSelected() {

  let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
  let selectedData = [];

  checkboxes.forEach((checkbox) => {

    let name = checkbox.value;
    let id = checkbox.getAttribute('data-id');
    let letter = checkbox.getAttribute('data-letter');

    selectedData.push({ name: name, id: id, letter: letter });


  });
  return selectedData;
}


function addSubtask() {
  let subtask = document.getElementById('subtasks');
  subtasks.push(subtask.value);
  document.getElementById('added-subtasks').innerHTML = ``;
  for (let i = 0; i < subtasks.length; i++) {
    document.getElementById('added-subtasks').innerHTML += `<li>${subtasks[i]}</li>`;
  }
  document.getElementById('subtasks').value = ``;
  cancelAddSubtask()
}


function colorPrioUrgent() {
  document.getElementById('prio-urgent').classList.add('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}


function colorPrioMedium() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.add('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}

function colorPrioLow() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.add('prio-active-low');
}

function openAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.add('d-none');
  document.getElementById('add-button-icon-cancel').classList.remove('d-none');
  document.getElementById('add-button-icon-check').classList.remove('d-none');
  document.getElementById('subtasks').focus();
}


function cancelAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.remove('d-none');
  document.getElementById('add-button-icon-cancel').classList.add('d-none');
  document.getElementById('add-button-icon-check').classList.add('d-none');
}


async function updateContactsTask(assignedContacts) {
  for (let contact of assignedContacts) {
    let path = `/letter${contact['letter']}/${contact['id']}`;
    let response = await fetch(URL_contacts + path + ".json");
    let responseToJson = await response.json();
    uploadNewData(responseToJson, path)
  }
}


async function uploadNewData(dataForUpdate, path) {
  let data = ({ name: dataForUpdate['name'], email: dataForUpdate['email'], phone: dataForUpdate['phone'], initials: dataForUpdate['initials'], color: dataForUpdate['color'], tasks: taskID});

  let response = await fetch(URL_contacts + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return responseToJson = await response.json();
}

function clearTasks(){
document.getElementById('input-title').value = ``;
document.getElementById('input-description').value = ``;
let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
checkboxes.forEach(el => el.checked = false);
checkedContacts = [];
checkedContactsColors = [];
checkedContactsInits = [];
document.getElementById('circle-area-assigned-contacts').innerHTML = ``;
document.getElementById('deadline').value = ``;
colorPrioMedium();
prio = "medium";
document.getElementById('category').innerHTML = `<option value="" disabled selected hidden>Select your option</option>
                    <option value="Technical Task">Technical Task</option>
                    <option value="User Story">User Story</option>`;
document.getElementById('subtasks').innerHTML = ``;
document.getElementById('added-subtasks').innerHTML = ``;
subtasks = [];
}


