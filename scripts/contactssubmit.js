function initInputs() {
    initInputName();
    initInputMail();
    initInputPhone();
    initInputNameEdit();
    initInputMailEdit();
    initInputPhoneEdit();
}

/**
 * Validates the name-Input
 */
function initInputName() {
listenerForFocusName();
listenerForBlurName();
listenerForInputName();
}

/**
 * Adds the Event Listener for the field input name, if its focussed
 */
function listenerForFocusName(){
    document.getElementById('add-contact-name').addEventListener("focus", function (e) {
        document.getElementById('add-contact-name-info').classList.remove("v-hidden");
        document.getElementById('add-contact-name-info').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input name, if its blurred
 */
function listenerForBlurName(){
    document.getElementById('add-contact-name').addEventListener("blur", function (e) {
        document.getElementById('add-contact-name-info').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input name, if it gets inputs
 */
function listenerForInputName(){
    document.getElementById('add-contact-name').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('add-contact-name').value;
        if (lettersForName.length > 2 && lettersForName.length < 21 && /^[A-Za-zäöüÄÖÜ ]+$/.test(lettersForName)) {
            document.getElementById('add-contact-name-info').classList.remove("red-letters");
            document.getElementById('add-contact-name-info').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-name-info').classList.add("red-letters");
            document.getElementById('add-contact-name-info').classList.remove("green-letters");
        }
    });
}

/**
 * Validates the mail-Input
 */
function initInputMail() {
listenerForFocusMail();
listenerForBlurMail();
listenerForInputMail();
}

/**
 * Adds the Event Listener for the field input mail, if its focussed
 */
function listenerForFocusMail(){
    document.getElementById('add-contact-email').addEventListener("focus", function (e) {
        document.getElementById('add-contact-email-info').classList.remove("v-hidden");
        document.getElementById('add-contact-email-info').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input mail, if its blurred
 */
function listenerForBlurMail(){
    document.getElementById('add-contact-email').addEventListener("blur", function (e) {
        document.getElementById('add-contact-email-info').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input mail, if it gets inputs
 */
function listenerForInputMail(){
    document.getElementById('add-contact-email').addEventListener("input", function (e) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailInput = document.getElementById('add-contact-email').value;
        if (emailPattern.test(emailInput)) {
            document.getElementById('add-contact-email-info').classList.remove("red-letters");
            document.getElementById('add-contact-email-info').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-email-info').classList.add("red-letters");
            document.getElementById('add-contact-email-info').classList.remove("green-letters");
        }
    });
}

/**
 * Validates the phone-Input
 */
function initInputPhone() {
    listenerForFocusPhone();
    listenerForBlurPhone();
    listenerForInputPhone();
}

/**
 * Adds the Event Listener for the field input phone, if its focussed
 */
function listenerForFocusPhone(){
    document.getElementById('add-contact-phone').addEventListener("focus", function (e) {
        document.getElementById('add-contact-phone-info').classList.remove("v-hidden");
        document.getElementById('add-contact-phone-info').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input phone, if its blurred
 */
function listenerForBlurPhone(){
    document.getElementById('add-contact-phone').addEventListener("blur", function (e) {
        document.getElementById('add-contact-phone-info').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input phone, if it gets inputs
 */
function listenerForInputPhone(){
    document.getElementById('add-contact-phone').addEventListener("input", function (e) {
        let phonePattern = /^[0-9/ ]+$/;
        let phoneInput = document.getElementById('add-contact-phone').value;
        if (phonePattern.test(phoneInput) && phoneInput.length > 2 && phoneInput.length < 21) {
            document.getElementById('add-contact-phone-info').classList.remove("red-letters");
            document.getElementById('add-contact-phone-info').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-phone-info').classList.add("red-letters");
            document.getElementById('add-contact-phone-info').classList.remove("green-letters");
        }
    });
}

/**
 * Validates the name-Input
 */
function initInputNameEdit() {
    listenerForFocusNameEdit();
    listenerForBlurNameEdit();
    listenerForInputNameEdit();
}

/**
 * Adds the Event Listener for the field input name-edit, if its focussed
 */
function listenerForFocusNameEdit(){
    document.getElementById('edit-contact-name').addEventListener("focus", function (e) {
        document.getElementById('add-contact-name-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-name-info-edit').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input name-edit, if its blurred
 */
function listenerForBlurNameEdit(){
    document.getElementById('edit-contact-name').addEventListener("blur", function (e) {
        document.getElementById('add-contact-name-info-edit').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input name-edit, if it gets inputs
 */
function listenerForInputNameEdit(){
    document.getElementById('edit-contact-name').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('edit-contact-name').value;
        if (lettersForName.length > 2 && lettersForName.length < 21 && /^[A-Za-zäöüÄÖÜ ]+$/.test(lettersForName)) {
            document.getElementById('add-contact-name-info-edit').classList.remove("red-letters");
            document.getElementById('add-contact-name-info-edit').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-name-info-edit').classList.add("red-letters");
            document.getElementById('add-contact-name-info-edit').classList.remove("green-letters");
        }
    });
}

/**
 * Validates the mail-Input
 */
function initInputMailEdit() {
    listenerForFocusMailEdit();
    listenerForBlurMailEdit();
    listenerForInputMailEdit();
}

/**
 * Adds the Event Listener for the field input mail-edit, if its focussed
 */
function listenerForFocusMailEdit(){
    document.getElementById('edit-contact-email').addEventListener("focus", function (e) {
        document.getElementById('add-contact-email-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-email-info-edit').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input mail-edit, if its blurred
 */
function listenerForBlurMailEdit(){
    document.getElementById('edit-contact-email').addEventListener("blur", function (e) {
        document.getElementById('add-contact-email-info-edit').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input mail-edit, if it gets inputs
 */
function listenerForInputMailEdit(){
    document.getElementById('edit-contact-email').addEventListener("input", function (e) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailInput = document.getElementById('edit-contact-email').value;
        if (emailPattern.test(emailInput)) {
            document.getElementById('add-contact-email-info-edit').classList.remove("red-letters");
            document.getElementById('add-contact-email-info-edit').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-email-info-edit').classList.add("red-letters");
            document.getElementById('add-contact-email-info-edit').classList.remove("green-letters");
        }
    });
}

/**
 * Validates the phone-Input
 */
function initInputPhoneEdit() {
    listenerForFocusPhoneEdit();
    listenerForBlurPhoneEdit();
    listenerForInputPhoneEdit();
}

/**
 * Adds the Event Listener for the field input phone-edit, if its focussed
 */
function listenerForFocusPhoneEdit(){
    document.getElementById('edit-contact-phone').addEventListener("focus", function (e) {
        document.getElementById('add-contact-phone-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-phone-info-edit').classList.add("red-letters");
    });
}

/**
 * Adds the Event Listener for the field input phone-edit, if its blurred
 */
function listenerForBlurPhoneEdit(){
    document.getElementById('edit-contact-phone').addEventListener("blur", function (e) {
        document.getElementById('add-contact-phone-info-edit').classList.add("v-hidden");
    });
}

/**
 * Adds the Event Listener for the field input phone-edit, if it gets inputs
 */
function listenerForInputPhoneEdit(){
    document.getElementById('edit-contact-phone').addEventListener("input", function (e) {
        let phonePattern = /^[0-9/ ]+$/;
        let phoneInput = document.getElementById('edit-contact-phone').value;
        if (phonePattern.test(phoneInput) && phoneInput.length > 2 && phoneInput.length < 21) {
            document.getElementById('add-contact-phone-info-edit').classList.remove("red-letters");
            document.getElementById('add-contact-phone-info-edit').classList.add("green-letters");
        } else {
            document.getElementById('add-contact-phone-info-edit').classList.add("red-letters");
            document.getElementById('add-contact-phone-info-edit').classList.remove("green-letters");
        }
    });
}

/**
 * Form Validation before submitting
 * @returns 
 */
function validateForm() {
    let name = document.getElementById("add-contact-name").value.trim();
    let namePattern = /^[A-Za-zäöüÄÖÜ][A-Za-zäöüÄÖÜ\s]{0,20}$/;
    if (!namePattern.test(name)) {
        document.getElementById("add-contact-name").focus();
        return false;
    }
    let email = document.getElementById("add-contact-email").value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("add-contact-email").focus();
        return false;
    }
    let phone = document.getElementById("add-contact-phone").value.trim();
    let phonePattern = /^[0-9/ ]{3,15}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById("add-contact-phone").focus();
        return false;
    }
    prepareCreateContact();
    closeAddContact();
    loadContacts();
    return false;
}

/**
 * Form Validation before submitting in the editing dialog
 * @returns 
 */
function validateFormEdit() {
    let name = document.getElementById("edit-contact-name").value.trim();
    let namePattern = /^[A-Za-zäöüÄÖÜ][A-Za-zäöüÄÖÜ\s]{0,20}$/;
    if (!namePattern.test(name)) {
        document.getElementById("add-contact-name-edit").focus();
        return false;
    }
    let email = document.getElementById("edit-contact-email").value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("add-contact-email-edit").focus();
        return false;
    }
    let phone = document.getElementById("edit-contact-phone").value.trim();
    let phonePattern = /^[0-9/ ]{3,15}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById("add-contact-phone-edit").focus();
        return false;
    }
    prepareSubmitEditetContact();
    return false;
}