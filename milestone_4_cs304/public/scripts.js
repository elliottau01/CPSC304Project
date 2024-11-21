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

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
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

    const oldPartyVal = document.getElementById("OldName").value;
    const newPartyVal = document.getElementById("NewName").value;

    const response = await fetch('/update-party-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldParty: oldPartyVal,
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
function loadContent(contentId) {
  const contentDiv = document.getElementById('content');

  const contentMap = {
    Insert: `<h2>Insert Query</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="nameInsert" placeholder="Enter Name" required> <br><br>
                        Party: <input type="text" id="partyInsert" placeholder="Enter Party" required> <br><br>
                        <button type="submit"> insert </button> <br>
                    </form>
                </div>`,
    Update: `<h2>Update Query</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Old Party: <input type="text" id="OldName" placeholder="Enter Name" required> <br><br>
                        New Party: <input type="text" id="NewName" placeholder="Enter Party" required> <br><br>
                        <button type="submit"> insert </button> <br>
                    </form>
                </div>`,
    Delete: `<h2>Delete Query</h2>
                <div class = "inputFields">
                        <form id="Query">
                        Name: <input type="text" id="nameDelete" placeholder="Enter Name" required> <br><br>
                        <button type="submit"> insert </button> <br>
                    </form>
                </div>`
  };
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
  document.getElementById('myDropdown').style.display = 'none';
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("dropbtn").addEventListener("click", toggleDropdown);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}