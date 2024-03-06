function searchFunction(): void {
    let currentDropdown: HTMLElement | null = null; // Variable to keep track of the currently open dropdown
    const searchContainers = document.querySelectorAll<HTMLElement>('.searchDropdown');

    searchContainers.forEach((container) => {
        const searchField = container.querySelector<HTMLInputElement>('.managerName, .projectName');
        const searchFieldDropdownContent = container.querySelector<HTMLElement>('.dropdown-content');
        const optionCheckboxes = container.querySelectorAll<HTMLInputElement>('.option-checkbox');

        if (searchField && searchFieldDropdownContent) {
            searchField.addEventListener('click', (event) => {
                if (currentDropdown === searchFieldDropdownContent) {
                    searchFieldDropdownContent.style.display = 'none';
                    currentDropdown = null;
                } else {
                    if (currentDropdown) {
                        currentDropdown.style.display = 'none';
                    }
                    searchFieldDropdownContent.style.display = 'block';
                    currentDropdown = searchFieldDropdownContent; // Update the currently open dropdown
                }
                event.stopPropagation();
            });

            searchField.addEventListener("input", function (this: HTMLInputElement) {
                const input = this.value.trim().toUpperCase();
                const options = searchFieldDropdownContent.querySelectorAll<HTMLElement>(".option");

                options.forEach((option) => {
                    const name = option.querySelector<HTMLElement>(".name")!.textContent!.trim().toUpperCase();
                    option.style.display = name.indexOf(input) > -1 ? "" : "none";
                });
            });

            optionCheckboxes.forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    const selectedNames: string[] = [];
                    optionCheckboxes.forEach((checkbox) => {
                        if (checkbox.checked) {
                            const name = checkbox.closest('.option')!.querySelector('.name')!.textContent!;
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
