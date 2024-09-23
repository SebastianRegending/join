/**
 * Form Validation before submitting
 * @returns 
 */
function validateForm() {
    let name = document.getElementById("add-contact-name").value;
    let namePattern = /^[A-Za-z\s]{1,50}$/;
    if (!namePattern.test(name)) {
        alert("Bitte nur Buchstaben eingeben");
        return false;
    }
    let email = document.getElementById("add-contact-email").value;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Bitte eine gültige E-Mail-Adresse eingeben");
        return false;
    }
    let phone = document.getElementById("add-contact-phone").value;
    let phonePattern = /^[0-9/ ]{3,15}$/;
    if (!phonePattern.test(phone)) {
        alert("Bitte eine gültige Telefonnummer eingeben, die zwischen drei und 15 Zahlen hat");
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
    let name = document.getElementById("edit-contact-name").value;
    let namePattern = /^[A-Za-z\s]{1,50}$/;
    if (!namePattern.test(name)) {
        alert("Bitte nur Buchstaben eingeben");
        return false;
    }
    let email = document.getElementById("edit-contact-email").value;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Bitte eine gültige E-Mail-Adresse eingeben");
        return false;
    }
    let phone = document.getElementById("edit-contact-phone").value;
    let phonePattern = /^[0-9/ ]{3,15}$/;
    if (!phonePattern.test(phone)) {
        alert("Bitte eine gültige Telefonnummer eingeben, die zwischen drei und 15 Zahlen hat");
        return false;
    }
    prepareSubmitEditetContact(); 
    return false;
}