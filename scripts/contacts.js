let contacts = [
    {
        "letter": "A",
        "names": ['Anton Mayer', 'Anja Schulz'],
        "mails": ['antonm@gmail.com', 'schulz@hotmail.com']
    },
    {
        "letter": "B",
        "names": ['Benedikt Ziegler'],
        "mails": ['benedikt@gmail.com']
    },
    {
        "letter": "C",
        "names": [],
        "mails": []
    },
    {
        "letter": "D",
        "names": ['David Eisenberg'],
        "mails": ['davidberg@gmail.com']
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
        <div class="contact-datas" onclick="chooseContact(\'${contacts[n]['names'][i]}\')">
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


function chooseContact(name){

}