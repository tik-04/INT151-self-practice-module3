import { changeBtnOn,changeBtnOff,declareBtnOff,declareBtnOn, cancelBtnOn, cancelBtnOff } from "../utils/buttonState";

function createDeclareSection(majors) {
  const mainContainer = document.querySelector(".declare-main");
  const dialog = document.querySelector(".ecors-dialog")
  if (!mainContainer) return;

  mainContainer.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = "Declare Your Major";
  mainContainer.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = "Select Major: ";
  mainContainer.appendChild(p);

  const selectWrap = document.createElement("div");
  selectWrap.className = "major-select-wrap";

  const select = document.createElement("select");
  select.name = "major";
  select.id = "major";
  select.className = "ecors-dropdown-plan";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select Major --";
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  if (majors && Array.isArray(majors)) {
    majors.forEach((major) => {
      const option = document.createElement("option");
      option.className = "ecors-plan-row";
      option.value = major.id;

      // <span class="ecors-plan-code">FE</span>
      const spanCode = document.createElement("span");
      spanCode.className = "ecors-plan-code";
      spanCode.textContent = major.planCode;

      const separator = document.createTextNode(" - ");

      // <span class="ecors-plan-name">Frontend</span>
      const spanName = document.createElement("span");
      spanName.className = "ecors-plan-name";
      spanName.textContent = major.nameEng;

      option.appendChild(spanCode);
      option.appendChild(separator);
      option.appendChild(spanName);

      select.appendChild(option);
    });
  }

  selectWrap.appendChild(select);

  mainContainer.appendChild(selectWrap);

  //<button class="ecors-button-declare" disabled>Declare</button>
  const button = document.createElement("button");
  button.className = "ecors-button-declare";
  button.textContent = "Declare";
  button.disabled = true; // ใส่ attribute disabled
  mainContainer.appendChild(button);


  //<button class="ecors-button-change" disabled>Change</button>
  const changeBtn = document.createElement("button");
  changeBtn.className = "ecors-button-change";
  changeBtn.textContent = "Change";
  changeBtn.disabled = true;
  changeBtn.style.display = "none"; // ซ่อน
  mainContainer.appendChild(changeBtn);


  // <button class="ecors-button-cancel" disabled>Cancel Declaration</button>
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "ecors-button-cancel";
  cancelBtn.textContent = "Cancel Declaration";
  // cancelBtn.disabled = true;
  cancelBtn.style.display = "none";
  mainContainer.appendChild(cancelBtn);

  //in cancel dialog
  const keepDeclaredBtn = document.createElement("button");
  keepDeclaredBtn.className = "ecors-button-keep";
  keepDeclaredBtn.textContent = "Keep Declaration";

  const cancelBtnDialog = cancelBtn.cloneNode(true);

  dialog.appendChild(cancelBtnDialog)
  dialog.appendChild(keepDeclaredBtn)
    
}

async function setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn,data) {
  if (!majorDropdown || !declareBtn || !changeBtn || !cancelBtn) return;

  declareBtnOff(declareBtn);
  changeBtnOff(changeBtn);

  const updateButtonState = async (status) => {
    if (!data) {
      if (status && status == "load") majorDropdown.value = "";
      const selectedValue = majorDropdown.value;
      if (selectedValue && selectedValue !== "") {
        declareBtnOn(declareBtn)
      } else {
        declareBtnOff(declareBtn)
      }
    }
    if (data && data.status == "DECLARED") {
      if (status && status == "load") majorDropdown.value = data.planId;
      const selectedValue = majorDropdown.value;
      if (selectedValue && selectedValue != data.planId && selectedValue !== "") {
        declareBtnOff(declareBtn)
        changeBtnOn(changeBtn)
        cancelBtnOn(cancelBtn)
      } else {
        declareBtnOff(declareBtn)
        changeBtnOff(changeBtn)
        cancelBtnOn(cancelBtn)
      }
    } 
    if (data && data.status == "CANCELLED") {
      cancelBtnOff(cancelBtn)
      if (status && status == "load") majorDropdown.value = majorDropdown.value = "";
      const selectedValue = majorDropdown.value;
      if (selectedValue && selectedValue !== "") {
        declareBtnOn(declareBtn)
      } else {
        declareBtnOff(declareBtn)
      }
    }
  };

  await updateButtonState("load");

  majorDropdown.addEventListener("change", async () => {
    console.log("Dropdown changed:", majorDropdown.value);
    await updateButtonState();
  });
}

export { createDeclareSection, setupDropdownUI };
