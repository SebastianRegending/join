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
    const response = await fetch(BASE_URL_USER + "/users.json");
    const data = await response.json();
    let UserKeys = Object.values(data);
    UserLogin.push(UserKeys);
    for (let i = 0; i < UserLogin.length; i++) {
        const user = UserLogin[i][0]['name'];
        console.log(UserLogin[i][0]['name']);        
        if (user) {
            document.getElementById('username-greeting').innerHTML = user;
        }
    }
}