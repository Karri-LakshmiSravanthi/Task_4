"use strict";
function searchFunction() {
    let currentDropdown = null; // Variable to keep track of the currently open dropdown
    const searchContainers = document.querySelectorAll('.searchDropdown');
    searchContainers.forEach((container) => {
        const searchField = container.querySelector('.managerName, .projectName');
        const searchFieldDropdownContent = container.querySelector('.dropdown-content');
        const optionCheckboxes = container.querySelectorAll('.option-checkbox');
        if (searchField && searchFieldDropdownContent) {
            searchField.addEventListener('click', (event) => {
                if (currentDropdown === searchFieldDropdownContent) {
                    searchFieldDropdownContent.style.display = 'none';
                    currentDropdown = null;
                }
                else {
                    if (currentDropdown) {
                        currentDropdown.style.display = 'none';
                    }
                    searchFieldDropdownContent.style.display = 'block';
                    currentDropdown = searchFieldDropdownContent; // Update the currently open dropdown
                }
                event.stopPropagation();
            });
            searchField.addEventListener("input", function () {
                const input = this.value.trim().toUpperCase();
                const options = searchFieldDropdownContent.querySelectorAll(".option");
                options.forEach((option) => {
                    const name = option.querySelector(".name").textContent.trim().toUpperCase();
                    option.style.display = name.indexOf(input) > -1 ? "" : "none";
                });
            });
            optionCheckboxes.forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    const selectedNames = [];
                    optionCheckboxes.forEach((checkbox) => {
                        if (checkbox.checked) {
                            const name = checkbox.closest('.option').querySelector('.name').textContent;
                            selectedNames.push(name);
                        }
                    });
                    searchField.value = selectedNames.join(', ');
                });
            });
            searchFieldDropdownContent.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent clicks within the dropdown from bubbling to body
            });
        }
    });
    document.body.addEventListener('click', () => {
        // Close the currently open dropdown if the click is outside of any input field
        if (currentDropdown) {
            currentDropdown.style.display = 'none';
            currentDropdown = null; // Reset the currently open dropdown
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    searchFunction();
});
