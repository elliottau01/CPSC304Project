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
    console.log(demotableContent);
    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}
window.onload = async function initDB(){
    const connected = await fetch("/initializeDB", {
        method: 'POST'
    });
}
async function initDB(){
    const connected = await fetch("/initializeDB", {
        method: 'POST'
    });
    const data = await connected.json();
    if(data.success){
        const message = document.getElementById("initResultMsg");
        message.textContent = "Success";
    }
    else{
        alert("error");
    }
}

function toggleDropdown(){
  const dropdown = document.getElementById('myDropdown');
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

    const response = await fetch('/insert-Candidate-Party', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: _name,
            party: _party
        })
    });
    
    const responseData = await response.json();

    if (responseData.success) {
        fetchTableData();
    } else {
        console.log("Error");
    }
}

async function updateCandidateParty(event){
    event.preventDefault();

    const oldPartyVal = document.getElementById("updateName").value;
    const newPartyVal = document.getElementById("updateParty").value;

    const response = await fetch('/update-party-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: oldPartyVal,
            newParty: newPartyVal
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        fetchTableData();
    } 
    else {
        console.log("Error");
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
        console.log("Error");
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
    
    const responseData = await response.json;
    console.log(responseData.data);
}

async function join(event){
    event.preventDefault();

    const nameVal = document.getElementById("joinName");
    
    const response = await fetch('/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameVal
        })
    })
    const responseData = await response.json;
    console.log(responseData.data);
}

function loadContent(contentId) {
  const contentDiv = document.getElementById('content');

  const contentMap = {
    Insert: `<h2>Insert Query</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="nameInsert" placeholder="Enter Name" required> <br><br>
                        Party: <input type="text" id="partyInsert" placeholder="Enter Party" required> <br><br>
                        <button type="submit"> Insert </button> <br>
                    </form>
                </div>`,
    Update: `<h2>Update Query</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="updateName" placeholder="Enter Name" required> <br><br>
                        New Party: <input type="text" id="updateParty" placeholder="Enter Party" required> <br><br>
                        <button type="submit"> Update </button> <br>
                    </form>
                </div>`,
    Delete: `<h2>Delete Query</h2>
                <div class = "inputFields">
                    <form id="Query">
                        Name: <input type="text" id="nameDelete" placeholder="Enter Name" required> <br><br>
                        <button type="submit"> Delete </button> <br>
                    </form>
                </div>`,
    Projection: `<h2>Projection</h2>
                    <div class="inputFields">
                        <form id="Query">
                            <input type="checkbox" value="senatorName" id="senatorName"> Senator Name
                            <input type="checkbox" value="province" id="province"> Province
                            <input type="checkbox" value="recommendedPMName" id="recommendedPMName"> PM
                            <input type="checkbox" value ="parliamentaryGroupName" id="parliamentaryGroupName"> Parliamentary Group
                            <input type="checkbox" value="appointmentDate" id="appointmentDate"> Appointment Date
                            <button type="submit"> Submit </button> <br>
                        </form>
                    </div>`,
    Join: `<h2>Join Query</h2>
                <div class = "inputFields">
                    <form id="Query">
                        Name: <input type="text" id="joinName" placeholder="Enter Name" required> <br><br>
                        <button type="submit"> Join </button> <br>
                    </form>
                </div>`

  };
  console.log(contentId);
  contentDiv.innerHTML = contentMap[contentId];
  if(contentId == "Insert"){
    document.getElementById("Query").addEventListener("submit", insertCandidateParty);
  }
  else if(contentId == "Update"){
    document.getElementById("Query").addEventListener("submit", updateCandidateParty);
  }
  else if(contentId == "Delete"){
    document.getElementById("Query").addEventListener("submit", deleteCandidateParty);
  }
  else if(contentId == "Projection"){
    document.getElementById("Query").addEventListener("submit", projection);
  }
  else if(contentId == "Join"){
    document.getElementById("Query").addEventListener("submit", join);
  }
  document.getElementById('myDropdown').style.display = 'none';
}

async function groupBy(event){
    event.preventDefault();

    const response = await fetch('/groupBy', {
        method: 'GET'
    });
    
    const responseData = await response.json();
    console.log(responseData.data);
}

async function having(event){
    event.preventDefault();

    const response = await fetch('/having', {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log(responseData.data);
}

async function nestedGroupBy(event){
    event.preventDefault();

    const response = await fetch('/nestedGroupBy', {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log(responseData.data);
}

async function division(event){
    event.preventDefault();

    const response = await fetch('/division', {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log(responseData.data);
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