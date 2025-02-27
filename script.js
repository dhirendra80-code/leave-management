// script.js

document.addEventListener("DOMContentLoaded", function() {
    const staffForm = document.getElementById("staffForm");
    const leaveForm = document.getElementById("leaveForm");
    const staffList = document.getElementById("staffList");
    const leaveTable = document.getElementById("leaveTable");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchName");
    const searchResult = document.getElementById("searchResult");

    let staff = JSON.parse(localStorage.getItem("staffData")) || {};
    updateStaffList();
   

    staffForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("staffName").value;
        const position = document.getElementById("staffPosition").value;
        if (name && position) {
            if (!staff[name]) {
                staff[name] = { position, leaves: [] };
                saveToLocalStorage();
                updateStaffList();
            }
            document.getElementById("staffForm").reset();
        }
    });

    leaveForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const staffName = staffList.value;
        const date = document.getElementById("leaveDate").value;
        if (staffName && date) {
            staff[staffName].leaves.push(date);
            saveToLocalStorage();
            updateLeaveTable();
            document.getElementById("leaveForm").reset();
        }
    });

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const searchName = searchInput.value;
        if (staff[searchName]) {
            displaySearchResult(searchName);
        } else {
            searchResult.innerHTML = "<p style='color: red;'>No record found.</p>";
        }
    });

    function updateStaffList() {
        staffList.innerHTML = "";
        Object.keys(staff).forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = `${name} (${staff[name].position})`;
            staffList.appendChild(option);
        });
    }
    // Delete Selected Staff Feature
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Selected Staff";
    deleteButton.id = "deleteStaff";
    document.body.insertBefore(deleteButton, searchResult);
    
    deleteButton.addEventListener("click", function() {
        const staffName = staffList.value;
        if (staffName && staff.hasOwnProperty(staffName)) {
            delete staff[staffName];
            saveToLocalStorage();
            updateStaffList();
            updateLeaveTable();
            alert(`${staffName} has been deleted successfully.`);
        } else {
            alert("Please select a valid staff member to delete.");
        }
    });


    

    function saveToLocalStorage() {
        localStorage.setItem("staffData", JSON.stringify(staff));
    }

    function displaySearchResult(name) {
        const data = staff[name];
        if (data) {
            searchResult.innerHTML = `<h3 style='color: #007BFF;'>${name} (${data.position})</h3><ul>` +
                data.leaves.map(leave => `<li>${leave}</li>`).join('') + "</ul>" +
                `<button id='downloadPDF' style='padding: 10px; font-size: 16px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;'>Download as PDF</button>`;
            document.getElementById("downloadPDF").addEventListener("click", function() {
                downloadAsPDF(name, data);
            });
        }
    }

    function downloadAsPDF(name, data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Staff Name: ${name}`, 10, 10);
        doc.text(`Position: ${data.position}`, 10, 20);
        doc.text("Leave Dates:", 10, 30);
        data.leaves.forEach((leave, index) => {
            doc.text(`${index + 1}. ${leave}`, 10, 40 + index * 10);
        });
        doc.save(`${name}_leave_record.pdf`);
    }

    (function loadJsPDF() {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = () => {
            window.jsPDF = window.jspdf.jsPDF;
            console.log("jsPDF library loaded successfully");
        };
        document.head.appendChild(script);
    })();

    const logo = document.createElement("img");
    logo.src = window.location.origin + "/logo.png";
    logo.alt = "Leave Management System Logo";
    logo.style.width = "120px";
    logo.style.display = "block";
    logo.style.margin = "20px auto";
    logo.style.borderRadius = "10px";
    document.body.insertBefore(logo, document.body.firstChild);
});
document.addEventListener("DOMContentLoaded", function () {
    // Hide the leave list initially
   
    // Select all staff rows and add event listeners
    let staffRows = document.querySelectorAll(".staff-row");
    staffRows.forEach(row => {
        row.addEventListener("click", function () {
            let leaveTable = document.getElementById("leaveTable");
            // Toggle the leave list
            if (leaveTable.style.display === "none") {
                leaveTable.style.display = "table";
            } else {
                leaveTable.style.display = "none";
            }
        });
    });
});