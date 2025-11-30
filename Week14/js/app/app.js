import createStudyPlanRow from "./components/studyPlanUi";
import { getStudyPlan } from "../myLib/fetchUtils";

document.addEventListener("DOMContentLoaded", () => {
  loadStudyPlans();
});

const reservePageDom = document.getElementById("manage-plan-direct")

async function loadStudyPlans() {
  try {
    const apiUrl = `api/v1/study-plans`
    const data = await getStudyPlan(apiUrl)

    renderTable(data);

    // <button class="ecors-button-manage">Manage study plan declaration and course reservation</button>
    const reservePageButton = document.createElement("button")
    reservePageButton.className = "ecors-button-manage"
    reservePageButton.textContent = "Manage study plan declaration and course reservation"

    reservePageDom.appendChild(reservePageButton)

  } catch (error) {
    console.error("Error fetching plans:", error.message);
    showDialog();
  }
}

function renderTable(data) {
  const tbody = document.querySelector(".ecors-body");
  tbody.innerHTML = "";

  let studyPlans = [];

  if (Array.isArray(data)) {
    studyPlans = data;
  }
  
  else if (data && Array.isArray(data.data)) {
    studyPlans = data.data; 
  }

  studyPlans.forEach(plan => {
    const row = createStudyPlanRow(plan);
    tbody.appendChild(row);
  });
}


function showDialog() {
  const dialog = document.querySelector(".ecors-dialog");
  dialog.showModal();
}