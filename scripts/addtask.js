
let contacts = [];
let expanded = false;
let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let BASE_URL = 
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

async function loadContacts(){
    let response = await fetch(URL_contacts + ".json");
    let responseToJson = await response.json();
    
    let contacts = json2arrayContacts(responseToJson);
    console.log(contacts);
    fillContacts();
}

function addTask (){
let title = document.getElementById('input-title');
let description = document.getElementById('input-description');
let assignedContacts = [];


}

async function fillContacts(responseToJson){
    let contactsToConvert = json2arrayContacts(responseToJson);
    let n = 0;
   // while(n < response)
    let IDs = json2arrayIDs(contactsToConvert);
    console.log(contacts);
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