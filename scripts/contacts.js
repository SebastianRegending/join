let contacts = [
    {
        "letter": "A",
        "names": ['Anton Mayer', 'Anja Schulz'],
        "mails": ['antonm@gmail.com', 'schulz@hotmail.com'],
        "phones": ['1234', '2345']
    },
    {
        "letter": "B",
        "names": ['Benedikt Ziegler'],
        "mails": ['benedikt@gmail.com'],
        "phones": ['6767', '8988']
    },
    {
        "letter": "C",
        "names": [],
        "mails": [],
        "phones": ['0000', '4444']
    },
    {
        "letter": "D",
        "names": ['David Eisenberg'],
        "mails": ['davidberg@gmail.com'],
        "phones": ['1565', '6763']
    },

];


function loadContacts(){
    let n = 0;
while(n < 4){
    
    if(contacts[n]['names'].length > 0){

   document.getElementById('contacts-alphabet-list').innerHTML += `
   <div>
        <div class="contact-card-letter">
             ${contacts[n]['letter']}
        </div>
        <div id="contacts-${contacts[n]['letter']}-content" class="letter-card">
        </div>
   </div>`;

    for(let i = 0; i < contacts[n]['names'].length; i++){
        document.getElementById(`contacts-${contacts[n]['letter']}-content`).innerHTML += `
        <div id="${contacts[n]['mails'][i]}" class="contact-datas" onclick="chooseContact(\'${contacts[n]['names'][i]}\', \'${contacts[n]['letter']}\')">
            <div class="initials">KK</div>
            <div>
                <div class="contact-card-names">${contacts[n]['names'][i]}</div>
                <a href='mailto:${contacts[n]['mails'][i]}'>${contacts[n]['mails'][i]}</a>
            </div>
        </div>`;
    }
    }
    n++;
}
}

let currentContact;


function chooseContact(name, letter){
    let oldContact = currentContact;
    let contactObject = contacts.find(obj => obj['letter'] == letter);
    let contactIndex = (element) => element == name;
    let indexForChoosenContact = contactObject['names'].findIndex(contactIndex);
    currentContact = contactObject['mails'][indexForChoosenContact];
    document.getElementById(currentContact).classList.add('bg-dark-blue');
    document.getElementById(oldContact).classList.remove('bg-dark-blue');
    loadChoosenContact(contactObject, indexForChoosenContact);
    
}

function loadChoosenContact(contactObject, indexForChoosenContact){
    document.getElementById('choosen-contact-loading-area').innerHTML = /*html*/`
                  <div class="choosen-contact-card">
            <div class="initials-big"></div>
            <div class="choosen-contact-name-area">
                <div id="choosen-contacts-name">${contactObject['names'][indexForChoosenContact]}</div>
                <div class="edit-area">
                    <div class="edit-area"><img src="./assets/img/edit.svg" alt="edit-icon">Edit</div>
                    <div class="edit-area"><img src="./assets/img/delete.svg" alt="delete-icon">Delete</div>
                </div>
            </div>
        </div>
        <div>Contact Information</div>
        <div>
            <div class="mail-and-phone">Email</div>
            <div id="choosen-mail">${contactObject['mails'][indexForChoosenContact]}</div>
        </div>
        <div>
            <div class="mail-and-phone">Phone</div>
            <div id="choosen-phone">${contactObject['phones'][indexForChoosenContact]}</div>
        </div>`;

}