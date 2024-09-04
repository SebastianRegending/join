
let contacts = [];
let IDs;
let expanded = false;
let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let prio = "medium";
let contactsArray = [];
let subtasks = [];

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
      <label  for="contacts${i}" class="contact-for-form">
          <div class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}</div>
          <div>${IDs[i]['name']}</div> 
          <input class="input-check" type="checkbox" name="contacts${i}" value="${IDs[i]['name']}" id="$contact-${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}"/>
      </label>`;

    }

    n++
  }
}

function addTask() {
  let title = document.getElementById('input-title');
  let description = document.getElementById('input-description');
  let assignedContacts = getSelected();
  let deadline = document.getElementById('deadline');

  let category = document.getElementById('category');


  uploadTask(title, description, deadline, category);

}

async function uploadTask(title, description, deadline, category) {

  data = ({ title: title.value, description: description.value, deadline: deadline.value, prio: prio, category: category.value, contacts: contactsArray, subtasks: subtasks });

  let response = await fetch(URL_tasks + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });


  return responseToJson = await response.json();
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

    contactsArray.push({ name: name, id: id, letter: letter });
    console.log(contactsArray);
    // return selectedData;
  });


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


function colorPrioUrgent(){
  document.getElementById('prio-urgent').classList.add('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}


function colorPrioMedium(){
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.add('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}

function colorPrioLow(){
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


function cancelAddSubtask(){
  document.getElementById('add-button-icon-plus').classList.remove('d-none');
  document.getElementById('add-button-icon-cancel').classList.add('d-none');
  document.getElementById('add-button-icon-check').classList.add('d-none');

}

