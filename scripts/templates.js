function generateTaskDetailsHTML(todoData, id) {
    let contacts = todoData.contacts ? todoData.contacts : [];
    contactIds = [];
    for(let i = 0; i < contacts.length; i++){
        let initials = getInitials(contacts[i]['name']);
        contactIds.push({name: contacts[i]['name'], color: contacts[i]['color'], id: contacts[i]['id'], initials: initials});
    }
    let subtasks = todoData.subtasks ? todoData.subtasks : [];
    for(let i = 0; i < subtasks.length; i++){
        subtasksEdit.push({"title": subtasks[i]['title'], "done": subtasks[i]['done']});
    }

    let taskTypeClass = todoData.category === 'User Story' ? 'user-story' :
        todoData.category === 'Technical Task' ? 'technical-task' : '';
    return `
                
        <div id="task-details" class="task-details">
            <div class="task-header">
                <div class="task-type ${taskTypeClass}">
                    <span>${todoData.category}</span>
                </div>
                <img src="./assets/img/close.png" alt="Close" class="btn-close-popup" onclick="closePopUp()">
            </div>
            <div class="task-body">
                <span class="task-title">${todoData.title}</span>
                <span class="task-description">${todoData.description}</span>
                <div class="task-due-date">
                    <p>Due Date:</p>
                    <span>${todoData.deadline}</span>
                </div>
                <div class="task-priority">
                    <p>Priority:</p>
                    <div class="priority-level">
                        <p>${todoData.prio}</p>
                        <img src="./assets/img/${todoData.prio === 'urgent' ? 'urgent-icon' : 'medium-icon'}.svg" alt="${todoData.prio} Priority">
                    </div>
                </div>
                <div class="task-assignees">
                    <p class="assigned-to-label">Assigned To:</p>
                    <div class="assignee-list">
                        ${contacts.map(contact => `
                        <div class="assignee-item">
                            <div class="assignee-avatar circle-${contact.color}">
                                ${getInitials(contact.name)}
                            </div>
                            <span>${contact.name}</span>
                        </div>`).join('')}
                    </div>
                </div>
                <div class="subtasks" id="subtask-container">
                    <p class="subtasks-label">Subtasks:</p>
                    <div class="subtask-list" id="subtask-list">
                        ${subtasks.map((subtask, index) => `
                        <div class="subtask-item">
                            <div class="subtask-checkbox" onclick="toggleSubtaskStatus('${todoData.id}', ${index}, '${subtask.done}')">
                                <img src="./assets/img/${subtask.done === "true" ? "checkedBox.png" : "uncheckedBox.png"}" alt="${subtask.done}">
                            </div>
                            <span>${subtask.title}</span>
                        </div>`).join('')}
                    </div>
                    <div class="task-footer">
                        <div class="btn-delete-task" onclick="deleteTask('${id}')">
                            <svg class="icon-delete-task" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
                            </svg>
                            <span>Delete</span>
                        </div>
                        <div class="divider"></div>
                        <div class="btn-edit-task" onclick="prepareEditTask('${id}', '${todoData.title}', '${todoData.description}', '${todoData.contacts}', '${todoData.deadline}', '${todoData.prio}', '${todoData.category}', '${subtasks}', '${todoData.progress}')">
                            <svg class="icon-edit-task" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                            </svg>
                            <span>Edit</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function generateProgressHTML(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) return '';

    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.done === "true").length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return `
        <div class="card-progress">
            <div class="progress-bar">
                <div class="progress" style="width: ${progressPercentage}%;"></div>
            </div>
            <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
    `;
}


function generateEditPage(id, title, description, contacts, deadline, prio, category, subtasks) {
   
    return `
        <div id="task-details-edit" class="task-details">
        <div class="right-align" onclick="closePopUpEdit()"><img class="cancel-cross" src="./assets/img/cancel.svg""></div>
           <form id="editform"  onsubmit="submitEditetTask(); return false;">
           <span>Title</span>
            <input id="input-title-edit" class="input-field" value="${title}">
             <span>Description</span>
            <textarea id="input-description-edit">${description}</textarea>
              <span>Due date</span>
            <input id="input-deadline-edit" class="input-field" type="date" placeholder="dd/mm/yyyy" value="${deadline}" required>
            <span>Priority</span>
            <div class="flexed button-area-prio">
                        
                        <div class="prio-container" id="prio-urgent-edit" onclick="setPrioEdit('urgent')">
                            Urgent<img id="prio-pic-urgent" src="./assets/img/urgent-icon.svg"></div>
                            
                            <div class="prio-container prio-active-medium" id="prio-medium-edit"
                            onclick="setPrioEdit('medium')">Medium <img id="prio-pic-medium"
                            src="./assets/img/medium-icon.svg"></div>
                            
                            <div class="prio-container" id="prio-low-edit" onclick="setPrioEdit('low')">Low <img
                                id="prio-pic-low" src="./assets/img/low-icon.svg"></div>

                    </div>

 <span>Assigned to contacts</span>
               <div class="multiselect">
                        <div class="selectBox" onclick="showCheckboxesEdit()">
                            <select class="input-field-select">
                                <option class="option-select">Select contacts to assign</option>
                            </select>
                            <div class="overSelect"></div>
                        </div>
                        <div id="checkboxes-edit">
                        </div>
                    </div>
                    <div id="circle-area-assigned-contacts-edit">
                    </div>
                  <div class="subtasks-area">  
 <span>Subtasks</span>
                    <div class="input-field-subtasks input-field-subtasks-smaller">
                        <input id="subtasks-edit" onfocus="openAddSubtaskEdit()" placeholder="Add new subtask">
                        <div onclick="openAddSubtaskEdit()" id="add-button-icon-plus-edit" class="add-subtask"><img
                                src="./assets/img/add.svg"></div>

                        <div class="cancel-container">
                            <div class="d-none" onclick="cancelAddSubtaskEdit()" id="add-button-icon-cancel-edit"><img
                                    src="./assets/img/cancel.svg"></div>
                        </div>

                        <div onclick="addSubtaskEdit()" id="add-button-icon-check-edit" class="d-none"><img id="check"
                                src="./assets/img/checkstandard.svg"></div>
                    </div>

                    <div class="flex-column" id="added-subtasks-edit"></div>
                    </div>
                    <div class="centered">
                    <button class="blue-btn">OK <img src="./assets/img/check.svg"></button>
                    <div>
           </form>
        </div>
    `;
}


function taskTemplate(task, taskID, progressHTML, contactsHTML, labelClass) {
    return `
        <div id="task-${taskID}" class="todo-card" draggable="true" ondragstart="startDragging(event)" onclick="openPopUp('${taskID}')">
            <div class="card-labels ${labelClass}">
                <span class="label">${task.category}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${task.title}</h3>
                <p class="card-description">${task.description || 'No description available'}</p>
            </div>
            ${progressHTML}
            <div class="card-footer">
                <div id="actual-users" class="card-users">
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
}

function getContactsCheckboxTemplate(n, i, isChecked, IDs) {
    return `
        <label for="contacts${n}" class="contact-for-form">
              <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
              </div>
              <div>${IDs[i]['name']}
              </div> 
              <input class="input-check" type="checkbox" name="contactsedit" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" data-color="${IDs[i]['color']}" onclick="addCircleEdit('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}', '${IDs[i]['id']}')" ${isChecked}/>        
        </label>
    `;
}

function getContactTemplate(n, i, IDs, isChecked) {
    return `
        <label for="contacts${n}" class="contact-for-form">
            <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
            </div>
            <div>${IDs[i]['name']}
            </div> 
            <input class="input-check" type="checkbox" name="contactsedit" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" data-color="${IDs[i]['color']}" onclick="addCircleEdit('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}', '${IDs[i]['id']}')" ${isChecked}/>        
        </label>
    `;
}

function getContactTemplateYou(n, i, IDs, isChecked) {
    return `
        <label for="contacts${n}" class="contact-for-form">
            <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
            </div>
            <div>${IDs[i]['name']}(You)
            </div> 
            <input class="input-check" type="checkbox" name="contactsedit" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" data-color="${IDs[i]['color']}" onclick="addCircleEdit('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}', '${IDs[i]['id']}')" ${isChecked}/>        
        </label>
    `;
}

function getProgressHTML(completedSubtasks, totalSubtasks) {
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    return `
        <div class="card-progress">
            <div class="progress-bar">
                <div class="progress" style="width: ${progressPercentage}%;"></div>
            </div>
            <p class="subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
    `;
}

function getTaskHTML(task, taskID, progressHTML) {
    return `
        <div id="task-${taskID}" class="todo-card" draggable="true" ondragstart="startDragging(event)">
            <div class="card-labels ${task.category === 'User Story' ? 'user-story-label' : 'technical-task-label'}">
                <span class="label">${task.category}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${task.title}</h3>
                <p class="card-description">${task.description || 'No description available'}</p>
            </div>
            ${progressHTML}
            <div class="card-footer">
                <div class="card-users">
                    ${generateContactsHTML(task.contacts)}
                </div>
                <div class="priority">
                    <span class="priority-symbol">
                        <img src="./assets/img/priority-${task.prio}.png" alt="${task.prio}">
                    </span>
                </div>
            </div>
        </div>
    `;
}
