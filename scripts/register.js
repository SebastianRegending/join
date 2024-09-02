const BASE_URL_USER = ('https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/');

let myLoginEmail = [];
let myLoginPassword = [];
let myName = [];

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

async function loginUser(path = "/users") {
    let response = await fetch(BASE_URL_USER + path + ".json");
    responseToJson = await response.json();
    let UserKeys = Object.values(responseToJson);
    let email = document.getElementById('emaillogin');
    let password = document.getElementById('passwordlogin');
    let user = UserKeys.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log("User gefunden");
        window.location.href = 'summary.html';
        saveLogin();
        saveCheckBox();
    } else {
        wrongEmailOrPassword();
        console.log("User nicht gefunden");
        return
    };
}

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

function isChecked() {
    let isChecked = document.getElementById('checkbox').checked;
    let signInButton = document.getElementById('input-btn');
    if(isChecked){
        signInButton.disabled = false;
    } else {
        signInButton.disabled = true;
    }
        
}

function goToSignUp() {
    window.location.href = 'signup.html';
}

function backToLogin() {
    window.location.href = 'login.html';
}

function launchToasterAndRedirect() {
    let x = document.getElementById("toaster")
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", "");
        window.location.href = 'login.html';
     }, 4000);
}

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

function saveToLocalStorage() {
    localStorage.setItem('email', JSON.stringify(myLoginEmail));
    localStorage.setItem('password', JSON.stringify(myLoginPassword)); 
    }

function populateForm() {
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

function saveCheckBox() {
	let checkbox = document.getElementById("rememberme-checkbox");
    localStorage.setItem("rememberme-checkbox", checkbox.checked);  
}

function wrongEmailOrPassword() {
    let x = document.getElementById("wrongEmailOrPassword")
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", "");
     }, 4000);
}


function startLogoAnimation() {
    let animatedLogo = document.getElementById('animated-logo');
    let animatedLogoContainer = document.getElementById('animated-logo-container');
    let loginPage = document.getElementById('loginpage');

    setTimeout(() => {
        animatedLogo.style.animation = "logoShrinkAndMove 1s forwards";
    }, 500);

    setTimeout(() => {
        loginPage.classList.remove('hidden');  
        loginPage.classList.add('show'); 
    }, 800); 

    setTimeout(() => {
        animatedLogoContainer.style.backgroundColor = 'transparent';
    }, 900);
}


