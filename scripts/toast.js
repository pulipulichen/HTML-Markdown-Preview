function showToast(messageBox, msg) {
    messageBox.textContent = msg;
    messageBox.style.opacity = "1";
    setTimeout(() => {
        messageBox.style.opacity = "0";
    }, 2000);
}
