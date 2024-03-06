"use strict";
// Exporting table details to a excel sheet
function exportToExcel() {
    const table = document.getElementById('myTable');
    if (table) {
        // Clone the table to exclude images
        const tableClone = table.cloneNode(true);
        const images = tableClone.querySelectorAll('img');
        images.forEach((img) => {
            var _a;
            (_a = img.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(img);
        });
        const html = tableClone.outerHTML;
        const url = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);
        const link = document.createElement('a');
        link.download = 'EmployeeData.xls';
        link.href = url;
        link.click();
    }
}
function addEmployees(employees) {
    var tableBody = document.getElementById('employeeList');
    employees.forEach(function (employee, index) {
        var addEmpRow = tableBody.insertRow();
        var rowCheckBox = addEmpRow.insertCell(0);
        rowCheckBox.className = "employee-checkbox";
        var name = addEmpRow.insertCell(1);
        name.classList.add('nameCell');
        var location = addEmpRow.insertCell(2);
        var department = addEmpRow.insertCell(3);
        var role = addEmpRow.insertCell(4);
        var empno = addEmpRow.insertCell(5);
        var empStatus = addEmpRow.insertCell(6);
        var joinDate = addEmpRow.insertCell(7);
        var actionsMenu = addEmpRow.insertCell(8);
        actionsMenu.id = "ellipsisid";
        var selectEmployee = document.createElement('input');
        selectEmployee.type = 'checkbox';
        rowCheckBox.appendChild(selectEmployee);
        name.innerHTML = `
            <div>
                <img src="${employee.image}" alt="Img" class="dynamicProfile">
            </div>
            <div class="userDetails">
                <span>${employee.firstName}</span>
                <span>${employee.lastName}</span>
                <p>${employee.email}</p>
            </div>
        `;
        location.innerHTML = employee.location;
        department.innerHTML = employee.department;
        role.innerHTML = employee.role;
        empno.innerHTML = employee.empno;
        var statusButton = document.createElement('button');
        statusButton.innerHTML = "Active";
        statusButton.classList.add('statusBtn');
        empStatus.appendChild(statusButton);
        joinDate.innerHTML = employee.joinDate;
        // Create a select element
        var actionSelection = document.createElement('select');
        actionSelection.id = 'mySelect';
        var actionOptions = [
            { text: '.....' },
            { text: 'Details', value: 'view details' },
            { text: 'Edit', value: 'edit' },
            { text: 'Delete', value: 'delete' }
        ];
        // Create and append option elements to the select element
        actionOptions.forEach(function (option) {
            var ellipsisOptions = document.createElement('option');
            ellipsisOptions.textContent = option.text;
            ellipsisOptions.value = option.value || "";
            ellipsisOptions.style.borderRadius = "5px";
            ellipsisOptions.style.backgroundColor = 'white';
            actionSelection.appendChild(ellipsisOptions);
        });
        actionsMenu.appendChild(actionSelection);
        // Changing background color of the ellipsis
        addEmpRow.addEventListener('mouseenter', function () {
            actionSelection.style.backgroundColor = 'rgb(250, 217, 217)';
        });
        addEmpRow.addEventListener('mouseleave', function () {
            actionSelection.style.backgroundColor = '';
        });
        //Ends here
        actionSelection.addEventListener('change', function (event) {
            // Get the selected value
            var selectedAction = event.target.value;
            if (selectedAction === 'delete') {
                if (confirm("Are you sure, you want to delete this row?")) {
                    var selectedRow = actionSelection.closest('tr');
                    var emp = selectedRow.cells[5].textContent;
                    console.log(emp);
                    selectedRow.remove();
                    // Remove corresponding data from local storage
                    var employees = JSON.parse(localStorage.getItem('employees')) || [];
                    var index = employees.findIndex(function (employee) {
                        return employee.empno === emp;
                    });
                    employees.splice(index, 1);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
            }
            if (selectedAction === 'edit') {
                var selectedRow = actionSelection.closest('tr');
                var emp = selectedRow.cells[5].textContent;
                const rowData = {
                    empno: employee.empno,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    location: employee.location,
                    department: employee.department,
                    role: employee.role,
                    joinDate: employee.joinDate,
                    dateOfBirth: employee.dateOfBirth,
                    phone: employee.phone,
                    profile: employee.image,
                    managerName: employee.manager,
                    projectName: employee.project,
                    index: emp,
                    status: employee.status
                };
                localStorage.setItem('editEmployeeData', JSON.stringify(rowData));
                window.location.href = 'add-employee.html';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    var employees = JSON.parse(localStorage.getItem('employees')) || [];
    addEmployees(employees);
});
//Ends here
//Multi select dropdown starts here
document.body.addEventListener('click', function (event) {
    const multiselectDropdowns = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdowns.forEach(function (dropdown) {
        if (dropdown.style.display === 'block' && !event.target.closest('.multiselect-dropdown')) {
            dropdown.style.display = 'none';
        }
    });
});
function toggleDropdown(selectBox) {
    const dropdownContent = selectBox.nextElementSibling;
    const isHidden = dropdownContent.style.display === 'none' || !dropdownContent.style.display;
    // Hide all other dropdown contents
    const multiselectDropdownsContent = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdownsContent.forEach(function (dropdownValue) {
        if (dropdownValue !== dropdownContent) {
            dropdownValue.style.display = 'none';
        }
    });
    // Toggle the display of the current dropdown content
    dropdownContent.style.display = isHidden ? 'block' : 'none';
}
function updateSelectedItems(multiselectCheckbox) {
    var _a, _b, _c;
    const filterName = (_a = multiselectCheckbox.closest('.multiselect-dropdown')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-filter');
    const multiSelectedItems = (_b = multiselectCheckbox.closest('.multiselect-dropdown')) === null || _b === void 0 ? void 0 : _b.querySelector('.selected');
    if (filterName && multiSelectedItems) {
        const selectedOptions = Array.from(((_c = multiselectCheckbox.closest('.multiselect-dropdown')) === null || _c === void 0 ? void 0 : _c.querySelectorAll('input[type="checkbox"]:checked')) || [])
            .map(function (checkbox) {
            return checkbox.value; // Explicitly cast to HTMLInputElement
        });
        multiSelectedItems.textContent = filterName + ': ' + (selectedOptions.length > 0 ? selectedOptions.length : '0') + ' selected';
        filterarray[filterName] = selectedOptions;
        const filterButtons = document.getElementById('right-filter');
        if (filterButtons) {
            filterButtons.classList.add('rightFilterbtns');
        }
    }
}
//Ends here
// Buttons filtering starts here
let employees = [];
const employeesData = localStorage.getItem('employees');
if (employeesData !== null) {
    employees = JSON.parse(employeesData);
}
let filterarray = {
    Status: [],
    Department: [],
    Location: []
};
// Filtering based on buttons
const letterButtons = document.querySelectorAll(".letter-btn");
let previousButton = null;
let filterButtonText = "";
letterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtonText = button.innerText;
        // Restore styles of the previously clicked button
        if (previousButton !== null) {
            previousButton.style.backgroundColor = "";
            previousButton.style.color = "";
        }
        button.style.backgroundColor = "rgb(249, 23, 23)";
        button.style.color = 'white';
        // Update the previousButton variable to the currently clicked button
        previousButton = button;
        displayresult();
    });
});
// Ends here
let startsWithLetter;
let statusMatch;
let locationMatch;
let departmentMatch;
function displayresult() {
    let results = employees.filter(ele => {
        let name = ele.firstName.toUpperCase();
        startsWithLetter = filterButtonText === "" || name.startsWith(filterButtonText);
        statusMatch = filterarray.Status.length === 0 || filterarray.Status.includes(ele.status);
        locationMatch = filterarray.Location.length === 0 || filterarray.Location.includes(ele.location);
        departmentMatch = filterarray.Department.length === 0 || filterarray.Department.includes(ele.department);
        return startsWithLetter && statusMatch && departmentMatch && locationMatch;
    });
    let employeeList = document.getElementById('employeeList');
    let filterImg = document.getElementById('filter-img');
    if (results.length === 0) {
        if (employeeList !== null) {
            employeeList.innerHTML = "<tr><td colspan='6'>No matches found</td></tr>";
        }
        if (filterImg !== null) {
            filterImg.style.color = "black";
        }
    }
    else {
        if (employeeList !== null) {
            employeeList.innerHTML = "";
        }
        if (filterImg !== null && filterButtonText !== "") {
            filterImg.style.color = "red";
        }
        addEmployees(results);
        let tableCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]');
        tableCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('click', function () {
                tableCheckboxListeners();
            });
        });
        tableHeadCheckbox();
    }
}
// Ends here
//Clearing the filter using reset button
function displayTable() {
    filterarray = {
        Status: [],
        Department: [],
        Location: []
    };
    filterButtonText = "";
    const filterButtons = document.getElementById('right-filter');
    if (filterButtons !== null) {
        filterButtons.style.display = "none";
    }
    const filterImg = document.getElementById('filter-img');
    if (filterImg !== null) {
        filterImg.style.color = "black";
    }
    const tableHeader = document.querySelectorAll(".th-content");
    const sortOrders = {};
    tableHeader.forEach((eachColumnHead) => {
        const column = eachColumnHead.getAttribute('data-column');
        const sortOrder = column ? sortOrders[column] : null;
        const icon = eachColumnHead.querySelector('.th-icons i');
        if (sortOrder === 'ascending') {
            if (icon) {
                icon.className = 'fas fa-caret-up';
            }
        }
        else if (sortOrder === 'descending') {
            if (icon) {
                icon.className = 'fas fa-caret-down';
            }
        }
        else {
            if (icon) {
                icon.className = 'fas fa-sort';
            }
        }
    });
    const employeeList = document.getElementById('employeeList');
    if (employeeList !== null) {
        employeeList.innerHTML = "";
        addEmployees(employees);
    }
    const filterButtonsColor = document.querySelectorAll(".letter-btn");
    filterButtonsColor.forEach(function (letterButton) {
        letterButton.style.backgroundColor = "";
        letterButton.style.color = "black";
    });
    const multiSelectedItems = document.querySelectorAll('.multiselect-dropdown .selected');
    multiSelectedItems.forEach(function (display) {
        var _a;
        display.textContent = ((_a = display.textContent) === null || _a === void 0 ? void 0 : _a.split(':')[0]) || '';
    });
    const multiselectCheckboxes = document.querySelectorAll('.multiselect-dropdown input[type="checkbox"]');
    multiselectCheckboxes.forEach(function (multiselectCheckbox) {
        multiselectCheckbox.checked = false;
    });
    tableCheckboxListeners();
    tableHeadCheckbox();
}
//Ends here
// deleting multiple rows using checkboxes in the each row.
function deleteSelectedRows() {
    if (confirm("Are you sure, you want to delete the data?")) {
        const tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        tBodyCheckboxes.forEach(function (checkbox) {
            var _a;
            if (checkbox.checked) {
                // Delete the row associated with the checked checkbox
                const selectedRow = checkbox.closest('tr');
                const emp = (_a = selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.cells[5]) === null || _a === void 0 ? void 0 : _a.textContent;
                selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.remove();
                // Remove corresponding data from local storage
                let employees = [];
                const employeesData = localStorage.getItem('employees');
                if (employeesData !== null) {
                    employees = JSON.parse(employeesData);
                }
                const index = employees.findIndex(function (employee) {
                    return employee.empno === emp;
                });
                employees.splice(index, 1);
                localStorage.setItem('employees', JSON.stringify(employees));
            }
        });
    }
}
// To display the delete button when checkboxes in the table were selected.
function tableCheckboxListeners() {
    const tableCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]');
    const deleteButton = document.getElementById('deleteButton');
    tableCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const checkedCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]:checked');
            if (checkedCheckboxes.length > 0) {
                if (deleteButton !== null) {
                    deleteButton.style.display = 'block';
                }
            }
            else {
                if (deleteButton !== null) {
                    deleteButton.style.display = 'none';
                }
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', tableCheckboxListeners);
function tableHeadCheckbox() {
    const tHeadCheckbox = document.getElementById('selectAllCheckbox');
    const tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    tHeadCheckbox.addEventListener('click', () => {
        tBodyCheckboxes.forEach((checkbox) => {
            checkbox.checked = tHeadCheckbox.checked;
        });
    });
}
document.addEventListener('DOMContentLoaded', tableHeadCheckbox);
document.addEventListener('DOMContentLoaded', () => {
    const theadColumns = document.querySelectorAll('.th-content');
    const sortOrders = {};
    theadColumns.forEach((header) => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (column) {
                sortTable(column);
            }
        });
    });
    function sortTable(column) {
        const sortOrder = sortOrders[column] || 'ascending';
        const table = document.getElementById('myTable');
        if (table) {
            const tbody = table.querySelector('tbody');
            if (tbody) {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((rowA, rowB) => {
                    var _a, _b;
                    const cellA = ((_a = rowA.querySelector(`td:nth-child(${getColumnIndex(column) + 1})`)) === null || _a === void 0 ? void 0 : _a.textContent) || '';
                    const cellB = ((_b = rowB.querySelector(`td:nth-child(${getColumnIndex(column) + 1})`)) === null || _b === void 0 ? void 0 : _b.textContent) || '';
                    return sortOrder === 'ascending' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });
                tbody.innerHTML = '';
                rows.forEach((row) => {
                    tbody.appendChild(row);
                });
                sortOrders[column] = sortOrder === 'ascending' ? 'descending' : 'ascending';
                updateSortIcon(column, sortOrder);
            }
        }
    }
    function getColumnIndex(columnName) {
        const theadColumns = document.querySelectorAll('.th-content');
        for (let i = 0; i < theadColumns.length; i++) {
            if (theadColumns[i].getAttribute('data-column') === columnName) {
                return i + 1;
            }
        }
        return -1;
    }
    function updateSortIcon(column, sortOrder) {
        const header = document.querySelector(`.th-content[data-column="${column}"] .th-icons i`);
        if (header) {
            header.style.display = "none";
            const iconHTML = sortOrder === 'ascending' ? '<i class="fas fa-caret-up"></i>' : '<i class="fas fa-caret-down"></i>';
            header.outerHTML = iconHTML;
            header.style.display = "block";
        }
    }
});
//Ends here
