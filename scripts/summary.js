let initialsSummary = [];
let futureTasks = [];

/**
 * switch to board
 */
function navigateToBoard() {
    window.location.href = 'board.html'
}

/**
 * set the Daytime on Greeting after Login from User
 */
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

/**
 * set the Name from the User on Greeting after Login
 */
async function setUsernameOnGreeting() {
    const response = await fetch(BASE_URL_USER + "/users.json");
    const data = await response.json();
    let UserKeys = Object.values(data);      
    let userEmail = JSON.parse(localStorage.getItem('email'));
    for (let i = 0; i < UserKeys.length; i++) {
        const currentUser = UserKeys[i];     
        if (currentUser.email == userEmail) {
            document.getElementById('username-greeting').innerHTML = currentUser.name;
            createInitialsForHeader(currentUser.name);
            return;
        } else {
            let userNameNoRemember = JSON.parse(sessionStorage.getItem('name'));
            document.getElementById('username-greeting').innerHTML = userNameNoRemember;
            createInitialsForHeader(userNameNoRemember);
            return;
        }
    }
}

function createInitialsForHeader(name) {
    let words = name.split(" ");
    initialsSummary = [];
    words.length = 2;
    words.forEach((element) => initialsSummary.push(element.charAt(0)));
    sessionStorage.setItem('Initials', JSON.stringify(initialsSummary));
}

async function showInitialsForHeader() {
    await setUsernameOnGreeting();
    let initialsHeader = JSON.parse(sessionStorage.getItem('Initials'));
    if (initialsHeader) {
        let firstInitial = initialsHeader[0];
        let secondInitial = initialsHeader[1];
        let combinedInitials = firstInitial + (secondInitial ? secondInitial : '');
        document.getElementById('initials-header').innerHTML = combinedInitials;
    }
}

async function getNumberOfTasks(path = "/tasks") {
    const response = await fetch(BASE_URL_USER + path + ".json");
    const data = await response.json();
    let UserTasksArray = Object.values(data);
    const taskLength = UserTasksArray.length;
    document.getElementById('summary-bottom-tasks').innerHTML = taskLength;     
}

async function getProgressOfTasks() {
    const URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
    let response = await fetch(URL_tasks + ".json");
        let tasks = await response.json();
        let tasksInProgressToDo = 0;
        let tasksInProgressInProgress = 0;
        let tasksInProgressAwaitFeedback = 0;
        let tasksInProgressDone = 0;
        let tasksPrio = 0;
    for (let taskID in tasks) {
        let taskProgress = tasks[taskID]['progress'];
        let taskPrio = tasks[taskID]['prio'];
        if (taskProgress == 'To Do') {
            tasksInProgressToDo++;
        }
        if (taskProgress == 'In Progress') {
            tasksInProgressInProgress++;
        }
        if (taskProgress == 'Await Feedback') {
            tasksInProgressAwaitFeedback++;
        }
        if (taskProgress == 'Done') {
            tasksInProgressDone++;
        }
        if (taskPrio == 'urgent') {
            tasksPrio++;
        }    
    }   
    document.getElementById('summary-todo').innerHTML = tasksInProgressToDo;
    document.getElementById('summary-done').innerHTML = tasksInProgressDone;
    document.getElementById('summary-bottom-progress').innerHTML = tasksInProgressInProgress;
    document.getElementById('summary-bottom-feedback').innerHTML = tasksInProgressAwaitFeedback;
    document.getElementById('summary-urgent-change-number').innerHTML = tasksPrio;
    }

async function getDeadlineDate(path = "/tasks") {
    const response = await fetch(BASE_URL_USER + path + ".json");
    const data = await response.json();
    let tasksDeadlineArray = Object.values(data);
    for (let s = 0; s < tasksDeadlineArray.length; s++) {
        const tasksDeadline = tasksDeadlineArray[s]['deadline'];
        futureTasks.push(tasksDeadline);
        findClosestDate(futureTasks);
}    
}

function findClosestDate(futureTasks) {
    const now = new Date();
    let closestDate = null;
    let minDifference = Infinity;
    for (const dateStr of futureTasks) {
        const date = new Date(dateStr);
        const difference = Math.abs(date - now);
        if (date > now) {
        if (difference < minDifference) {
            minDifference = difference;
            closestDate = date;
        }
    }
}
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const europeanDate = closestDate.toLocaleDateString("de-DE", options);
    console.log(closestDate);
    document.getElementById('summary-urgent-right-date').innerHTML = europeanDate;
}
