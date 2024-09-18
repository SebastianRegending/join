const BASE_URL = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts = [];
let initials = [];
let IDs;
let currentContact;
let IdForEditing;
let letterForEditing;
let randomNumbers = [];
let tasks = [];


/**
 * Loads the saved contacts from the database and converts it into a JSON
 */
async function loadContacts() {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    prepareRenderContacts(responseToJson);
}


/**
 * Makes the global variable contacts an array with all contacts, empties the contacts area, makes the global variable IDs the current prepared letter-IDs
 * 
 * @param {json} responseToJson - loaded and converted JSON from Database, including the saved contacts
 */
function prepareRenderContacts(responseToJson) {
    if (responseToJson) {
        contacts = jsonToArrayContacts(responseToJson);
        document.getElementById('contacts-alphabet-list').innerHTML = ``;

        for (let n = 0; n < contacts.length; n++) {
            IDs = jsonToArrayIDs(contacts[n]);
            let letterForCards = jsonToArrayIDs(contacts[n])[0]['initials'].charAt(0);
            IDs.sort((a, b) => a['name'].localeCompare(b['name']));
            renderContacts(letterForCards);
        }
    } else {
        document.getElementById('contacts-alphabet-list').innerHTML = ``;
    }
}


/**
 * Add an HTML-Template to the letter-headline and the following contacts, add bg-dark-blue css class to the current choosen contact
 * 
 * @param {string} letterForCards - First letter of the following contacts
 */
function renderContacts(letterForCards) {
    let compare = sessionStorage.getItem("userId");
    document.getElementById('contacts-alphabet-list').innerHTML += createLetterTemplate(letterForCards);
    for (let i = 0; i < IDs.length; i++) {
        if (compare && compare == IDs[i]['userid']) {
            document.getElementById(`contacts-${letterForCards}-content`).innerHTML += createContactTemplateYou(i);
        } else {
            document.getElementById(`contacts-${letterForCards}-content`).innerHTML += createContactTemplate(i);
        }
        if (currentContact == IDs[i]['id']) {
            document.getElementById(IDs[i]['id']).classList.add('bg-dark-blue')
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
        result.push(contact);
    });
    return result;
}


/**
 * Defines the variable oldContact to compare it with the global variable currentContact, to decide what templates has to change the color
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} inits 
 * @param {string} color 
 */
function chooseContact(id, name, email, phone, inits, color) {
    let oldContact;
    if (currentContact) {
        oldContact = currentContact;
    }
    currentContact = id;
    if (currentContact == oldContact) {
        document.getElementById(oldContact).classList.remove('bg-dark-blue');
        currentContact = "";
        document.getElementById('choosen-contact-loading-area').innerHTML = ``;
    } else {
        document.getElementById(currentContact).classList.add('bg-dark-blue');
        loadChoosenContact(id, name, email, phone, inits, color);
    }
    loadContacts();
}


/**
 * defines the variable letter and loads the template into the choosen-contact-loading-area
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} inits 
 * @param {string} color 
 */
function loadChoosenContact(id, name, email, phone, inits, color) {
    let letter = inits.charAt(0);
    if (phone == "undefined"){
        phone = "no number";
    }
    document.getElementById('choosen-contact-loading-area').innerHTML = createChoosenContactTemplate(letter, id, name, email, phone, inits, color);
    if (window.innerWidth < 1001) {
        openChooseResp();
    }
}


/**
 * Open Dialog
 */
function openAddContact() {
    document.getElementById('add-contact-dialog').classList.remove('d-none');
    document.getElementById('add-contact-dialog').classList.add('show');
}


/**
 * Close Dialog
 */
function closeAddContact() {
    document.getElementById('add-contact-name').value = ``;
    document.getElementById('add-contact-email').value = ``;
    document.getElementById('add-contact-phone').value = ``;
    document.getElementById("add-contact-dialog").classList.add('hide');
    setTimeout(function () { document.getElementById('add-contact-dialog').classList.remove('show'); document.getElementById("add-contact-dialog").classList.add('d-none'); document.getElementById("add-contact-dialog").classList.remove('hide') }, 450);
}


/**
 * Puts the datas from the choosen contact in the inputfields and opens the dialog for editing. Set the global variables IdForEditing and letterForEditing to the current contact, to prepare later functions
 * 
 * @param {string} id 
 * @param {string} letter 
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} inits 
 * @param {string} color 
 */
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


/**
 * Defines some variables from the inputfields, to give them to the submit function, closes the dialog
 * 
 * @returns json of the editet contact
 */
async function prepareSubmitEditetContact() {
    let name = document.getElementById('edit-contact-name');
    let email = document.getElementById('edit-contact-email');
    let phone = document.getElementById('edit-contact-phone');
    createInitials(name.value);
    let initialsForSaving = initials.join('').toUpperCase();
    let path = `/letter${letterForEditing}/${IdForEditing}`
    let color = createColor();
    let response = await submitEditetContact(name, email, phone, initialsForSaving, color, path);
    loadContacts();
    loadChoosenContact(IdForEditing, name.value, email.value, phone.value, initialsForSaving, color);
    closeEditContact();
    return responseToJson = await response.json();
}


/**
 * Submit the editet contact to database
 * 
 * @param {*} name - new name
 * @param {*} email - new email
 * @param {*} phone - new phone
 * @param {*} initialsForSaving - new initials
 * @param {*} color - new color
 * @param {*} path - new path for saving in database
 * @returns editet contact
 */
async function submitEditetContact(name, email, phone, initialsForSaving, color, path) {
    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving, color: color });
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response;
}


/**
 * Close Dialog
 */
function closeEditContact() {
    document.getElementById("edit-contact-dialog").classList.add('d-none');
    document.getElementById('edit-initials').removeAttribute("class");
}


/**
 * Sets value of edit inputs to empty
 */
function deleteEditContact() {
    document.getElementById('edit-contact-name').value = ``;
    document.getElementById('edit-contact-email').value = ``;
    document.getElementById('edit-contact-phone').value = ``;

}


/**
 * Defines some variables from the inputfields, to give them to the createContact function
 * 
 * @param {*} path 
 * @returns json of the submittet contact
 */
async function prepareCreateContact(path = "") {
    let name = document.getElementById('add-contact-name');
    let email = document.getElementById('add-contact-email');
    let phone = document.getElementById('add-contact-phone');
    let letter = name.value.charAt(0).toUpperCase();
    path = `/letter${letter}`
    createInitials(name.value);
    let initialsForSaving = initials.join('').toUpperCase();
    let color = createColor();
    let tasks = [];
    let response = await createContact(name, email, phone, initialsForSaving, color, tasks, path);
    return responseToJson = await response.json();
}

/**
 * Submit the created contact to database
 * 
 * @param {string} name - name of the new contact
 * @param {string} email - email of the new contact
 * @param {string} phone - phone of the new contact
 * @param {string} initialsForSaving - initials of the new contact
 * @param {string} color - color for the circle of the new contact
 * @param {string} tasks - tasks of the new contact
 * @param {string} path - path where it will be saved on database
 * @returns submittet contact
 */
async function createContact(name, email, phone, initialsForSaving, color, tasks, path) {
    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving, color: color, tasks: tasks });
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    document.getElementById('toaster-contact').classList.add('show');
    setTimeout(function () { document.getElementById('toaster-contact').classList.remove('show'); }, 2000);
    loadContacts();
    return response;
}


/**
 * Creates initials with maximum two letters
 * 
 * @param {string} name - name of the contact that is used to create the initials
 */
function createInitials(name) {
    let words = name.split(" ");
    initials = [];
    words.length = 2;
    words.forEach((element) => initials.push(element.charAt(0)));
}


/**
 * Delete a contact im database
 * 
 * @param {string} id - id in database
 * @param {string} letter - letter to find the right path in database
 */
async function deleteContact(id, letter) {
    await fetch(`${BASE_URL}/letter${letter}/${id}.json`, {
        method: "DELETE"
    });
    oldContact = ``;
    currentContact = ``;
    document.getElementById('choosen-contact-loading-area').innerHTML = ``;
    loadContacts();
}

/**
 * Create a string of a color to choose the css-class
 * 
 * @returns random color
 */
function createColor() {
    let colorArray = ["yellow", "orange", "turquoise", "purple", "lightpurple", "blue", "lightblue", "pink", "lightred", "green"]
    let color = colorArray[createRandomNumbers()]
    return color;
}


/**
 * Creates a random Number, that will decide what color the circle gets
 * 
 * @returns random color-Number
 */
function createRandomNumbers() {
    if (randomNumbers.length > 9) {
        randomNumbers = [];
    }
    let n = randomNumbers.length - 1;
    let finalNumber = randomNumbers.length;
    while (n < finalNumber) {
        let x = Math.floor((Math.random() * 10));
        if (!randomNumbers.includes(x)) {
            randomNumbers.push(x);
            n++;
        }
    }
    let colorNumber = randomNumbers[randomNumbers.length - 1];
    return colorNumber;
}


/**
 * Opens choosen Contact Area via removing d-none
 */
function openChooseResp() {
    document.getElementById('choosen-contact').style.display = "block"
}


/**
 * Closes choosen Contact Area via adding d-none
 */
function closeChooseResp() {
    document.getElementById('choosen-contact').style.display = "none"
}

function startLogoAnimation() {
    let animatedLogo = document.getElementById('animated-logo');
    let animatedLogoContainer = document.getElementById('animated-logo-container');
    let loginPage = document.getElementById('loginpage');

    function applyStyles(element, styles, delay) {
        setTimeout(() => {
            Object.assign(element.style, styles);
        }, delay);
    }

    applyStyles(animatedLogo, { animation: "logoShrinkAndMove 1s forwards" }, 500);
    setTimeout(() => {
        loginPage.classList.replace('hidden', 'show');
        animatedLogoContainer.style.backgroundColor = 'transparent';
        animatedLogoContainer.classList.add('logo-behind');
    }, 800);
}
