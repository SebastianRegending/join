/**
 * Returns Letter-Template in HTML
 * 
 * @param {string} letterForCards - First letter of the following contacts
 * @returns Letter-Template in HTML
 */
function createLetterTemplate(letterForCards) {
    return /*html*/`
        <div class="help-width">
            <div class="contact-card-letter">
             ${letterForCards}
            </div>
            <div id="contacts-${letterForCards}-content" class="letter-card">
            </div>
        </div>
        `
}

/**
 * Returns Contact-Template in HTML
 * 
 * @param {number} i - index of the for-loop that interates through the contacts
 * @returns Contact-Template in HTML
 */
function createContactTemplate(i){
    return /*html*/`
        <div id="${IDs[i]['id']}" class="contact-datas" onclick="chooseContact(\'${IDs[i]['id']}\', \'${IDs[i]['name']}\', \'${IDs[i]['email']}\', \'${IDs[i]['phone']}\', \'${IDs[i]['initials']}\', \'${IDs[i]['color']}\')">
            <div class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
            </div>
            <div>
                <div id="name-area-${IDs[i]['id']}" class="contact-card-names">${IDs[i]['name']}
                </div>
                <a href='mailto:${IDs[i]['email']}'>${IDs[i]['email']}
                </a>
            </div>
        </div>
        `
}

/**
 * Returns Contact-Template in HTML with additional YOU
 * 
 * @param {number} i - index of the for-loop that interates through the contacts
 * @returns Contact-Template in HTML
 */
function createContactTemplateYou(i){
    return /*html*/`
        <div id="${IDs[i]['id']}" class="contact-datas" onclick="chooseContact(\'${IDs[i]['id']}\', \'${IDs[i]['name']} (YOU)\', \'${IDs[i]['email']}\', \'${IDs[i]['phone']}\', \'${IDs[i]['initials']}\', \'${IDs[i]['color']}\')">
            <div class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
            </div>
            <div>
                <div id="name-area-${IDs[i]['id']}" class="contact-card-names">${IDs[i]['name']}(You)
                </div>
                <a href='mailto:${IDs[i]['email']}'>${IDs[i]['email']}
                </a>
            </div>
        </div>
        `
}

/**
 * Creates the Choosen-Contact HTML  Template
 * 
 * @param {string} letter 
 * @param {string} id 
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} inits 
 * @param {string} color 
 * @returns HTNML Template for choosen contact
 */
function createChoosenContactTemplate(letter, id, name, email, phone, inits, color){
    return /*html*/`
        <div class="choosen-contact-card-container">
            <div class="choosen-contact-card">
                <div class="circle-big circle-${color}">${inits}
                </div>
                <div class="choosen-contact-name-area">
                    <div id="choosen-contacts-name">${name}
                    </div>
                    <div class="edit-area">
                        <div class="edit-area-field"onclick="openEditContact('${id}', '${letter}', '${name}', '${email}', '${phone}', '${inits}', '${color}')"><img src="./assets/img/edit.svg" alt="edit-icon">Edit
                        </div>
                        <div class="edit-area-field" onclick="deleteContact('${id}', '${letter}')"><img src="./assets/img/delete.svg" alt="delete-icon">Delete
                        </div>
                    </div>
                </div>
            </div>
            <div class="contact-information">Contact Information
            </div>
            <div>
                <div class="mail-and-phone">Email
                </div>
                <a class="mail-choosen" href="mailto:${email}">${email}
                </a>
            </div>
            <div>
                <div class="mail-and-phone">Phone
                </div>
                <a href="tel:${phone}" class="phone-choosen" id="choosen-phone">${phone}
                </a>
            </div>
        </div>
        <div id="options-dialog" class="edit-area-field-resp-container d-none">
             <div class="edit-area-field-resp-help-container">
                    <div class="edit-area-field-resp" onclick="openEditContact('${id}', '${letter}', '${name}', '${email}', '${phone}', '${inits}', '${color}')"><img src="./assets/img/edit.svg" alt="edit-icon">Edit</div>
                    <div class="edit-area-field-resp" onclick="deleteContact('${id}', '${letter}')"><img src="./assets/img/delete.svg" alt="delete-icon">Delete</div>
            </div>

        </div>
        <div onclick="openOptions()" class="options-button-resp"><img src="./assets/img/more_vert.svg" alt="contacts options"></div>
        <div id="bg-small-dialog" class="d-none"></div>
    `

}
