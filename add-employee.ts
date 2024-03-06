//dynamic profile starts here
document.getElementById('uploadButton')!.addEventListener('click', () => {
    (document.getElementById('uploadInput') as HTMLInputElement).click();
});

document.getElementById('uploadInput')!.addEventListener('change', function(this: HTMLInputElement) {
    const file = this.files![0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (this: FileReader, event: ProgressEvent<FileReader>) {
            const imgData = event.target!.result as string;
            const imgElement = document.getElementById('profileImage') as HTMLImageElement;
            if (imgElement) {
                imgElement.src = imgData;
            }
        }
        reader.readAsDataURL(file);
    }
});

//ends here



// Form validation starts here
const requiredFields: string[] = ['empno', 'fname', 'lname', 'email', 'joindt'];

requiredFields.forEach((fieldId: string) => {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        fieldElement.addEventListener('input', () => {
            clearErrorMessage(fieldId);
        });
    }
});

function clearErrorMessage(fieldId: string):void {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.innerText = '';
    }
}

function validateForm() {
    const empno: string = (document.getElementById('empno') as HTMLInputElement).value;
    const firstName: string = (document.getElementById('fname') as HTMLInputElement).value;
    const lastName: string = (document.getElementById('lname') as HTMLInputElement).value;
    const email: string = (document.getElementById('email') as HTMLInputElement).value;
    const joinDate: string = (document.getElementById('joindt') as HTMLInputElement).value;
    const phone: string = (document.getElementById('phone') as HTMLInputElement).value;
    let hasError: boolean = false; // Variable to track if any error occurred
    const empnoPattern: RegExp = /^[a-zA-Z0-9]+$/;
    const namePattern: RegExp = /^[a-zA-Z ]+$/;
    const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/;
    const phonePattern: RegExp = /^\d{10}$/;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach((element: Element) => {
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
    } else {
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
    } else {
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
    } else {
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
    } else {
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
    const firstName: string = (document.getElementById('fname') as HTMLInputElement).value;
    const lastName: string = (document.getElementById('lname') as HTMLInputElement).value;
    const email: string = (document.getElementById('email') as HTMLInputElement).value;
    const location: string = (document.getElementById('location') as HTMLInputElement).value;
    const department: string = (document.getElementById('department') as HTMLInputElement).value;
    const role: string = (document.getElementById('role') as HTMLInputElement).value;
    const empno: string = (document.getElementById('empno') as HTMLInputElement).value;
    const status: string = "Active";
    const joinDate: string = (document.getElementById('joindt') as HTMLInputElement).value;
    const dateOfBirth: string = (document.getElementById("dob") as HTMLInputElement).value;
    const phone: string = (document.getElementById("phone") as HTMLInputElement).value;
    const image: string = (document.getElementById("profileImage") as HTMLImageElement).src;
    const manager: string = (document.querySelector(".managerName") as HTMLInputElement).value;
    const project: string = (document.querySelector(".projectName") as HTMLInputElement).value;

    // Get existing employee data from local storage
    const employees: any[] = JSON.parse(localStorage.getItem('employees') || '[]');
    const editEmployeeData: any = JSON.parse(localStorage.getItem('editEmployeeData') || '{}');
    console.log(editEmployeeData);

    if (Object.keys(editEmployeeData).length !==0) {
        const emp: string = editEmployeeData.index;
        const index: number = employees.findIndex((employee) => {
            return employee.empno === emp;
        });
        employees.splice(index, 1);
        employees.push({ firstName, lastName, email, location, department, role, empno, status, joinDate, dateOfBirth, phone, image, manager, project });
        localStorage.setItem('employees', JSON.stringify(employees));
        refresh();
    } else {
        employees.push({ firstName, lastName, email, location, department, role, empno, status, joinDate, dateOfBirth, phone, image, manager, project });
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    const confirmation: HTMLElement | null = document.getElementById('alertBox');
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
        (document.getElementById('empno') as HTMLInputElement).value = editEmployeeData.empno;
        (document.getElementById('fname') as HTMLInputElement).value = editEmployeeData.firstName;
        (document.getElementById('lname') as HTMLInputElement).value = editEmployeeData.lastName;
        (document.getElementById('email') as HTMLInputElement).value = editEmployeeData.email;
        (document.getElementById('joindt') as HTMLInputElement).value = editEmployeeData.joinDate;
        (document.getElementById('department') as HTMLInputElement).value = editEmployeeData.department;
        (document.getElementById('location') as HTMLInputElement).value = editEmployeeData.location;
        (document.getElementById('role') as HTMLInputElement).value = editEmployeeData.role;
        (document.getElementById('dob') as HTMLInputElement).value = editEmployeeData.dateOfBirth;
        (document.getElementById('phone') as HTMLInputElement).value = editEmployeeData.phone;
        (document.getElementById('profileImage') as HTMLImageElement).src = editEmployeeData.profile;
        (document.querySelector(".managerName") as HTMLInputElement).value = editEmployeeData.managerName;
        (document.querySelector(".projectName") as HTMLInputElement).value = editEmployeeData.projectName;
    }
});

//Ends here



// Clears edit details from page when navigated to another page
function refresh(): void {
    localStorage.removeItem('editEmployeeData');
}
// Ends here

window.addEventListener("unload", function (event) {
    refresh();
});
