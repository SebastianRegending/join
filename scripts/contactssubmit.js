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
    document.getElementById('add-contact-name').addEventListener("focus", function (e) {
        document.getElementById('add-contact-name-info').classList.remove("v-hidden");
        document.getElementById('add-contact-name-info').classList.add("red-letters");
    });
    document.getElementById('add-contact-name').addEventListener("blur", function (e) {
        document.getElementById('add-contact-name-info').classList.add("v-hidden");
    });

    document.getElementById('add-contact-name').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('add-contact-name').value;
        if (lettersForName.length > 2 && lettersForName.length < 20 && /^[A-Za-z ]+$/.test(lettersForName)) {
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
    document.getElementById('add-contact-email').addEventListener("focus", function (e) {
        document.getElementById('add-contact-email-info').classList.remove("v-hidden");
        document.getElementById('add-contact-email-info').classList.add("red-letters");
    });
    document.getElementById('add-contact-email').addEventListener("blur", function (e) {
        document.getElementById('add-contact-email-info').classList.add("v-hidden");
    });
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
    document.getElementById('add-contact-phone').addEventListener("focus", function (e) {
        document.getElementById('add-contact-phone-info').classList.remove("v-hidden");
        document.getElementById('add-contact-phone-info').classList.add("red-letters");
    });
    document.getElementById('add-contact-phone').addEventListener("blur", function (e) {
        document.getElementById('add-contact-phone-info').classList.add("v-hidden");
    });
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
    document.getElementById('edit-contact-name').addEventListener("focus", function (e) {
        document.getElementById('add-contact-name-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-name-info-edit').classList.add("red-letters");
    });
    document.getElementById('edit-contact-name').addEventListener("blur", function (e) {
        document.getElementById('add-contact-name-info-edit').classList.add("v-hidden");
    });

    document.getElementById('edit-contact-name').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('edit-contact-name').value;
        if (lettersForName.length > 2 && lettersForName.length < 20 && /^[A-Za-z ]+$/.test(lettersForName)) {
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
    document.getElementById('edit-contact-email').addEventListener("focus", function (e) {
        document.getElementById('add-contact-email-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-email-info-edit').classList.add("red-letters");
    });
    document.getElementById('edit-contact-email').addEventListener("blur", function (e) {
        document.getElementById('add-contact-email-info-edit').classList.add("v-hidden");
    });
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
    document.getElementById('edit-contact-phone').addEventListener("focus", function (e) {
        document.getElementById('add-contact-phone-info-edit').classList.remove("v-hidden");
        document.getElementById('add-contact-phone-info-edit').classList.add("red-letters");
    });
    document.getElementById('edit-contact-phone').addEventListener("blur", function (e) {
        document.getElementById('add-contact-phone-info-edit').classList.add("v-hidden");
    });
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
    let namePattern = /^[A-Za-z][A-Za-z\s]{0,49}$/;
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
    let namePattern = /^[A-Za-z][A-Za-z\s]{0,49}$/;
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