// Dialog Events
async function showDialog(message, status) {
  return new Promise((resolve) => {
    const dialog = document.querySelector(".ecors-dialog");
    const okButton = document.querySelector(".ecors-button-dialog");
    const dialogMsg = document.querySelector(".ecors-dialog-message");
    const cancelBtnDialog = document.querySelector(".ecors-dialog .ecors-button-cancel");
    const keepDeclaredBtn = document.querySelector(".ecors-button-keep");

    if (!dialog) {
        resolve(false);
        return;
    }

    if (status === "cancel") {
      okButton.style.display = "none";
      cancelBtnDialog.style.display = "inline-block";
      cancelBtnDialog.disabled = false;
      cancelBtnDialog.style.cursor = "pointer";
      keepDeclaredBtn.style.display = "inline-block";

      cancelBtnDialog.addEventListener("click", () => {
        dialog.close();
        resolve(true)
      });

      keepDeclaredBtn.addEventListener("click", () => {
        dialog.close();
        resolve(false)
      });

      if (dialog) {
        dialogMsg.textContent = message;
        dialog.showModal();
      }
    } else {
      cancelBtnDialog.style.display = "none";
      keepDeclaredBtn.style.display = "none";
      okButton.style.display = "inline-block";
      if (okButton) {
        okButton.addEventListener("click", async () => {
          dialog.close();
          resolve(true);
        });
      }
      
      if (dialog) {
        dialogMsg.textContent = message;
        dialog.showModal();
      }
    }
  });
}

export { showDialog };
