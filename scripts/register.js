const BASE_URL_USER = ('https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/');

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
    } else {
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