/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}


// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;
    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            if(field == null){
                field = "Other/Not Specified";
            }
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/reset", {
        method: 'POST'
    });
    const responseData = await response.json();

    const messageElement = document.getElementById('resetResultMsg');
    messageElement.textContent = "demotable resetted successfully!";
    fetchTableData();
}

async function initDB(){
    const connected = await fetch("/initializeDB", {
        method: 'POST'
    });
    const data = await connected.json();
    fetchTableData();
    const message = document.getElementById("initResultMsg");
    message.textContent = "Success";

}

function toggleDropdown(){
  const dropdown = document.getElementById('myDropdown');
  if (dropdown.style.display == 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
  }
}

function toggleDropdown2(){
    const dropdown = document.getElementById('selecDD');
    if (dropdown.style.display == 'block') {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';
    }
  }

function toggleDropdown3(){
    const dropdown = document.getElementById('pDD');
    if (dropdown.style.display == 'block') {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';
    }
  }

function toggleDropdown4(){
    const dropdown = document.getElementById('genderDD');
    if (dropdown.style.display == 'block') {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';
    }
  }

async function insertCandidateParty(event){
    event.preventDefault();

    const _name = document.getElementById("nameInsert").value;
    const _party = document.getElementById("partyInsert").value;

    const genderVal = document.getElementById("genderDiv").innerHTML;

    if(genderVal == ""){
        alert("Error: No Gender Selected");
        return;
    }

    const response = await fetch('/insert-Candidate-Party', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: _name,
            party: _party,
            gender: genderVal
        })
    });
    
    

    const responseData = await response.json();
    console.log(responseData);
    if (responseData.success) {
        fetchTableData();
    } 
    else if(responseData.err.errorNum === 1){
        alert("Error: That name already exists");
    }
    else if(responseData.err.errorNum === 2291){
        alert("Error: That party does not exist");
    }
    else{
        alert("Error: " + responseData.err);
    }
}

async function updateCandidateParty(event){
    event.preventDefault();

    const oldPartyVal = document.getElementById("updateName").value;
    const newPartyVal = document.getElementById("updateParty").value;
    const newGenderVal = document.getElementById("genderDiv").innerHTML;

    if(newGenderVal == ""){
        alert("Error: No Gender Selected");
        return;
    }

    const response = await fetch('/update-party-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: oldPartyVal,
            newParty: newPartyVal,
            newGender: newGenderVal
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        fetchTableData();
    } 
    else {
        alert("Error: " + responseData.err);
    }
}

async function deleteCandidateParty(event){
    event.preventDefault();

    const nameVal = document.getElementById("nameDelete").value;

    const response = await fetch('/delete-party-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameVal
        })
    })

    const responseData = await response.json();

    if (responseData.success) {
        fetchTableData();
    } 
    else {
        alert("Error: " + responseData.err);
    }
}

async function projection(event){
    event.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selected = Array.from(checkboxes).map(box => box.value);
    const queryInput = selected.join(', ');
    const response = await fetch('/projection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryInput
        })
    })
    const headerRow = document.querySelector("#projT thead tr");
    headerRow.innerHTML = "";

    for(let header of selected){
        switch(header) {
            case "senatorName":
                header = "Senator Name";
                break;
            case "province":
                header = "Province";
                break;
            case "recommendedPMName":
                header = "Prime Minister that Recommended";
                break;
            case "parliamentaryGroupName":
                header = "Parliamentary Group";
                break;
            case "appointmentDate":
                header = "Date of Appointment"
                break;
        }
        const newHeader = document.createElement("th"); 
        newHeader.textContent = header; 
        headerRow.appendChild(newHeader); 
    }

    const responseData = await response.json();

    const tableBody = document.querySelector('#projT tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });


}

async function join(event){
    event.preventDefault();

    const nameVal = document.getElementById("joinName").value;
    
    const response = await fetch('/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameVal
        })
    })

    const responseData = await response.json();

    const tableHead = document.querySelector("#joinTable thead tr");
    const tableBody = document.querySelector("#joinTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const newHeader1 = document.createElement("th"); 
    newHeader1.textContent = "Name"; 
    tableHead.appendChild(newHeader1);
    
    const newHeader2 = document.createElement("th"); 
    newHeader2.textContent = "Party"; 
    tableHead.appendChild(newHeader2); 

    const newHeader3 = document.createElement("th"); 
    newHeader3.textContent = "Party Founding Date"; 
    tableHead.appendChild(newHeader3); 

    const newHeader4 = document.createElement("th"); 
    newHeader4.textContent = "Current Electorial Seats Held by Party"; 
    tableHead.appendChild(newHeader4);
    
    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function and() {
    const form = document.getElementById("Query");

    const container = document.createElement("div");

    container.innerHTML = `
        And: <input type="text" class="andsign" placeholder="Enter >, <, or = and then a number" required> <br><br>
    `;

    form.appendChild(container);
}

async function or() {
    const form = document.getElementById("Query");

    const container = document.createElement("div");

    container.innerHTML = `
        Or: <input type="text" class="orsign" placeholder="Enter >, <, or = and then a number" required> <br><br>
    `;

    form.appendChild(container);
}

async function selection(event){
    event.preventDefault();

    const andVals = document.querySelectorAll('.andsign')
    const orVals = document.querySelectorAll('.orsign')

    let query = "";


}

function Province(prov){
    document.getElementById("Province").innerHTML = prov;
}

function gender(g){
    
    document.getElementById("genderDiv").innerHTML = g;
}

function loadContent(contentId) {
  const contentDiv = document.getElementById('content');

  const contentMap = {
    Insert: `<h2>Add Candidate Information</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="nameInsert" placeholder="Enter Name" required> <br><br>
                        Party: <input type="text" id="partyInsert" placeholder="Enter Party" required> <br><br>
                        New Gender: <div class="dropdown" class="box">
                    <button type = "button" id="genderbtn">Dropdown</button>
                    <div id="genderDD" class="dropdown-content">
                        <a onclick="gender('Male')">Male</a>
                        <a onclick="gender('Female')">Female</a>
                        <a onclick="gender('Other/Not Specified')">Other/Not Specified</a>
                    </div>
                </div>
                <div id="genderDiv">
                </div>
                        <button type="submit"> Add </button> <br>
                    </form>
                </div>`,
    Update: `<h2>Update Candidates Party</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="updateName" placeholder="Enter Name" required> <br><br>
                        New Party: <input type="text" id="updateParty" placeholder="Enter Party"> <br><br>
                New Gender: <div class="dropdown" class="box">
                    <button type = "button" id="genderbtn">Dropdown</button>
                    <div id="genderDD" class="dropdown-content">
                        <a onclick="gender('Male')">Male</a>
                        <a onclick="gender('Female')">Female</a>
                        <a onclick="gender('Other/Not Specified')">Other/Not Specified</a>
                    </div>
                </div>
                <div id="genderDiv">
                </div>
                    <button type="submit"> Update </button> <br>
                    </form>
                </div>`,
    Delete: `<h2>Delete Candidate</h2>
                <div class = "inputFields">
                    <form id="Query">
                        Name: <input type="text" id="nameDelete" placeholder="Enter Name" required> <br><br>
                        <button type="submit"> Delete </button> <br>
                    </form>
                </div>`,
    Selection: `<h2>Selection Query</h2>
                    <div class="dropdown" class="box">
                        <button id="selecbtn">Dropdown</button>
                        <div id="selecDD" class="dropdown-content">
                            <a onclick="loadContent('And')">And</a>
                            <a onclick="loadContent('Or')">Or</a>
                        </div>
                    </div>
                    <div class = "inputFields">
                    <form id="Query">
                        <div class="dropdown" class="box">
                        <button id="Prov">Dropdown</button>
                        <div id="pDD" class="dropdown-content">
                            <a onclick="Province('Any')">Any</a>
                            <a onclick="Province('British Columbia')">BC</a>
                            <a onclick="Province('Alberta')">Alberta</a>
                            <a onclick="Province('Saskatchewan')">Saskatchewan</a>
                            <a onclick="Province('Manitoba')">Manitoba</a>
                            <a onclick="Province('Ontario')">Ontario</a>
                            <a onclick="Province('Quebec')">Quebec</a>
                            <a onclick="Province('Newfoundland and Labrador')">Newfoundland and Labrador</a>
                            <a onclick="Province('Prince Edward Island')">Prince Edward Island</a>
                            <a onclick="Province('Nova Scotia')">Nova Scotia</a>
                            <a onclick="Province('New Brunswick')">New Brunswick</a>
                            <a onclick="Province('Yukon')">Yukon</a>
                            <a onclick="Province('Nunavut')">Nunavut</a>
                            <a onclick="Province('Northwest Territories')">Northwest Territories</a>
                        </div>
                    <div id="Province">
                    </div>
                    </div>
                        <button type="submit"> Submit </button> <br>
                    </form>
                    </div>`,
    Projection: `<h2>Find Senator Information</h2>
                    <div class="inputFields">
                        <form id="Query">
                            <input type="checkbox" value="senatorName" id="senatorName"> Senator Name
                            <input type="checkbox" value="province" id="province"> Province
                            <input type="checkbox" value="recommendedPMName" id="recommendedPMName"> PM
                            <input type="checkbox" value ="parliamentaryGroupName" id="parliamentaryGroupName"> Parliamentary Group
                            <input type="checkbox" value="appointmentDate" id="appointmentDate"> Appointment Date
                            <button type="submit"> Submit </button> <br>
                        </form>
                    </div>
                    <table id="projT" class="box" border="1">
                        <thead>
                            <tr>
                                
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>`,
    Join: `<h2>Find Information about a Party and all Candidates</h2>
                <div class = "inputFields">
                    <form id="Query">
                        Name: <input type="text" id="joinName" placeholder="Enter Name" required> <br><br>
                        <button type="submit"> Submit </button> <br>
                    </form>
                </div>
                <table id="joinTable" class="box" border="1">
                    <thead>
                        <tr>
                             
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>`

  };

  if(contentId != "And" && contentId != "Or"){
    contentDiv.innerHTML = contentMap[contentId];
  }
  if(contentId == "Insert"){
    document.getElementById("Query").addEventListener("submit", insertCandidateParty);
    try{
        document.getElementById("selecbtn").removeEventListener("click", toggleDropdown2);
    }
    catch{
        
    }
    try{
        document.getElementById("Prov").removeEventListener("click", toggleDropdown3);
    }
    catch{

    }
    document.getElementById("genderbtn").addEventListener("click", toggleDropdown4)
  }
  else if(contentId == "Update"){
    document.getElementById("Query").addEventListener("submit", updateCandidateParty);
    try{
        document.getElementById("selecbtn").removeEventListener("click", toggleDropdown2);
    }
    catch{
        
    }
    try{
        document.getElementById("Prov").removeEventListener("click", toggleDropdown3);
    }
    catch{

    }
    document.getElementById("genderbtn").addEventListener("click", toggleDropdown4)
  }
  else if(contentId == "Delete"){
    document.getElementById("Query").addEventListener("submit", deleteCandidateParty);
    try{
        document.getElementById("selecbtn").removeEventListener("click", toggleDropdown2);
    }
    catch{
        
    }
    try{
        document.getElementById("Prov").removeEventListener("click", toggleDropdown3);
    }
    catch{

    }
  }
  else if(contentId == "Projection"){
    document.getElementById("Query").addEventListener("submit", projection);
    try{
        document.getElementById("selecbtn").removeEventListener("click", toggleDropdown2);
    }
    catch{
        
    }
    try{
        document.getElementById("Prov").removeEventListener("click", toggleDropdown3);
    }
    catch{

    }
  }
  else if(contentId == "Join"){
    document.getElementById("Query").addEventListener("submit", join);
    try{
        document.getElementById("selecbtn").removeEventListener("click", toggleDropdown2);
    }
    catch{

    }
    try{
        document.getElementById("Prov").removeEventListener("click", toggleDropdown3);
    }
    catch{

    }
  }
  else if(contentId == "Selection"){
    document.getElementById("Query").addEventListener("submit", selection);
    document.getElementById("selecbtn").addEventListener("click", toggleDropdown2);
    document.getElementById("Prov").addEventListener("click", toggleDropdown3);
  }
  else if(contentId == "And"){
    and();
  }
  else if(contentId == "Or"){
    or();
  }
  document.getElementById("genderDiv").innerHTML = "";
  document.getElementById('myDropdown').style.display = 'none';
}

async function groupBy(event){
    event.preventDefault();

    const response = await fetch('/groupBy', {
        method: 'GET'
    });
    
    const responseData = await response.json();

    const tableHead = document.querySelector("#queryTable thead tr");
    const tableBody = document.querySelector("#queryTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const newHeader1 = document.createElement("th"); 
    newHeader1.textContent = "Party"; 
    tableHead.appendChild(newHeader1); 
    const newHeader2 = document.createElement("th");
    newHeader2.textContent = "Seats"; 
    tableHead.appendChild(newHeader2);
    
    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });


}

async function having(event){
    event.preventDefault();

    const response = await fetch('/having', {
        method: 'GET'
    });

    const responseData = await response.json();

    const tableHead = document.querySelector("#queryTable thead tr");
    const tableBody = document.querySelector("#queryTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const newHeader1 = document.createElement("th"); 
    newHeader1.textContent = "Party"; 
    tableHead.appendChild(newHeader1); 
    
    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

async function nestedGroupBy(event){
    event.preventDefault();

    const response = await fetch('/nestedGroupBy', {
        method: 'GET'
    });

    const responseData = await response.json();

    const tableHead = document.querySelector("#queryTable thead tr");
    const tableBody = document.querySelector("#queryTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const newHeader1 = document.createElement("th"); 
    newHeader1.textContent = "Riding"; 
    tableHead.appendChild(newHeader1); 
    const newHeader2 = document.createElement("th");
    newHeader2.textContent = "Year"; 
    tableHead.appendChild(newHeader2);
    const newHeader3 = document.createElement("th");
    newHeader2.textContent = "Vote Difference"; 
    tableHead.appendChild(newHeader3);
    
    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

async function division(event){
    event.preventDefault();

    const response = await fetch('/division', {
        method: 'GET'
    });

    const responseData = await response.json();

    const tableHead = document.querySelector("#queryTable thead tr");
    const tableBody = document.querySelector("#queryTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const newHeader1 = document.createElement("th"); 
    newHeader1.textContent = "Party"; 
    tableHead.appendChild(newHeader1); 
    
    responseData.data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}



async function selection(event){
    event.preventDefault();
}
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("dropbtn").addEventListener("click", toggleDropdown);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("initTable").addEventListener("click", initDB);
    document.getElementById("Group By").addEventListener("click", groupBy);
    document.getElementById("Having").addEventListener("click", having);
    document.getElementById("Nested Group By").addEventListener("click", nestedGroupBy);
    document.getElementById("Division").addEventListener("click", division);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}