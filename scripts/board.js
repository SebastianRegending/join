document.addEventListener('DOMContentLoaded', function () {

    function openDialog() {
        fetch('./addtask.html')
            .then(response => response.text())
            .then(data => {
                const dialogContent = document.getElementById('dialog-content');
                if (dialogContent) {
                    dialogContent.innerHTML = data;

                    const closeButton = document.createElement('div');
                    closeButton.innerHTML = `
                        <img class="close-popup" src="./assets/img/close.png" alt="close-img">
                    `;
                    closeButton.addEventListener('click', closeDialog);

                    dialogContent.insertBefore(closeButton, dialogContent.firstChild);
                    document.getElementById('dialog').classList.remove('d-none');

                    loadScripts().then(() => {
                        loadContacts();
                    });
                }
            })
            .catch(error => {
                console.error('Error loading the form:', error);
            });
    }

    function closeDialog() {
        let dialog = document.getElementById('dialog');
        let dialogBox = dialog.querySelector('.dialog');

        dialogBox.classList.remove('show');
        setTimeout(() => {
            dialog.classList.add('d-none');
        }, 500);
    }

    document.getElementById('dialog').addEventListener('click', function(event) {
        if (event.target === this) {
            closeDialog();
        }
    });

    function loadScripts() {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = './scripts/addtask.js';
            script.onload = resolve; 
            script.onerror = reject; 
            document.body.appendChild(script);
        });
    }

    document.querySelector('.add-task').addEventListener('click', openDialog);
});


async function loadTasks() {
    const URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";

    try {
        let response = await fetch(URL_tasks + ".json");
        let tasks = await response.json();

        document.getElementById('ToDo').innerHTML = '';
        document.getElementById('inProgress').innerHTML = '';
        document.getElementById('AwaitFeedback').innerHTML = '';
        document.getElementById('Done').innerHTML = '';

        const colors = ['#FF7A00', '#1FD7C1', '#462F8A', '#6e52ff', '#00bee8'];

        function getInitials(name) {
            const nameParts = name.split(' ');
            let initials = nameParts[0].charAt(0);
            if (nameParts.length > 1) {
                initials += nameParts[1].charAt(0);
            }
            return initials.toUpperCase();
        }

        for (let taskID in tasks) {
            let task = tasks[taskID];

            let totalSubtasks = 0;
            let completedSubtasks = 0;

            let progressHTML = '';
            if (task.subtasks && Array.isArray(task.subtasks)) {
                totalSubtasks = task.subtasks.length;
                completedSubtasks = task.subtasks.filter(subtask => subtask.done === true).length;

                let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

                progressHTML = `
                    <div class="card-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progressPercentage}%;"></div> 
                        </div>
                        <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
                    </div>
                `;
            }

            let contactsHTML = '';
            if (task.contacts) {
                task.contacts.forEach((contact, index) => {
                    let color = colors[index % colors.length];
                    let initials = getInitials(contact.name);
                    contactsHTML += `<span class="user-badge" style="background-color:${color}">${initials}</span>`;
                });
            }

            let labelClass = '';
            if (task.category === 'User Story') {
                labelClass = 'user-story-label';
            } else if (task.category === 'Technical Task') {
                labelClass = 'technical-task-label';
            }

            let taskHTML = `
                <div id="task-${taskID}" class="todo-card" draggable="true" ondragstart="startDragging(event)">
                    <div class="card-labels ${labelClass}">
                        <span class="label">${task.category}</span>
                    </div>

                    <div class="card-content">
                        <h3 class="card-title">${task.title}</h3>
                        <p class="card-description">${task.description || 'No description available'}</p>
                    </div>

                    ${progressHTML}

                    <div class="card-footer">
                        <div class="card-users">
                            ${contactsHTML}
                        </div>
                        <div class="priority">
                            <span class="priority-symbol">
                                <img src="./assets/img/priority-${task.prio}.png" alt="${task.prio}">
                            </span>
                        </div>
                    </div>
                </div>
            `;

            if (task.progress === 'To Do') {
                document.getElementById('ToDo').innerHTML += taskHTML;
            } else if (task.progress === 'In Progress') {
                document.getElementById('inProgress').innerHTML += taskHTML;
            } else if (task.progress === 'Await Feedback') {
                document.getElementById('AwaitFeedback').innerHTML += taskHTML;
            } else if (task.progress === 'Done') {
                document.getElementById('Done').innerHTML += taskHTML;
            }
        }

    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

