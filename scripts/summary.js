let UserLogin = [];

function navigateToBoard() {
    window.location.href = 'board.html'
}

function setDaytimeOnGreeting() {
    let myDate = new Date();    
    let hrs = myDate.getHours();
    let greet;
    if (hrs < 12)
        greet = 'Good Morning,';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon,';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening,';
    document.getElementById('daytime-greeting').innerHTML = greet;
}

async function setUsernameOnGreeting() {
    let response = await fetch(BASE_URL_USER + "/users.json");
    let users = await response.json();
    UserKeys = Object.values(users);
    let loggedInUser = UserKeys.find(u => u.email === email);
    console.log(loggedInUser);
    
    if (loggedInUser) {
        document.getElementById('username-greeting').innerHTML = `${loggedInUser.name}`;
        
    } else {
        document.getElementById('username-greeting').innerHTML = 'User not found';
    }
}