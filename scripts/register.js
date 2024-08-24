const BASE_URL = ('https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/');

async function saveNewUser(path = "/users", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    data = ({ name: name.value, email: email.value, password: password.value });
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
    return responseToJson = await response.json();
}

async function loginUser(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();
    let UserKeys = Object.values(responseToJson);
    let email = document.getElementById('emaillogin');
    let password = document.getElementById('passwordlogin');
    let user = UserKeys.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log("User gefunden");
        window.location.href = 'index.html';
    } else {
        console.log("User nicht gefunden");
        return
    };
}

function confirmPassword() {
    if (document.getElementById('password').value ==
        document.getElementById('confirm_password').value) {
        document.getElementById('green').classList.remove('d-none');
        document.getElementById('red').classList.add('d-none');
    } else {
        document.getElementById('red').classList.remove('d-none');
        document.getElementById('green').classList.add('d-none');
    }
    if (document.getElementById('confirm_password').value == 0 || document.getElementById('password').value == 0) {
        document.getElementById('green').classList.add('d-none')
        document.getElementById('red').classList.add('d-none');
}
}

function goToSignIn() {
    window.location.href = 'signup.html';
}