let sb_var: boolean = true;

function openSidebar(): void {
    (document.getElementById("leftPanel") as HTMLElement).style.width = "17%";
    (document.getElementById("rightPanel") as HTMLElement).style.width = "82%";
    const sb = document.querySelector(".left-panel") as HTMLElement;
    sb.style.display = "block";
    const icons = document.querySelector("#leftPanelIcons") as HTMLElement;
    icons.style.display = "none";
    rotateImage();
}

let rotateImage = (): void => {
    let handle_icon = document.querySelector('.handle-icon') as HTMLElement;
    if (sb_var)
        handle_icon.style.transform = 'rotate(180deg)';
    else
        handle_icon.style.transform = 'rotate(0deg)';
}

function closeSidebar(): void {
    const sb = document.querySelector(".left-panel") as HTMLElement;
    (document.getElementById("leftPanel") as HTMLElement).style.width = "0%";
    sb.style.display = "none";
    const icons = document.querySelector("#leftPanelIcons") as HTMLElement;
    (document.getElementById("leftPanelIcons") as HTMLElement).style.width = "4%";
    icons.style.display = "block";
    (document.getElementById("rightPanel") as HTMLElement).style.width = "96%";
    rotateImage();
}

function SideBar(): void {
    if (sb_var == false) {
        openSidebar()
    } else {
        closeSidebar()
    }
    sb_var = !sb_var
}

function dismiss(): void {
    var dismissBtn = document.getElementById('update') as HTMLElement;
    dismissBtn.style.display = "none";
}
