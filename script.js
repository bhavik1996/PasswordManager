let form = document.getElementById("passwordForm");
let editId = null;
let btn = document.getElementById("submitBtn");

let passwordList = [];
let addEntry = (portal, link, username, password, date, notes) => {
  let entry = {
    id: Date.now(), //Unique ID for deleting/editing later
    portal,
    link,
    username,
    password,
    date,
    notes,
  };
  passwordList.push(entry);
  updateTable();
};

// console.log(passwordList);

let tableBody = document.getElementById("tableBody");
let noDataRow = document.getElementById("noData");

function updateTable() {
  tableBody.innerHTML = ""; //Clear existing rows

  if (passwordList.length === 0) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 8;
    td.textContent = "No data added";

    tr.appendChild(td);
    tableBody.appendChild(tr);
    return;
  }

  passwordList.forEach((entry, index) => {
    let tr = document.createElement("tr");

    let tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;

    let tdPortal = document.createElement("td");
    tdPortal.textContent = entry.portal;

    let tdLink = document.createElement("td");
    let linkTag = document.createElement("a");
    linkTag.href = entry.link;
    linkTag.target = "_blank";
    linkTag.textContent = entry.link;

    let tdUsername = document.createElement("td");
    tdUsername.textContent = entry.username;

    let tdPassword = document.createElement("td");
    tdPassword.textContent = "••••••";
    //stores actual Password safely
    tdPassword.dataset.password = entry.password;
    tdPassword.dataset.visible = "false";

    let tdDate = document.createElement("td");
    tdDate.textContent = entry.date;

    let tdNotes = document.createElement("td");
    tdNotes.textContent = entry.notes;

    let tdActions = document.createElement("td");
    tdActions.classList.add("flex");

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "delete");

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("btn", "edit");

    let eyeBtn = document.createElement("button");
    eyeBtn.textContent = "👁️";
    eyeBtn.classList.add("btn");

    let copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.classList.add("btn", "copy");

    deleteBtn.addEventListener("click", () => {
      deleteEntry(entry.id);
    });

    editBtn.addEventListener("click", () => {
      editEntry(entry.id);
    });

    eyeBtn.addEventListener("click", () => {
      if (tdPassword.dataset.visible === "false") {
        tdPassword.textContent = tdPassword.dataset.password;
        tdPassword.dataset.visible = "true";
      } else {
        tdPassword.textContent = "••••••"; //kept •••••• to keep consistency
        tdPassword.dataset.visible = "false";
      }
    });

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(entry.password);
        //made success and error style
        showToast("Password Copied", "sucess"); //changed alert to showToast
      } catch (err) {
        showToast("Error occurred", "error");
      }
      // either "alert("Password Copied");" or the below one
      // copyBtn.textContent = "Password Copied";
      // setTimeout(() => {
      //   copyBtn.textContent = "Copy";
      // }, 1500);
    });

    tr.appendChild(tdIndex);
    tr.appendChild(tdPortal);
    tr.appendChild(tdLink);
    tr.appendChild(tdUsername);
    tr.appendChild(tdPassword);
    tr.appendChild(tdDate);
    tr.appendChild(tdNotes);
    tr.appendChild(tdActions);
    tdActions.appendChild(eyeBtn);
    tdActions.appendChild(copyBtn);
    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);
    tdLink.appendChild(linkTag);
    tableBody.appendChild(tr);
    // let row = `
    // <tr class='tr'>
    //   <td class="td">${index + 1}</td>
    //         <td class="td">${entry.portal}</td>
    //         <td class="td"><a href="${entry.link}" target="_blank">${entry.link}</a></td>
    //         <td class="td">${entry.username}</td>
    //         <td class="td">••••••</td>
    //         <td class="td">${entry.date}</td>
    //         <td class="td">${entry.notes}</td>
    //         <td class="flex">
    //          <button class="btn eyeBtn show" onclick="showPassword(${entry.id})">
    //             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash-fill">
    //               <path
    //                 d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"
    //               />
    //               <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
    //             </svg></button>
    //             <button class="btn edit" onclick="editEntry(${entry.id})">Edit</button>
    //             <button class="btn delete" onclick="deleteEntry(${entry.id})">Delete</button>
    //         </td>
    // </tr>`;
    // tableBody.innerHTML += row;
  });
}

function editEntry(id) {
  let entry = passwordList.find((item) => item.id === id);
  document.getElementById("portalName").value = entry.portal;
  document.getElementById("portalLink").value = entry.link;
  document.getElementById("userName").value = entry.username;
  document.getElementById("passwordInput").value = entry.password;
  document.getElementById("inputDate").value = entry.date;
  document.getElementById("notes").value = entry.notes;

  editId = id; //marks edit mode
  btn.textContent = editId ? "Update" : "Submit";
}

function deleteEntry(id) {
  passwordList = passwordList.filter((entry) => entry.id !== id);
  updateTable();
}

function showToast(message, type = "sucess") {
  let container = document.getElementById("toastContainer");

  let toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  //Timeout animation trigger
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  //Remove trigger animation
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  //   console.log("Form Submitted");
  console.log("editId:", editId);
  let portal = document.getElementById("portalName").value;
  let link = document.getElementById("portalLink").value;
  let username = document.getElementById("userName").value;
  let password = document.getElementById("passwordInput").value;
  let date = document.getElementById("inputDate").value;
  let notes = document.getElementById("notes").value;

  //   addEntry(portal, link, username, password, date, notes);

  if (editId) {
    //Updates Existing entries
    passwordList = passwordList.map((entry) => (entry.id === editId ? { ...entry, portal, link, username, password, date, notes } : entry));

    editId = null;
    updateTable();
  } else {
    //Add new
    addEntry(portal, link, username, password, date, notes);
  }

  btn.textContent = "Submit";
  form.reset(); // Clears form for next entry
});
