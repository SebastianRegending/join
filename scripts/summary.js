let initialsSummary = [];
let futureTasks = [];

/**
 * switch to board
 */
function navigateToBoard() {
    window.location.href = 'board.html'
}

/**
 * switch to guest board
 */
function navigateToBoardGuest() {
    window.location.href = 'boardguest.html'
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
    document.getElementById('daytime-greeting-mobile').innerHTML = greet;
}

/**
 * set the Name from the User on Greeting after Login
 */
async function setUsernameOnGreeting() {
    const response = await fetch(BASE_URL_USER + "/users.json");
    const data = await response.json();
    let UserKeys = Object.values(data);
    let userEmail = JSON.parse(localStorage.getItem('email'));
    showUsernameOnGreeting(UserKeys, userEmail);
}

/**
 * shows the username on greeting
 * 
 * @retuns
 */
    function showUsernameOnGreeting(UserKeys, userEmail) {
    for (let i = 0; i < UserKeys.length; i++) {
        const currentUser = UserKeys[i];
        if (currentUser.email == userEmail) {
            document.getElementById('username-greeting').innerHTML = currentUser.name;
            document.getElementById('username-greeting-mobile').innerHTML = currentUser.name;
            createInitialsForHeader(currentUser.name);
            return;
        } else {
            let userNameNoRemember = JSON.parse(sessionStorage.getItem('name'));
            document.getElementById('username-greeting').innerHTML = userNameNoRemember;
            document.getElementById('username-greeting-mobile').innerHTML = userNameNoRemember;
            createInitialsForHeader(userNameNoRemember);
            return;
        }
    }
}

/**
 * create Initials from the Userlogin for the header button
 * 
 * @param {string} name - name of the user that is used to create the initials
 */
function createInitialsForHeader(name) {
    let guestCheck = JSON.parse(sessionStorage.getItem('guest'));
    if (!guestCheck){
    let words = name.split(" ");
    initialsSummary = [];
    words.length = 2;
    words.forEach((element) => initialsSummary.push(element.charAt(0)));
    sessionStorage.setItem('Initials', JSON.stringify(initialsSummary));
}
}

/**
 * show the Initials from the logged in User in the header button 
 */
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

/**
 * set guest initial for header
 */
function showInitialsForHeaderGuest() {
    let initialsHeader = JSON.parse(sessionStorage.getItem('Initials'));
    if (initialsHeader) {
        let firstInitial = initialsHeader[0];
        document.getElementById('initials-header').innerHTML = firstInitial;
    }
}

/**
 * count the number of tasks in database and shows the number on the website
 * 
 * @param {json} path - path to the saved tasks in database
 */
async function getNumberOfTasks(path = "/tasks") {
    const response = await fetch(BASE_URL_USER + path + ".json");
    const data = await response.json();
    let UserTasksArray = Object.values(data);
    const taskLength = UserTasksArray.length;
    document.getElementById('summary-bottom-tasks').innerHTML = taskLength;
}

/**
 * get the status of every task in database
 */
async function getProgressOfTasks() {
    const URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
    let response = await fetch(URL_tasks + ".json");
    let tasks = await response.json();
    let tasksInProgressToDo = 0;
    let tasksInProgressInProgress = 0;
    let tasksInProgressAwaitFeedback = 0;
    let tasksInProgressDone = 0;
    let tasksPrio = 0;
    calculateProgressOfTasks(tasks, tasksInProgressToDo, tasksInProgressInProgress, tasksInProgressAwaitFeedback, tasksInProgressDone, tasksPrio);
}

/**
 * calculates the number of every task in every category
 * 
 * @param {number} tasks 
 * @param {number} tasksInProgressToDo 
 * @param {number} tasksInProgressInProgress 
 * @param {number} tasksInProgressAwaitFeedback 
 * @param {number} tasksInProgressDone 
 * @param {number} tasksPrio 
 */
function calculateProgressOfTasks (tasks, tasksInProgressToDo, tasksInProgressInProgress, tasksInProgressAwaitFeedback, tasksInProgressDone, tasksPrio) {
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
    showProgressOfTasks(tasksInProgressToDo, tasksInProgressDone, tasksInProgressInProgress, tasksInProgressAwaitFeedback, tasksPrio);
}

/**
 * shows numbers of every task in every category on the website
 * 
 * @param {number} tasksInProgressToDo 
 * @param {number} tasksInProgressDone 
 * @param {number} tasksInProgressInProgress 
 * @param {number} tasksInProgressAwaitFeedback 
 * @param {number} tasksPrio 
 */
function showProgressOfTasks(tasksInProgressToDo, tasksInProgressDone, tasksInProgressInProgress, tasksInProgressAwaitFeedback, tasksPrio) {
    document.getElementById('summary-todo').innerHTML = tasksInProgressToDo;
    document.getElementById('summary-done').innerHTML = tasksInProgressDone;
    document.getElementById('summary-bottom-progress').innerHTML = tasksInProgressInProgress;
    document.getElementById('summary-bottom-feedback').innerHTML = tasksInProgressAwaitFeedback;
    document.getElementById('summary-urgent-change-number').innerHTML = tasksPrio;
}

/**
 * get the dates of all tasks in database
 * 
 * @param {json} path - path to the saved tasks in database
 */
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

/**
 * find the task with the closest deadline and show the date on the website
 *
 * @param {string} futureTasks
 */
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
                showClosestDate(closestDate);
            }
        }
    }
}

/**
 * shows the date of the closest task on the website
 * 
 * @param {date} closestDate 
 */
function showClosestDate(closestDate) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const europeanDate = closestDate.toLocaleDateString("de-DE", options);
    document.getElementById('summary-urgent-right-date').innerHTML = europeanDate;
}

/**
 * set z-index for the greeting animation on mobile devices
 */
function setZIndex() {
    const contentSummaryRightMobile = document.getElementById("content-summary-right-mobile");
    contentSummaryRightMobile.style.zIndex = -1;
}

/**
 * starts the greeting animation on mobile devices
 */
function greetingOnMobile() {
    const hasAnimationPlayed = localStorage.getItem('animationPlayed');    
    if (!hasAnimationPlayed) {
        localStorage.setItem('animationPlayed', 'true');
        setTimeout(setZIndex, 3200);
    } else {
        setZIndex();
    }
}