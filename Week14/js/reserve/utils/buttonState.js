function declareBtnOn(declareBtn) { 
    declareBtn.disabled = false;
    declareBtn.style.cursor = "pointer";
}
function declareBtnOff(declareBtn) {
    declareBtn.disabled = true;
    declareBtn.style.cursor = "not-allowed";
}
function changeBtnOn(changeBtn) {
    changeBtn.disabled = false;
    changeBtn.style.cursor = "pointer";
}
function changeBtnOff(changeBtn) {
    changeBtn.disabled = true;
    changeBtn.style.cursor = "not-allowed";
}
function cancelBtnOn(cancelBtn) {
    cancelBtn.disabled = false;
    cancelBtn.style.cursor = "pointer";
}
function cancelBtnOff(cancelBtn) {
    cancelBtn.disabled = true;
    cancelBtn.style.cursor = "not-allowed";
}

export { declareBtnOff,declareBtnOn,changeBtnOff,changeBtnOn,cancelBtnOn,cancelBtnOff }