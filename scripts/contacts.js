const BASE_URL = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = [];
let initials = [];
let IDs;
let currentContact;
let IdForEditing;
let letterForEditing;
let randomNumbers = [];


async function loadContacts() {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();

    if (responseToJson) {
        contacts = json2arrayContacts(responseToJson);
        document.getElementById('contacts-alphabet-list').innerHTML = ``;

        let n = 0;
        while (n < contacts.length) {
            IDs = json2arrayIDs(contacts[n]);
            let oneContact = json2arrayIDs(contacts[n]);
            let letterForCards = oneContact[0]['initials'].charAt(0);
            
            IDs.sort((a, b) => a.name.localeCompare(b.name));
           
            document.getElementById('contacts-alphabet-list').innerHTML += `
           <div>
                <div class="contact-card-letter">
                     ${letterForCards}
                </div>
                <div id="contacts-${letterForCards}-content" class="letter-card">
                </div>
           </div>`;
        

            for (let i = 0; i < IDs.length; i++) {
                document.getElementById(`contacts-${letterForCards}-content`).innerHTML += `
                <div id="${IDs[i]['id']}" class="contact-datas" onclick="chooseContact(\'${IDs[i]['id']}\', \'${IDs[i]['name']}\', \'${IDs[i]['email']}\', \'${IDs[i]['phone']}\', \'${IDs[i]['initials']}\', \'${IDs[i]['color']}\')">
                    <div class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}</div>
                    <div>
                        <div class="contact-card-names">${IDs[i]['name']}</div>
                        <a href='mailto:${IDs[i]['email']}'>${IDs[i]['email']}</a>
                    </div>
                </div>`;
                if(currentContact == IDs[i]['id']){
                    document.getElementById(IDs[i]['id']).classList.add('bg-dark-blue')
                }
            }
            n++;
        }
    } else {
        document.getElementById('contacts-alphabet-list').innerHTML = ``;
    }
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
        result.push(contact);
    });
    return result;
}


function pushArrays(index) {
    currentObject = contacts[index];
}


function chooseContact(id, name, email, phone, inits, color) {
    let oldContact;
    if (currentContact) {
        oldContact = currentContact;
    }
    currentContact = id;
    if(currentContact == oldContact){
        document.getElementById(oldContact).classList.remove('bg-dark-blue');
        currentContact = "";
        document.getElementById('choosen-contact-loading-area').innerHTML = ``;
    }else{
        document.getElementById(currentContact).classList.add('bg-dark-blue');
        loadChoosenContact(id, name, email, phone, inits, color);
    }

    loadContacts();
    
    
}


function loadChoosenContact(id, name, email, phone, inits, color) {
    let letter = inits.charAt(0);
    document.getElementById('choosen-contact-loading-area').innerHTML = /*html*/`
        <div class="choosen-contact-card">
            <div class="circle-big circle-${color}">${inits}</div>
            <div class="choosen-contact-name-area">
                <div id="choosen-contacts-name">${name}</div>
                <div class="edit-area">
                    <div class="edit-area-field"onclick="openEditContact('${id}', '${letter}', '${name}', '${email}', '${phone}', '${inits}', '${color}')"><img src="./assets/img/edit.svg" alt="edit-icon">Edit</div>
                    <div class="edit-area-field" onclick="deleteContact('${id}', '${letter}')"><img src="./assets/img/delete.svg" alt="delete-icon">Delete</div>
                </div>
            </div>
        </div>
        <div class="contact-information">Contact Information</div>
        <div>
            <div class="mail-and-phone">Email</div>
            <a class="mail-choosen" href="mailto:${email}">${email}</a>
        </div>
        <div>
            <div class="mail-and-phone">Phone</div>
            <a href="tel:${phone}" class="phone-choosen" id="choosen-phone">${phone}</a>
        </div>`;
}


function openAddContact() {
    document.getElementById('add-contact-dialog').classList.remove('d-none');
}


function closeAddContact() {
    document.getElementById('add-contact-name').value = ``;
    document.getElementById('add-contact-email').value = ``;
    document.getElementById('add-contact-phone').value = ``;
    document.getElementById("add-contact-dialog").classList.add('d-none');
}


function openEditContact(id, letter, name, email, phone, inits, color) {
    document.getElementById('edit-contact-name').value = name;
    document.getElementById('edit-contact-email').value = email;
    document.getElementById('edit-contact-phone').value = phone;
    document.getElementById('edit-contact-dialog').classList.remove('d-none');
    document.getElementById('edit-initials').classList.add(`circle-${color}`);
    document.getElementById('edit-initials').innerHTML = inits;;

    IdForEditing = id;
    letterForEditing = letter;
}


async function submitEditetContact() {
    let name = document.getElementById('edit-contact-name');
    let email = document.getElementById('edit-contact-email');
    let phone = document.getElementById('edit-contact-phone');
   
    createInitials(name.value);
    let initialsForSaving = initials.join('').toUpperCase();
    let path = `/letter${letterForEditing}/${IdForEditing}`
    let color = createColor();
    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving, color: color });
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadContacts();
    loadChoosenContact(IdForEditing, name.value, email.value, phone.value, initialsForSaving, color);
    closeEditContact();
    return responseToJson = await response.json();
}

function closeEditContact() {
    document.getElementById("edit-contact-dialog").classList.add('d-none');
    document.getElementById('edit-initials').removeAttribute("class");
}


async function createContact(path = "", data = {}) {
    let name = document.getElementById('add-contact-name');
    let email = document.getElementById('add-contact-email');
    let phone = document.getElementById('add-contact-phone');
    let letter = name.value.charAt(0).toUpperCase();
    path = `/letter${letter}`
    createInitials(name.value);
    let initialsForSaving = initials.join('').toUpperCase();
    let color = createColor();

    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving, color: color });

    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadContacts();

    return responseToJson = await response.json();
}


function createInitials(name) {
    let words = name.split(" ");
    initials = [];

    words.length = 2;
    words.forEach((element) => initials.push(element.charAt(0)));
}


async function deleteContact(id, letter) {
    await fetch(`${BASE_URL}/letter${letter}/${id}.json`, {
        method: "DELETE"
    });
    oldContact = ``;
    currentContact = ``;
    document.getElementById('choosen-contact-loading-area').innerHTML = ``;
    loadContacts();
}



function createColor() {
    let color;
    let colorNumber = createRandomNumbers();
    if (colorNumber == 1) {
        color = "yellow";
    } else if (colorNumber == 2) {
        color = "orange";
    } else if (colorNumber == 3) {
        color = "turquoise";
    } else if (colorNumber == 4) {
        color = "purple";
    } else if (colorNumber == 5) {
        color = "lightpurple";
    } else if (colorNumber == 6) {
        color = "blue";
    } else if (colorNumber == 7) {
        color = "lightblue";
    } else if (colorNumber == 8) {
        color = "pink";
    } else if (colorNumber == 9) {
        color = "lightred";
    } else if (colorNumber == 10) {
        color = "green";
    };
    return color;
}


function createRandomNumbers() {
    if (randomNumbers.length > 9) {
        randomNumbers = [];
    }
    let n = randomNumbers.length - 1;
    let finalNumber = randomNumbers.length;
    while (n < finalNumber) {
        let x = Math.floor((Math.random() * 10) + 1);
        if (!randomNumbers.includes(x)) {
            randomNumbers.push(x);
            n++;
        }
    }
    let colorNumber = randomNumbers[randomNumbers.length - 1];
    return colorNumber;
}

