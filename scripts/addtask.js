
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
      <label for="$contact-${i}">
                       <input type="checkbox" name="contacts" value="${IDs[i]['name']}" id="$contact-${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}"/>${IDs[i]['name']}</label>`;
                      // console.log(IDs[i]['id']);

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

async function uploadTask(title, description, deadline, category){
  
  data = ({ title: title.value, description: description.value, deadline: deadline.value, prio: prio, category: category.value, contacts: contactsArray});

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

function setPrio(priority){
  prio = priority;
}


function getSelected() {

  let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
    let selectedData = [];
  
  checkboxes.forEach((checkbox) => {

      let name = checkbox.value;
      let id = checkbox.getAttribute('data-id');
      let letter = checkbox.getAttribute('data-letter');
      
      contactsArray.push({name: name, id: id, letter: letter});
      console.log(contactsArray);
     // return selectedData;
  });
 

}