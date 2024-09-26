/**
 * Checks if the input is expanded and shows the checkboxes if it is
 */
function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
      document.addEventListener('click', closeDropdownOnClickOutside);
    } else {
      checkboxes.style.display = "none";
      expanded = false;
      document.removeEventListener('click', closeDropdownOnClickOutside);
    }
  }
    
  /**
   * Closes the Dropdown Menu
   * @param {*} event 
   */
  function closeDropdownOnClickOutside(event) {
    let checkboxes = document.getElementById("checkboxes");
    let selectBox = document.querySelector(".selectBox");
    if (!selectBox.contains(event.target) && !checkboxes.contains(event.target)) {
        checkboxes.style.display = "none";
        expanded = false;
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
  }
    
  /**
   * Loads the contacts from database to the Checkbox-Input
   */
  async function loadContacts() {
    let response = await fetch(URL_contacts + ".json");
    let responseToJson = await response.json();
    let contactsToConvertLetters = jsonToArrayContacts(responseToJson);
    let compare = sessionStorage.getItem("userId");
    for (let n = 0; n < contactsToConvertLetters.length; n++) {
      IDs = jsonToArrayIDs(contactsToConvertLetters[n])
      for (let i = 0; i < IDs.length; i++) {
        if (compare && compare == IDs[i]['userid']) {
          document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplateYou(n, i);
        } else {
          document.getElementById('checkboxes').innerHTML += createContactsCheckboxTemplate(n, i);
        }
      }
    }
  }
    
  /**
   * Creates a contacts-template
   * 
   * @param {number} - while loop, that are the letters
   * @param {number} - for loop, that are the indexed of the contacts 
   * @returns Contacts-Template in HTML
   */
  function createContactsCheckboxTemplate(n, i) {
    return /*html*/`
        <label for="contact-${n}${i}" class="contact-for-form">
              <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
              </div>
              <div>${IDs[i]['name']}
              </div> 
              <input class="input-check" type="checkbox" name="contacts" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}"  data-color="${IDs[i]['color']}" onclick="addCircle('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}')"/>
        </label>
      `
  }
    
  /**
   * Creates a contacts-template
   * 
   * @param {number} - for loop, that are the letters
   * @param {number} - for loop, that are the indexed of the contacts 
   * @returns Contacts-Template in HTML with additional You
   */
  function createContactsCheckboxTemplateYou(n, i) {
    return /*html*/`
        <label for="contacts${n}" class="contact-for-form">
              <div id="contact-${n}-circle" class="circle circle-${IDs[i]['color']}">${IDs[i]['initials']}
              </div>
              <div>${IDs[i]['name']}(You)
              </div> 
              <input class="input-check" type="checkbox" name="contacts" value="${IDs[i]['name']}" id="contact-${n}${i}" data-letter="${IDs[i]['initials'].charAt(0)}" data-id="${IDs[i]['id']}" onclick="addCircle('${IDs[i]['color']}', 'contact-${n}${i}', '${IDs[i]['initials']}')"/>
        </label>
      `
  }
    
  /**
   * Creates an initials-circle to the circle-area-assigned-contacts, if it's checked
   * 
   * @param {string} color 
   * @param {string} id 
   * @param {string} inits 
   */
  function addCircle(color, id, inits) {
    let check = document.getElementById(id);
    if (check.checked == true) {
      checkedContactsCircles.push({ "id": id, "color": color, "inits": inits });
    } else {
      checkedContactsCircles.splice(checkedContactsCircles.findIndex(item => item.id === id), 1);
    }
    document.getElementById('circle-area-assigned-contacts').innerHTML = ``;
    if (checkedContactsCircles.length > 6) {
      for (let i = 0; i < 6; i++) {
        document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-${checkedContactsCircles[i]['color']} assigned-contacts z${i + 1}">${checkedContactsCircles[i]['inits']}</div>`;
      }
      document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-grey assigned-contacts z${7}">+${checkedContactsCircles.length-6}</div>`
    } else {
      for (let i = 0; i < checkedContactsCircles.length; i++) {
        document.getElementById('circle-area-assigned-contacts').innerHTML += `<div class="circle circle-${checkedContactsCircles[i]['color']} assigned-contacts z${i + 1}">${checkedContactsCircles[i]['inits']}</div>`;
      }
    }
  }

  /**
 * Searches for selected checkboxes and pushs them in an array
 * 
 * @returns selected checkboxes
 */
function getSelected() {
    let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
    let selectedData = [];
  
    checkboxes.forEach((checkbox) => {
      let name = checkbox.value;
      let id = checkbox.getAttribute('data-id');
      let letter = checkbox.getAttribute('data-letter');
      let color = checkbox.getAttribute('data-color');
      selectedData.push({ name: name, id: id, letter: letter, color: color });
    });
    return selectedData;
  }

  