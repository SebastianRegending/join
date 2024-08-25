const BASE_URL = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts"
let contacts = [];
let initials = [];
let IDs;
let currentContact;

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
            console.log(IDs)
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
                <div id="${IDs[i]['email']}" class="contact-datas" onclick="chooseContact(\'${IDs[i]['id']}\', \'${IDs[i]['name']}\', \'${IDs[i]['email']}\', \'${IDs[i]['phone']}\', \'${IDs[i]['initials']}\')">
                    <div class="initials">${IDs[i]['initials']}</div>
                    <div>
                        <div class="contact-card-names">${IDs[i]['name']}</div>
                        <a href='mailto:${IDs[i]['email']}'>${IDs[i]['email']}</a>
                    </div>
                </div>`;
            }
            n++;
        }
    } else {
        document.getElementById('contacts-alphabet-list').innerHTML = ``
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

function chooseContact(id, name, email, phone, initials) {
    let oldContact;
    if (currentContact) {
        oldContact = currentContact;
    }
    currentContact = email;

    document.getElementById(currentContact).classList.add('bg-dark-blue');
    if (oldContact) {
        document.getElementById(oldContact).classList.remove('bg-dark-blue');
    }
    loadChoosenContact(id, name, email, phone, initials);
}


function loadChoosenContact(id, name, email, phone, initials) {
    let letter = initials.charAt(0);
    document.getElementById('choosen-contact-loading-area').innerHTML = /*html*/`
        <div class="choosen-contact-card">
            <div class="initials-big">${initials}</div>
            <div class="choosen-contact-name-area">
                <div id="choosen-contacts-name">${name}</div>
                <div class="edit-area">
                    <div class="edit-area-field"><img src="./assets/img/edit.svg" alt="edit-icon">Edit</div>
                    <div class="edit-area-field"><img src="./assets/img/delete.svg" alt="delete-icon" onclick="deleteContact('${id}', '${letter}')">Delete</div>
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
    document.getElementById("add-contact-dialog").classList.remove('d-none')
}

function closeAddContact() {
    document.getElementById('add-contact-name').value = ``;
    document.getElementById('add-contact-email').value = ``;
    document.getElementById('add-contact-phone').value = ``;
    document.getElementById("add-contact-dialog").classList.add('d-none')
}

async function createContact(path = "", data = {}) {
    let name = document.getElementById('add-contact-name');
    let email = document.getElementById('add-contact-email');
    let phone = document.getElementById('add-contact-phone');
    let letter = name.value.charAt(0).toUpperCase();
    path = `/letter${letter}`

    createInitials(name.value);

    let initialsForSaving = initials.join('').toUpperCase();


    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving });

    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    return responseToJson = await response.json();
}


function createInitials(name) {
    let words = name.split(" ");
    initials = [];

    words.length = 2;
    words.forEach((element) => initials.push(element.charAt(0)));

}

async function deleteContact(id, letter) {

    console.log(`${BASE_URL}/contacts/letter${letter}/${id}.json`);
    await fetch(`${BASE_URL}/letter${letter}/${id}.json`, {
        method: "DELETE"
    });
    oldContact = ``;
    currentContact = ``;
    document.getElementById('choosen-contact-loading-area').innerHTML = ``;
    loadContacts();
}


