
let contacts = [];
let IDs;
let expanded = false;
let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
//let BASE_URL = 

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
                       <input type="checkbox" id="$contact-${i}" />${IDs[i]['name']}</label>`;
      console.log(IDs);

    }

    n++

  }
}

function addTask() {
  let title = document.getElementById('input-title');
  let description = document.getElementById('input-description');
  let assignedContacts = [];


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
    result.push(json[key]);
  });
  return result;
}