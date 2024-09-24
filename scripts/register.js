const BASE_URL_USER = ('https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/');

let myLoginEmail = [];
let myLoginPassword = [];
let myName = [];

/**
 * saves the user in the database on signup
 * 
 * @param {json} path 
 * @param {json} data 
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
    // confirmPassword();
    let newUserData = await response.json();
    prepareCreateContactForUser(name, email, newUserData);
    return responseToJson = newUserData;
}

/**
 * prepares the contact for logged in user
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} newUserData 
 * @param {string} path 
 * @returns 
 */
async function prepareCreateContactForUser(name, email, newUserData, path = "") {
    let letter = name.value.charAt(0).toUpperCase();
    path = `/letter${letter}`
    createInitialsForUser(name.value);
    let initialsForSaving = initialsForUser.join('').toUpperCase();
    let color = createColorUser();
    let tasks = [];
    let newUserDataId = jsonToArrayUser(newUserData);
    let response = await createContactForUser(name, email, newUserDataId, initialsForSaving, color, tasks, path);
    return responseToJson = await response.json();
}

/**
 * creates contact for logged in user
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} newUserData 
 * @param {string} initialsForSaving 
 * @param {string} color 
 * @param {string} tasks 
 * @param {json} path 
 * @returns 
 */
async function createContactForUser(name, email, newUserData, initialsForSaving, color, tasks, path) {
    data = ({ name: name.value, email: email.value, userid: newUserData, initials: initialsForSaving, color: color, tasks: tasks });
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response;
}

/**
 * checks the values from input
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
    let user = UserKeys.find(u => u.email === email.value && u.password === password.value && password.value.length === u.password.length);
    loginUserCheck(user);
}

/** 
 * compares the data with the database and log in the user
*/
function loginUserCheck(user) {
    if (user) {
        saveUserLoginNoRemember(user);
        window.location.href = 'summary.html';
        saveLogin();
        saveCheckBox();
        saveUserId(user, responseToJson);
    } else {
        wrongEmailOrPassword();
        return
    };
}

/**
 * Guest Login and Initial for Header
 */
function loginGuest() {
    sessionStorage.setItem('Initials', JSON.stringify('G'));
    window.location.href = 'summaryguest.html';
    showInitialsForHeaderGuest();
}

/**
 * get the user id from logged in user and save it to the session storage
 * 
 * @param {string} user 
 * @param {json} responseToJson 
 */
function saveUserId(user, responseToJson) {
    let userIdKey = Object.entries(responseToJson).find(([_userid, userData]) => userData.email == user.email && userData.password == user.password);
    if (userIdKey) {
        let [userId] = userIdKey;
        sessionStorage.setItem("userId", `${userId}`);
    }

}

/**
 * checks the password of to input fields to confirm the password
 * 
 * @returns 
 */
// function confirmPassword() {
//     let form = document.getElementById('registerform');
//     if (form.password.value == '' || form.confirm_password.value == '') {
//         return
//     } else {
//         if (form.password.value === form.confirm_password.value) {
//         } else {
//             return
//         }
//     }
// }

/**
 * checks if the checkbox at the signup form is active and enable the sign in button
 */
function isChecked() {
    let isChecked = document.getElementById('checkbox').checked;
    let signInButton = document.getElementById('input-btn');
    if (isChecked) {
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
    setTimeout(function () {
        x.className = x.className.replace("show", "");
        window.location.href = 'login.html';
    }, 3000);
}

/**
 * checks if the remember me checkbox is active at login form and saves the user in localstorage
 */
function saveLogin() {
    let isChecked = document.getElementById('rememberme-checkbox').checked;
    let inputEmail = document.getElementById('emaillogin');
    let inputPassword = document.getElementById('passwordlogin');
    if (isChecked) {
        if (inputEmail.value != '') {
            myLoginEmail.push(inputEmail.value)
        }
        if (inputPassword.value != '') {
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
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 4000);
}

/**
 * starts the join logo animation at the beginning
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

/**
 * starts the join logo animation at the beginning for the mobile version
 */
function startLogoAnimationMobile() {
    let animatedLogo = document.getElementById('animated-logo-mobile');
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

/**
 * validates name on sign up
 */
function validateName() {
    document.getElementById('name').addEventListener('input', function(e) {
        let name = e.target.value;
        let pattern = /^[A-Za-z ]+$/;
        if (name.match(pattern)) {
          e.target.setCustomValidity('');
        } else {
          e.target.setCustomValidity('Please enter name and use letters only');
        }
      });      
    }

/**
 * validates email on sign up
 */
function validateEmail() {
document.getElementById('email').addEventListener('input', function(e) {
    let email = e.target.value;
    let pattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    if (email.match(pattern)) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Please enter a valid email address. Example: user@example.de');
    }
  }); 
}

/**
 * validates password match on sign up
 */
function validatePasswordMatch() {
    const password = document.getElementById('password');
const confirm = document.getElementById('confirm_password');
confirm.addEventListener('input', function(event) {
    if (password.value !== confirm.value) {
        confirm.setCustomValidity('Passwords do not match.');
    } else {
        confirm.setCustomValidity('');
    }
});
}