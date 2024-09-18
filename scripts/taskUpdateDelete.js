let expandedEdit = false;
let prioEdit;
let contactIds = [];
let subtasksEdit = [];
let checkedContactsCirclesEdit = [];
let cat;
let assignedContactsEdit = [];
let assignedContactsEditObjects = [];
let progEdit;
let currentId;
let allContacts = [];


async function deleteTask(id) {
    let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
    await fetch(`${URL_tasks}/${id}.json`, {
        method: "DELETE"
    });
    closePopUpEdit();
    loadTasks();
}


async function prepareEditTask(id, title, description, contacts, deadline, prio, category, subtasks, progress) {
    await initAssignedContacts(id);
    document.getElementById('pop-up-content-edit-container').classList.remove('d-none');
    loadContactsEdit();
    cat = category;
    progEdit = progress;
    currentId = id;
    document.getElementById('pop-up-content-edit').innerHTML = generateEditPage(id, title, description, contacts, deadline, prio, category, subtasks);
    setPrioEdit(prio);
    for(let i = 0; i < subtasksEdit.length; i++){
    document.getElementById('added-subtasks-edit').innerHTML += `<li>${subtasksEdit[i]['title']}</li>`;
    }
 }


 async function loadContactsEdit() {
    allContacts = [];
    let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
    let response = await fetch(URL_contacts + ".json");
    let responseToJson = await response.json();
    let contactsToConvertLetters = jsonToArrayContacts(responseToJson);
    let compare = sessionStorage.getItem("userId");
    for (let n = 0; n < contactsToConvertLetters.length; n++) {
        IDs = jsonToArrayIDs(contactsToConvertLetters[n]);
        for (let i = 0; i < IDs.length; i++) {
            if (compare && compare == IDs[i]['userid']) {
                document.getElementById('checkboxes-edit').innerHTML += createContactsCheckboxTemplateYou(n, i);
            } else {
                document.getElementById('checkboxes-edit').innerHTML += createContactsCheckboxTemplate(n, i);
            }
            allContacts.push(IDs[i]);
        }
    }
    for (let i = 0; i < assignedContactsEdit.length; i++) {
        let objectContact = allContacts.find(e => e.id == assignedContactsEdit[i]);
        assignedContactsEditObjects.push(objectContact);
    }
    document.getElementById('circle-area-assigned-contacts-edit').innerHTML = '';
    if (assignedContactsEditObjects.length > 6) {
      for (let i = 0; i < 6; i++) {
        document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-${assignedContactsEditObjects[i]['color']} assigned-contacts z${i + 1}">${assignedContactsEditObjects[i]['initials']}</div>`;
      }
      document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-grey assigned-contacts z${7}">+${assignedContactsEditObjects.length - 6}</div>`
    } else {
        for (let i = 0; i < assignedContactsEditObjects.length; i++) {
            document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-${assignedContactsEditObjects[i]['color']} assigned-contacts z${i + 1}">${assignedContactsEditObjects[i]['initials']}</div>`;
        }
    }
}


async function initAssignedContacts(id){
    let response = await fetch (`https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`);
    let responseToJson = await response.json();
    let contactsArray = responseToJson.contacts || [];

    for(let i = 0; i < contactsArray.length; i++){
        assignedContactsEdit.push(contactsArray[i]['id']);
    }
}



function addCircleEdit(color, contactId, inits, id) {

    document.getElementById('circle-area-assigned-contacts-edit').innerHTML = ``;

    let check = document.getElementById(contactId);

    if (check.checked == true) {
        assignedContactsEditObjects.push({ "id": id, "color": color, "initials": inits });
    } else {
        assignedContactsEditObjects.splice(assignedContactsEditObjects.findIndex(item => item.id === id), 1);
    }
    document.getElementById('circle-area-assigned-contacts-edit').innerHTML = ``;
    if (assignedContactsEditObjects.length > 6) {
      for (let i = 0; i < 6; i++) {
        document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-${assignedContactsEditObjects[i]['color']} assigned-contacts z${i + 1}">${assignedContactsEditObjects[i]['initials']}</div>`;
      }
      document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-grey assigned-contacts z${7}">+${assignedContactsEditObjects.length - 6}</div>`
    } else {
      for (let i = 0; i < assignedContactsEditObjects.length; i++) {
        document.getElementById('circle-area-assigned-contacts-edit').innerHTML += `<div class="circle circle-${assignedContactsEditObjects[i]['color']} assigned-contacts z${i + 1}">${assignedContactsEditObjects[i]['initials']}</div>`;
      }
    }
}




  /**
 * Searches for selected checkboxes and pushs them in an array
 * 
 * @returns selected checkboxes
 */
  function getSelectedEdit() {
    let checkboxes = document.querySelectorAll('input[name="contactsedit"]:checked');
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


function showCheckboxesEdit() {
    let checkboxes = document.getElementById("checkboxes-edit");
    if (!expandedEdit) {
      checkboxes.style.display = "block";
      expandedEdit = true;
    } else {
      checkboxes.style.display = "none";
      expandedEdit = false;
    }
  }


   /**
 * Designs the subtasks input to focus-mode
 */
 function openAddSubtaskEdit() {
    document.getElementById('add-button-icon-plus-edit').classList.add('d-none');
    document.getElementById('add-button-icon-cancel-edit').classList.remove('d-none');
    document.getElementById('add-button-icon-check-edit').classList.remove('d-none');
    document.getElementById('subtasks-edit').focus();
  }
  
/**
 * Adds one subtask to subtask-array and loads it to subtask-html-area
 */
function addSubtaskEdit() {
    let subtask = document.getElementById('subtasks-edit');
    if (subtask.value) {
      let subtaskobject = { title: `${subtask.value}`, done: "false" };
      subtasksEdit.push(subtaskobject);
      document.getElementById('added-subtasks-edit').innerHTML = ``;
      for (let i = 0; i < subtasksEdit.length; i++) {
        document.getElementById('added-subtasks-edit').innerHTML += `<li>${subtasksEdit[i]['title']}</li>`;
      }
      document.getElementById('subtasks-edit').value = ``;
      cancelAddSubtaskEdit()
    }
  }

  /**
 * Designs the subtasks input to blur-mode
 */
function cancelAddSubtaskEdit() {
    document.getElementById('add-button-icon-plus-edit').classList.remove('d-none');
    document.getElementById('add-button-icon-cancel-edit').classList.add('d-none');
    document.getElementById('add-button-icon-check-edit').classList.add('d-none');
  }


  async function submitEditetTask(){
    let title = document.getElementById('input-title-edit').value;
    let description = document.getElementById('input-description-edit').value;
    let deadline = document.getElementById('input-deadline-edit').value;
    let assignedContactsForUpdate = getSelectedEdit();
    let URL_tasksput = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
    let neededId = currentId;
    data = ({ title: title, description: description, deadline: deadline, prio: prioEdit, category: cat, contacts: assignedContactsForUpdate, subtasks: subtasksEdit, progress: progEdit });

    let response = await fetch(`${URL_tasksput}/${neededId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    closePopUpEdit();
    loadTasks();
    return response;
  }

  
  function closePopUpEdit(){
         document.getElementById('pop-up-content-edit-container').classList.add('d-none'); 
        subtasksEdit = [];
        contactIds = [];
        checkedContactsCirclesEdit = [];
        assignedContactsEdit = [];
        assignedContactsEditObjects = [];
        closePopUp();
  }
