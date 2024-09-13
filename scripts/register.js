const BASE_URL_USER = ('https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/');

let myLoginEmail = [];
let myLoginPassword = [];
let myName = [];

/**
 * saves the user in the database on signup
 * 
 * @param {*} path 
 * @param {*} data 
 * @returns 
 */
async function saveNewUser(path = "/users", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    data = ({ name: name.value, email: email.value, password: password.value });
    let response = await fetch(BASE_URL_USER + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    confirmPassword();
    return responseToJson = await response.json();
}

/**
 * checks the values from input, compares the data with the database and log in the user
 * 
 * @param {*} path 
 * @returns 
 */
async function loginUser(path = "/users") {
    let response = await fetch(BASE_URL_USER + path + ".json");
    responseToJson = await response.json();
    let UserKeys = Object.values(responseToJson);
    let email = document.getElementById('emaillogin');
    let password = document.getElementById('passwordlogin');
    let user = UserKeys.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log("User gefunden");
        saveUserLoginNoRemember(user);
        window.location.href = 'summary.html';
        saveLogin();
        saveCheckBox();
    } else {
        wrongEmailOrPassword();
        console.log("User nicht gefunden");
        return
    };
}

/**
 * checks the password of to input fields to confirm the password
 * 
 * @returns 
 */
function confirmPassword() {
    let form = document.getElementById('registerform');
    if (form.password.value == '' || form.confirm_password.value == '') {
        return
    } else {
        if (form.password.value === form.confirm_password.value) {
            launchToasterAndRedirect();
        } else {
            return
        }
    }
}

/**
 * checks if the checkbox at the signup form is active and enable the sign in button
 */
function isChecked() {
    let isChecked = document.getElementById('checkbox').checked;
    let signInButton = document.getElementById('input-btn');
    if(isChecked){
        signInButton.disabled = false;
    } else {
        signInButton.disabled = true;
    }
        
}

/**
 * switch to signup
 */
function goToSignUp() {
    window.location.href = 'signup.html';
}

/**
 * switch to login
 */
function backToLogin() {
    window.location.href = 'login.html';
}

/**
 * starts the successfully signed in toaster and redirect to login
 */
function launchToasterAndRedirect() {
    let x = document.getElementById("toaster")
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", "");
        window.location.href = 'login.html';
     }, 4000);
}

/**
 * checks if the remember me checkbox is active at login form and saves the user in localstorage
 */
function saveLogin() {
    let isChecked = document.getElementById('rememberme-checkbox').checked;
    let inputEmail = document.getElementById('emaillogin');
    let inputPassword = document.getElementById('passwordlogin');    
    if (isChecked) {
    if(inputEmail.value != '') {
        myLoginEmail.push(inputEmail.value)
    }
    if(inputPassword.value != '') {
        myLoginPassword.push(inputPassword.value)
    }
} else {
    localStorage.clear();
}
saveToLocalStorage();
}

/**
 * saves the name of the user for greeting in sessionstorage, if the remember me checkbox at the login form is not active
 * 
 * @param {json} user 
 */
function saveUserLoginNoRemember(user) {
    if (user) {
        sessionStorage.setItem('name', JSON.stringify(user.name));
    }
}

/**
 * saves email and password in localstorage
 */
function saveToLocalStorage() {
    localStorage.setItem('email', JSON.stringify(myLoginEmail));
    localStorage.setItem('password', JSON.stringify(myLoginPassword)); 
    }

    /**
     * pre fills the login form if the remember me checkbox at the login form is active
     */
function preFillForm() {
    let email = JSON.parse(localStorage.getItem('email'));
    let password = JSON.parse(localStorage.getItem('password'));   
    if (email) {
        document.getElementById('emaillogin').value = email; 
    }
    if (password) {
        document.getElementById('passwordlogin').value = password;
    }
    let checked = JSON.parse(localStorage.getItem("rememberme-checkbox"));
    document.getElementById("rememberme-checkbox").checked = checked;
}

/**
 * saves the status of the remember me checkbox in localstorage
 */
function saveCheckBox() {
	let checkbox = document.getElementById("rememberme-checkbox");
    localStorage.setItem("rememberme-checkbox", checkbox.checked);  
}

/**
 * starts the toaster if the email or password at the login form is incorrect
 */
function wrongEmailOrPassword() {
    let x = document.getElementById("wrongEmailOrPassword")
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", "");
     }, 4000);
}

/**
 * starts the jion logo animation at the beginning
 */
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


