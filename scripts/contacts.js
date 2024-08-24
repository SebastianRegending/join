let contacts = [
    // {
    //     "letter": "A",
    //     "names": ['Anton Mayer', 'Anja Schulz'],
    //     "mails": ['antonm@gmail.com', 'schulz@hotmail.com'],
    //     "phones": ['1234', '2345']
    // },
    // {
    //     "letter": "B",
    //     "names": ['Benedikt Ziegler'],
    //     "mails": ['benedikt@gmail.com'],
    //     "phones": ['6767', '8988']
    // },
    // {
    //     "letter": "C",
    //     "names": [],
    //     "mails": [],
    //     "phones": ['0000', '4444']
    // },
    // {
    //     "letter": "D",
    //     "names": ['David Eisenberg'],
    //     "mails": ['davidberg@gmail.com'],
    //     "phones": ['1565', '6763']
    // },

];

const BASE_URL = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts"

let initials = [];
let currentContact = [];


async function loadContacts(){
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();

    
    contacts = json2arrayContacts(responseToJson);
    
    Object.keys(contacts[0]).forEach((key) => {
        currentContact.push({[key]: contacts[0][key]});
      });
    

    for(let i = 0; i < currentContact.length; i++){
        document.getElementById('contacts-alphabet-list').innerHTML += `
        //    <div>
//         <div class="contact-card-letter">
//              ${currentContact[i]['name']}
//         </div>
//         <div id="contacts-${contacts[i]['letter']}-content" class="letter-card">
//         </div>
//    </div>`;
        
    }




    // contacts.forEach((element) => 
    //     console.log(element)

    // );

    // console.log(responseToJson)
    // Object.keys(responseToJson).forEach(key => {
        
    //     contacts.push(responseToJson[key])
    //             //document.getElementById('contacts-alphabet-list').innerHTML += `${responseToJson[key]}`;
    //   });


    // let n = 0;
// while(n < 4){
    
//     if(contacts[n]['names'].length > 0){

//    document.getElementById('contacts-alphabet-list').innerHTML += `
//    <div>
//         <div class="contact-card-letter">
//              ${contacts[n]['letter']}
//         </div>
//         <div id="contacts-${contacts[n]['letter']}-content" class="letter-card">
//         </div>
//    </div>`;

//     for(let i = 0; i < contacts[n]['names'].length; i++){
//         document.getElementById(`contacts-${contacts[n]['letter']}-content`).innerHTML += `
//         <div id="${contacts[n]['mails'][i]}" class="contact-datas" onclick="chooseContact(\'${contacts[n]['names'][i]}\', \'${contacts[n]['letter']}\')">
//             <div class="initials">KK</div>
//             <div>
//                 <div class="contact-card-names">${contacts[n]['names'][i]}</div>
//                 <a href='mailto:${contacts[n]['mails'][i]}'>${contacts[n]['mails'][i]}</a>
//             </div>
//         </div>`;
//     }
//     }
//     n++;
// }
}

function json2arrayContacts(json){
    let result = [];
    let keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

function pushArrays(index){
currentObject = contacts[index];
}


function chooseContact(name, letter){
    let oldContact
    if(currentContact){
    oldContact = currentContact;
    }
    let contactObject = contacts.find(obj => obj['letter'] == letter);
    let contactIndex = (element) => element == name;
    let indexForChoosenContact = contactObject['names'].findIndex(contactIndex);
    currentContact = contactObject['mails'][indexForChoosenContact];
    document.getElementById(currentContact).classList.add('bg-dark-blue');
    if(oldContact){
    document.getElementById(oldContact).classList.remove('bg-dark-blue');
    }
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
        <div class="contact-information" >Contact Information</div>
        <div>
            <div class="mail-and-phone">Email</div>
            <a class="mail-choosen" href="mailto:${contactObject['mails'][indexForChoosenContact]}">${contactObject['mails'][indexForChoosenContact]}</a>
        </div>
        <div>
            <div class="mail-and-phone">Phone</div>
            <a href="tel:${contactObject['phones'][indexForChoosenContact]}" class="phone-choosen" id="choosen-phone">${contactObject['phones'][indexForChoosenContact]}</a>
        </div>`;

}

function openAddContact(){
    document.getElementById("add-contact-dialog").classList.remove('d-none')
}

function closeAddContact(){
    document.getElementById('add-contact-name').value = ``;
    document.getElementById('add-contact-email').value = ``;
    document.getElementById('add-contact-phone').value = ``;
    document.getElementById("add-contact-dialog").classList.add('d-none')
}

async function createContact(path = "", data = {}){
    let name = document.getElementById('add-contact-name');
    let email = document.getElementById('add-contact-email');
    let phone = document.getElementById('add-contact-phone');
    let letter = name.value.charAt(0).toUpperCase();
    path = `/letter${letter}`

    createInitials(name.value);

    let initialsForSaving = initials.join('').toUpperCase();

    
    data = ({ name: name.value, email: email.value, phone: phone.value, initials: initialsForSaving });

    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    
    return responseToJson = await response.json();
    }


    function createInitials(name){
       let words = name.split(" ");
       initials = [];

       words.length = 2;
       words.forEach((element) => initials.push(element.charAt(0)));
    
    }


    