/**
 * Initializes the validation for the form
 */
function initValidations() {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordMatch();
}

/**
 * validates name on sign up
 */
function validateName() {
    document.getElementById('name').addEventListener("focus", function (e) {
        document.getElementById('name-info').classList.remove("v-hidden");
        document.getElementById('name-info').classList.add("red-letters");
        document.getElementById('name').classList.add("red-border");
    });
    document.getElementById('name').addEventListener("blur", function (e) {
        document.getElementById('name-info').classList.add("v-hidden");
        document.getElementById('name').classList.remove("red-border");
    });
    listenerInputName();
}

/**
 * Sets the Event Listener for the input with different statements
 */
function listenerInputName() {
    document.getElementById('name').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('name').value;
        if (lettersForName.length > 2 && lettersForName.length < 20 && /^[A-Za-z ]+$/.test(lettersForName)) {
            document.getElementById('name-info').classList.remove("red-letters");
            document.getElementById('name-info').classList.add("green-letters");
            document.getElementById('name').classList.remove("red-border");
            document.getElementById('name').classList.add("green-border");
        } else {
            document.getElementById('name-info').classList.add("red-letters");
            document.getElementById('name-info').classList.remove("green-letters");
            document.getElementById('name').classList.add("red-border");
            document.getElementById('name').classList.remove("green-border");
        }
    });
}

/**
 * validates email on sign up
 */
function validateEmail() {
    document.getElementById('email').addEventListener("focus", function (e) {
        document.getElementById('email-info').classList.remove("v-hidden");
        document.getElementById('email-info').classList.add("red-letters");
        document.getElementById('email').classList.add("red-border");
    });
    document.getElementById('email').addEventListener("blur", function (e) {
        document.getElementById('email-info').classList.add("v-hidden");
        document.getElementById('email').classList.remove("red-border");
    });
    listenerInputMail();
}

/**
 * Sets the Event Listener for the input with different statements
 */
function listenerInputMail() {
    document.getElementById('email').addEventListener("input", function (e) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailInput = document.getElementById('email').value;
        if (emailPattern.test(emailInput)) {
            document.getElementById('email-info').classList.remove("red-letters");
            document.getElementById('email-info').classList.add("green-letters");
            document.getElementById('email').classList.remove("red-border");
            document.getElementById('email').classList.add("green-border");
        } else {
            document.getElementById('email-info').classList.add("red-letters");
            document.getElementById('email-info').classList.remove("green-letters");
            document.getElementById('email').classList.add("red-border");
            document.getElementById('email').classList.remove("green-border");
        }});
}

/**
 * Sets the Event Listener for the input with different statements
 */
function validatePassword() {
    document.getElementById('password').addEventListener("focus", function (e) {
        document.getElementById('password-info').classList.remove("v-hidden");
        document.getElementById('password-info').classList.add("red-letters");
        document.getElementById('password').classList.add("red-border");
    });
    document.getElementById('password').addEventListener("blur", function (e) {
        document.getElementById('password-info').classList.add("v-hidden");
        document.getElementById('password').classList.remove("red-border");
    });
listenerInputPassword();
}

/**
 * Sets the Event Listener for the input with different statements
 */
function listenerInputPassword(){
    document.getElementById('password').addEventListener("input", function (e) {
        let lettersForName = document.getElementById('password').value;
        if (lettersForName.length > 5 && /[^<>]+/.test(lettersForName)) {
            document.getElementById('password-info').classList.remove("red-letters");
            document.getElementById('password-info').classList.add("green-letters");
            document.getElementById('password').classList.remove("red-border");
            document.getElementById('password').classList.add("green-border");
        } else {
            document.getElementById('password-info').classList.add("red-letters");
            document.getElementById('password-info').classList.remove("green-letters");
            document.getElementById('password').classList.add("red-border");
            document.getElementById('password').classList.remove("green-border");
        }
    });
}

/**
 * validates password match on sign up
 */
function validatePasswordMatch() {
    document.getElementById('confirm_password').addEventListener("focus", function (e) {
        document.getElementById('confirm_password-info').classList.remove("v-hidden");
        document.getElementById('confirm_password-info').classList.add("red-letters");
        document.getElementById('confirm_password').classList.add("red-border");
    });
    document.getElementById('confirm_password').addEventListener("blur", function (e) {
        document.getElementById('confirm_password-info').classList.add("v-hidden");
        document.getElementById('confirm_password').classList.remove("red-border");
    });
listenerPasswordConfirm();
}

/**
 * Checks if the passwords are the same
 */
function listenerPasswordConfirm(){
    document.getElementById('confirm_password').addEventListener("input", function (e) {
        if (document.getElementById('confirm_password').value == document.getElementById('password').value) {
            document.getElementById('confirm_password-info').classList.remove("red-letters");
            document.getElementById('confirm_password-info').classList.add("green-letters");
            document.getElementById('confirm_password').classList.remove("red-border");
            document.getElementById('confirm_password').classList.add("green-border");
        } else {
            document.getElementById('confirm_password-info').classList.add("red-letters");
            document.getElementById('confirm_password-info').classList.remove("green-letters");
            document.getElementById('confirm_password').classList.add("red-border");
            document.getElementById('confirm_password').classList.remove("green-border");
        }
    });
}

/**
 * Checks, if the form is valid
 */
function checkValidation() {
    let checkName = true;
    let checkEmail = true;
    let checkPassword = true;
    let checkPasswordConfirmation = true;
    let checkCheckbox;
    if (!document.getElementById('name').classList.contains('green-border')) {
        checkName = false;
        document.getElementById('name').focus();
    }
    if (!document.getElementById('email').classList.contains('green-border')) {
        checkName = false;
        document.getElementById('email').focus();
    }
    if (!document.getElementById('password').classList.contains('green-border')) {
        checkName = false;
        document.getElementById('password').focus();
    }
    if (!document.getElementById('confirm_password').classList.contains('green-border')) {
        checkName = false;
        document.getElementById('confirm_password').focus();
    }
    if (checkbox.checked) {
        checkCheckbox = true;
    } else {
        checkCheckbox = false;
    }
    if (checkName && checkEmail && checkPassword && checkPasswordConfirmation) {
        saveNewUser();
        launchToasterAndRedirect();
    }
}