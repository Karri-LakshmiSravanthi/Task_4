"use strict";
//dynamic profile starts here
document.getElementById('uploadButton').addEventListener('click', () => {
    document.getElementById('uploadInput').click();
});
document.getElementById('uploadInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgData = event.target.result;
            const imgElement = document.getElementById('profileImage');
            if (imgElement) {
                imgElement.src = imgData;
            }
        };
        reader.readAsDataURL(file);
    }
});
//ends here
// Form validation starts here
const requiredFields = ['empno', 'fname', 'lname', 'email', 'joindt'];
requiredFields.forEach((fieldId) => {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        fieldElement.addEventListener('input', () => {
            clearErrorMessage(fieldId);
        });
    }
});
function clearErrorMessage(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.innerText = '';
    }
}
function validateForm() {
    const empno = document.getElementById('empno').value;
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const joinDate = document.getElementById('joindt').value;
    const phone = document.getElementById('phone').value;
    let hasError = false; // Variable to track if any error occurred
    const empnoPattern = /^[a-zA-Z0-9]+$/;
    const namePattern = /^[a-zA-Z ]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/;
    const phonePattern = /^\d{10}$/;
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach((element) => {
        if (element instanceof HTMLElement) {
            element.innerText = '';
        }
    });
    // Validate each field
    if (empno === '') {
        const empnoError = document.getElementById('empno-error');
        if (empnoError) {
            empnoError.innerText = 'Please enter Employee Number';
        }
        hasError = true;
    }
    else {
        if (!empnoPattern.test(empno)) {
            const empnoError = document.getElementById('empno-error');
            if (empnoError) {
                empnoError.innerText = 'Employee Number must contain only letters and numbers';
            }
            hasError = true;
        }
    }
    if (firstName === '') {
        const fnameError = document.getElementById('fname-error');
        if (fnameError) {
            fnameError.innerText = 'Please enter First Name';
        }
        hasError = true;
    }
    else {
        if (!namePattern.test(firstName)) {
            const fnameError = document.getElementById('fname-error');
            if (fnameError) {
                fnameError.innerText = 'First Name must contain only letters and spaces';
            }
            hasError = true;
        }
    }
    if (lastName === '') {
        const lnameError = document.getElementById('lname-error');
        if (lnameError) {
            lnameError.innerText = 'Please enter Last Name';
        }
        hasError = true;
    }
    else {
        if (!namePattern.test(lastName)) {
            const lnameError = document.getElementById('lname-error');
            if (lnameError) {
                lnameError.innerText = 'Last Name must contain only letters and spaces';
            }
            hasError = true;
        }
    }
    if (email === '') {
        const emailError = document.getElementById('email-error');
        if (emailError) {
            emailError.innerText = 'Please enter Email';
        }
        hasError = true;
    }
    else {
        if (!emailPattern.test(email)) {
            const emailError = document.getElementById('email-error');
            if (emailError) {
                emailError.innerText = 'Email must contain only letters, numbers, @, .com';
            }
            hasError = true;
        }
    }
    if (joinDate === '') {
        const joindtError = document.getElementById('joindt-error');
        if (joindtError) {
            joindtError.innerText = 'Please enter Joining Date';
        }
        hasError = true;
    }
    if (phone && !phonePattern.test(phone)) {
        const phoneError = document.getElementById('phone-error');
        if (phoneError) {
            phoneError.innerText = 'Phone Number must contain only digits of length 10';
        }
        hasError = true;
    }
    // If any error occurred, return without adding the employee
    if (hasError) {
        window.scrollTo(0, 0);
        return;
    }
    addEmployee();
}
// Ends here
// Getting data from form and adding it into localStorage
function addEmployee() {
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const location = document.getElementById('location').value;
    const department = document.getElementById('department').value;
    const role = document.getElementById('role').value;
    const empno = document.getElementById('empno').value;
    const status = "Active";
    const joinDate = document.getElementById('joindt').value;
    const dateOfBirth = document.getElementById("dob").value;
    const phone = document.getElementById("phone").value;
    const image = document.getElementById("profileImage").src;
    const manager = document.querySelector(".managerName").value;
    const project = document.querySelector(".projectName").value;
    // Get existing employee data from local storage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const editEmployeeData = JSON.parse(localStorage.getItem('editEmployeeData') || '{}');
    console.log(editEmployeeData);
    if (Object.keys(editEmployeeData).length !== 0) {
        const emp = editEmployeeData.index;
        const index = employees.findIndex((employee) => {
            return employee.empno === emp;
        });
        employees.splice(index, 1);
        employees.push({ firstName, lastName, email, location, department, role, empno, status, joinDate, dateOfBirth, phone, image, manager, project });
        localStorage.setItem('employees', JSON.stringify(employees));
        refresh();
    }
    else {
        employees.push({ firstName, lastName, email, location, department, role, empno, status, joinDate, dateOfBirth, phone, image, manager, project });
        localStorage.setItem('employees', JSON.stringify(employees));
    }
    const confirmation = document.getElementById('alertBox');
    if (confirmation) {
        confirmation.style.display = 'block';
    }
    setTimeout(() => {
        window.location.href = 'employees.html';
    }, 1000);
}
// Ends here
//Edit employeee details starts here
document.addEventListener('DOMContentLoaded', function () {
    const editEmployeeDataString = localStorage.getItem('editEmployeeData');
    const editEmployeeData = editEmployeeDataString !== null ? JSON.parse(editEmployeeDataString) : null;
    if (editEmployeeData) {
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.innerHTML = "Update Employee";
        }
        document.getElementById('empno').value = editEmployeeData.empno;
        document.getElementById('fname').value = editEmployeeData.firstName;
        document.getElementById('lname').value = editEmployeeData.lastName;
        document.getElementById('email').value = editEmployeeData.email;
        document.getElementById('joindt').value = editEmployeeData.joinDate;
        document.getElementById('department').value = editEmployeeData.department;
        document.getElementById('location').value = editEmployeeData.location;
        document.getElementById('role').value = editEmployeeData.role;
        document.getElementById('dob').value = editEmployeeData.dateOfBirth;
        document.getElementById('phone').value = editEmployeeData.phone;
        document.getElementById('profileImage').src = editEmployeeData.profile;
        document.querySelector(".managerName").value = editEmployeeData.managerName;
        document.querySelector(".projectName").value = editEmployeeData.projectName;
    }
});
//Ends here
// Clears edit details from page when navigated to another page
function refresh() {
    localStorage.removeItem('editEmployeeData');
}
// Ends here
window.addEventListener("unload", function (event) {
    refresh();
});
