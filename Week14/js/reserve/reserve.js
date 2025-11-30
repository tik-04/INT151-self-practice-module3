import { getStudyPlan, declarePlan, updateDeclaredPlan, cancelDeclaredPlan } from "../myLib/fetchUtils";
import { keycloak } from "../myLib/keyCloak";
import { createDeclareSection,setupDropdownUI } from "./components/declareSectionUi";
import setupLogoutButton from "./components/logoutButtonUi";
import { fetchStudyDecalred, showDeclared } from "./utils/loadDeclared";
import { showDialog } from "./components/dialog";
import timeFormat from "./utils/timeFormat";
import { loadCourseOfferings } from "./components/offering";

// กำหนด global variable || dom ที่ต้องรอ js สร้าง
let majorDropdown;
let declareBtn;
let changeBtn;
let cancelBtn;
let stdId = "";

async function loadStudentData() {
  const data = await fetchStudyDecalred(keycloak, stdId);
  await showDeclared(data)
  await loadCourseOfferings(data)
  return data
}

async function main() {
  try {

    const authenticated = await keycloak.init({ onLoad: "login-required" });

    if (!authenticated) {
      window.location.href = "/intproj25/cs1/itb-ecors/";
      return;
    }


    stdId = keycloak.tokenParsed.preferred_username;
    setupLogoutButton(keycloak);

    const apiUrl = `api/v1/study-plans`;
    const majors = await getStudyPlan(apiUrl);


    // สร้าง html ui ส่วนของการจอง
    createDeclareSection(majors);
  

    majorDropdown = document.getElementById("major");
    declareBtn = document.querySelector(".ecors-button-declare");
    changeBtn = document.querySelector(".ecors-button-change");
    cancelBtn = document.querySelector(".ecors-button-cancel");

    const data = await fetchStudyDecalred(keycloak,stdId);
    const updatedData = await loadStudentData()
    // ผูก Event
    await setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data); // Logic ปุ่ม Disabled/Enabled
    setupSubmitEvent(); // Logic การกด Declare
    setupChangeEvent(); // Logic การกด Change
    setupCancelEvent();

    // โหลดสถานะ
    await showDeclared(data)
    await loadCourseOfferings(updatedData);

  } catch (error) {
    console.error("App failed to start:", error);
  }
}

main();

function setupSubmitEvent() {
  if (!declareBtn) return;

  declareBtn.addEventListener("click", async () => {
    try {
      const selectedValue = majorDropdown.value;
      if (!selectedValue || selectedValue === "") {
        alert("Please select a plan first.");
        return;
      }

      const apiUrl = `api/v1/students/${stdId}/declared-plan`;
      const result = await declarePlan(apiUrl, selectedValue); 

      console.log("Declared Success:", result);

      const data = await loadStudentData()
      setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);

    } catch (error) {
      console.error(error);
      if (error.status === 409) {
        showDialog("You may have declared study plan already. Please check again.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);

      } else  {
        showDialog("There is a problem. Please try again later.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      }
    }
  });
}

function setupChangeEvent() {
  if (!changeBtn) return;

  changeBtn.addEventListener("click", async () => {
    try {
      const selectedValue = majorDropdown.value;
      if (!selectedValue || selectedValue === "") {
        alert("Please select a plan first.");
        return;
      }

      const apiUrl = `api/v1/students/${stdId}/declared-plan`;
      const result = await updateDeclaredPlan(apiUrl, selectedValue);

      console.log("Changed Success:", result);

      showDialog("Declaration updated.")
      const data = await loadStudentData()
      setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      
    
    } catch (error) {
      console.error(error);
      
      if(error.status === 409){
        showDialog("Cannot update the declared plan because it has been cancelled.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      } else if(error.status === 404) {
        await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn);
        showDialog(`No declared plan found for student with id=${stdId}.`); 
      } else {
        showDialog("There is a problem. Please try again later.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      }
    }
  });
}

function setupCancelEvent() {
  if (!cancelBtn) return;

  cancelBtn.addEventListener("click", async () => {
    try {
      const apiUrl = `api/v1/students/${stdId}/declared-plan`;

      const data = await loadStudentData()
      if (data) {
        const dataDate = data.updatedAt
        const declareStatusText = await timeFormat(dataDate,data,true)
        const cancelDialogText = `You have declared ${declareStatusText}. Are you sure you want to cancel this declaration?`
      
        const cancelConfirm = await showDialog(cancelDialogText, "cancel");

        if (cancelConfirm) {
          const result = await cancelDeclaredPlan(apiUrl);
          console.log("cancelled succes:",result)
          showDialog("Declaration cancelled.")
          const data = await loadStudentData()
          setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);

          
        }
      } else {
        const cancelConfirm = await showDialog("No study declared found", "cancel");
        
        if (cancelConfirm) {
          const result = await cancelDeclaredPlan(apiUrl);
          console.log("cancelled fail:",result)
        }
      }

    } catch (error) {
      console.error(error);
      if (error.status === 404) {
        showDialog(`No declared plan found for student with id=${stdId}.`)
        await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, null);
      }
      else if(error.status === 409){
        showDialog("Cannot cancel the declared plan because it is already cancelled.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      } else{
        showDialog("There is a problem. Please try again later.");
        const data = await loadStudentData()
        setupDropdownUI(majorDropdown, declareBtn, changeBtn, cancelBtn, data);
      }

    }
  });
}

window.addEventListener("pageshow", function (event) {
  if (event.persisted) window.location.reload();
});
