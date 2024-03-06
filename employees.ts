// Exporting table details to a excel sheet
function exportToExcel(): void {
    const table: HTMLTableElement | null = document.getElementById('myTable') as HTMLTableElement | null;

    if (table) {
        // Clone the table to exclude images
        const tableClone: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
        const images: NodeListOf<HTMLImageElement> = tableClone.querySelectorAll('img');
        images.forEach((img: HTMLImageElement) => {
            img.parentNode?.removeChild(img);
        });

        const html: string = tableClone.outerHTML;
        const url: string = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);
        const link: HTMLAnchorElement = document.createElement('a');
        link.download = 'EmployeeData.xls';
        link.href = url;
        link.click();
    }
}
//Ends here


//employee details adding into table
interface Employee {
    empno: string;
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    department: string;
    role: string;
    joinDate: string;
    dateOfBirth?: string;
    phone: string;
    image: string;
    manager: string;
    project: string;
    status: string;
}

function addEmployees(employees: Employee[]) {
    var tableBody = document.getElementById('employeeList') as HTMLTableSectionElement;
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
        var statusButton = document.createElement('button')
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
            var selectedAction = (event.target as HTMLSelectElement).value;
            if (selectedAction === 'delete') {
                if (confirm("Are you sure, you want to delete this row?")) {
                    var selectedRow = actionSelection.closest('tr') as HTMLTableRowElement;
                    var emp = selectedRow.cells[5].textContent!;
                    console.log(emp);
                    selectedRow.remove();
                    // Remove corresponding data from local storage
                    var employees = JSON.parse(localStorage.getItem('employees')!) || [];
                    var index = employees.findIndex(function (employee: Employee) {
                        return employee.empno === emp;
                    });
                    employees.splice(index, 1);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
            }

            if (selectedAction === 'edit') {
                var selectedRow = actionSelection.closest('tr') as HTMLTableRowElement;
                var emp = selectedRow.cells[5].textContent!;
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
    var employees = JSON.parse(localStorage.getItem('employees')!) || [];
    addEmployees(employees);
});
//Ends here




//Multi select dropdown starts here
document.body.addEventListener('click', function (event: Event) {
    const multiselectDropdowns: NodeListOf<Element> = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdowns.forEach(function (dropdown: Element) {
        if ((dropdown as HTMLElement).style.display === 'block' && !(event.target as Element).closest('.multiselect-dropdown')) {
            (dropdown as HTMLElement).style.display = 'none';
        }
    });
});

function toggleDropdown(selectBox: HTMLElement) {
    const dropdownContent: HTMLElement = selectBox.nextElementSibling as HTMLElement;
    const isHidden: boolean = dropdownContent.style.display === 'none' || !dropdownContent.style.display;

    // Hide all other dropdown contents
    const multiselectDropdownsContent: NodeListOf<HTMLElement> = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdownsContent.forEach(function (dropdownValue: HTMLElement) {
        if (dropdownValue !== dropdownContent) {
            dropdownValue.style.display = 'none';
        }
    });

    // Toggle the display of the current dropdown content
    dropdownContent.style.display = isHidden ? 'block' : 'none';
}


function updateSelectedItems(multiselectCheckbox: HTMLInputElement) {
    const filterName: string | null | undefined = multiselectCheckbox.closest('.multiselect-dropdown')?.getAttribute('data-filter');
    const multiSelectedItems: HTMLElement | null | undefined = multiselectCheckbox.closest('.multiselect-dropdown')?.querySelector('.selected');
    if (filterName && multiSelectedItems) {
        const selectedOptions: string[] = Array.from(multiselectCheckbox.closest('.multiselect-dropdown')?.querySelectorAll('input[type="checkbox"]:checked') || [])
            .map(function (checkbox: Element) {
                return (checkbox as HTMLInputElement).value; // Explicitly cast to HTMLInputElement
            });
        multiSelectedItems.textContent = filterName + ': ' + (selectedOptions.length > 0 ? selectedOptions.length : '0') + ' selected';
        filterarray[filterName] = selectedOptions;

        const filterButtons: HTMLElement | null = document.getElementById('right-filter');
        if (filterButtons) {
            filterButtons.classList.add('rightFilterbtns');
        }
    }
}


//Ends here




// Buttons filtering starts here
let employees: Employee[] = [];

const employeesData = localStorage.getItem('employees');
if (employeesData !== null) {
    employees = JSON.parse(employeesData);
}

let filterarray: { [key: string]: string[] } = {
    Status: [],
    Department: [],
    Location: []
};

// Filtering based on buttons
const letterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".letter-btn");
let previousButton: HTMLButtonElement | null = null;
let filterButtonText: string = "";
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

let startsWithLetter: boolean;
let statusMatch: boolean;
let locationMatch: boolean;
let departmentMatch: boolean;

function displayresult() {
    let results: Employee[] = employees.filter(ele => {
        let name: string = ele.firstName.toUpperCase();
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
function displayTable(): void {
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

    const tableHeader = document.querySelectorAll<HTMLDivElement>(".th-content");
    const sortOrders: { [key: string]: string } = {};

    tableHeader.forEach((eachColumnHead) => {
        const column = eachColumnHead.getAttribute('data-column');
        const sortOrder = column ? sortOrders[column] : null;
        const icon = eachColumnHead.querySelector<HTMLDivElement>('.th-icons i');

        if (sortOrder === 'ascending') {
            if (icon) {
                icon.className = 'fas fa-caret-up';
            }
        } else if (sortOrder === 'descending') {
            if (icon) {
                icon.className = 'fas fa-caret-down';
            }
        } else {
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

    const filterButtonsColor = document.querySelectorAll(".letter-btn") as NodeListOf<HTMLElement>;
    filterButtonsColor.forEach(function (letterButton: HTMLElement) {
        letterButton.style.backgroundColor = "";
        letterButton.style.color = "black";
    });

    const multiSelectedItems = document.querySelectorAll('.multiselect-dropdown .selected') as NodeListOf<HTMLElement>;
    multiSelectedItems.forEach(function (display: HTMLElement) {
        display.textContent = display.textContent?.split(':')[0] || '';
    });

    const multiselectCheckboxes = document.querySelectorAll('.multiselect-dropdown input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    multiselectCheckboxes.forEach(function (multiselectCheckbox: HTMLInputElement) {
        multiselectCheckbox.checked = false;
    });
    tableCheckboxListeners();
    tableHeadCheckbox();
}

//Ends here




// deleting multiple rows using checkboxes in the each row.
function deleteSelectedRows(): void {
    if (confirm("Are you sure, you want to delete the data?")) {
        const tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
        tBodyCheckboxes.forEach(function (checkbox: HTMLInputElement) {
            if (checkbox.checked) {
                // Delete the row associated with the checked checkbox
                const selectedRow = checkbox.closest('tr');
                const emp = selectedRow?.cells[5]?.textContent;
                selectedRow?.remove();
                // Remove corresponding data from local storage
                let employees: Employee[] = [];

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
function tableCheckboxListeners(): void {
    const tableCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    const deleteButton = document.getElementById('deleteButton');

    tableCheckboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.addEventListener('change', () => {
            const checkedCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
            if (checkedCheckboxes.length > 0) {
                if (deleteButton !== null) {
                    deleteButton.style.display = 'block';
                }
            } else {
                if (deleteButton !== null) {
                    deleteButton.style.display = 'none';
                }
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', tableCheckboxListeners);


function tableHeadCheckbox(): void {
    const tHeadCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
    const tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    tHeadCheckbox.addEventListener('click', () => {
        tBodyCheckboxes.forEach((checkbox: HTMLInputElement) => {
            checkbox.checked = tHeadCheckbox.checked;
        });
    });
}

document.addEventListener('DOMContentLoaded', tableHeadCheckbox);
//Ends here




// Ascending and descending order filtering.
interface SortOrders {
    [key: string]: 'ascending' | 'descending';
}

document.addEventListener('DOMContentLoaded', () => {
    const theadColumns = document.querySelectorAll('.th-content');
    const sortOrders: SortOrders = {};

    theadColumns.forEach((header) => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (column) {
                sortTable(column);
            }
        });
    });

    function sortTable(column: string) {
        const sortOrder: 'ascending' | 'descending' = sortOrders[column] || 'ascending';
        const table = document.getElementById('myTable');
        if (table) {
            const tbody = table.querySelector('tbody');
            if (tbody) {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((rowA, rowB) => {
                    const cellA = rowA.querySelector(`td:nth-child(${getColumnIndex(column) + 1})`)?.textContent || '';
                    const cellB = rowB.querySelector(`td:nth-child(${getColumnIndex(column) + 1})`)?.textContent || '';
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

    function getColumnIndex(columnName: string): number {
        const theadColumns = document.querySelectorAll('.th-content');
        for (let i = 0; i < theadColumns.length; i++) {
            if (theadColumns[i].getAttribute('data-column') === columnName) {
                return i+1;
            }
        }
        return -1;
    }

    function updateSortIcon(column: string, sortOrder: 'ascending' | 'descending') {
        const header = document.querySelector<HTMLElement>(`.th-content[data-column="${column}"] .th-icons i`);
        if (header) {
            header.style.display = "none";
            const iconHTML = sortOrder === 'ascending' ? '<i class="fas fa-caret-up"></i>' : '<i class="fas fa-caret-down"></i>';
            header.outerHTML = iconHTML;
            header.style.display = "block";
        }
    }
});

//Ends here
