document.addEventListener("DOMContentLoaded", () => {
  loadStudyPlans();
});

async function loadStudyPlans() {
  try {
    const response = await fetch("api/v1/study-plans");
    // const response = await fetch("http://localhost:5000/api/v1/study-plans");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    renderTable(data);

  } catch (error) {
    console.error("Error fetching plans:", error);
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
    studyPlans = data.data; // "แกะกล่อง" เอา Array ข้างในออกมา
  }

  studyPlans.forEach(plan => {
    const row = createStudyPlanRow(plan);
    tbody.appendChild(row);
  });
}

function createStudyPlanRow(plan) {
    const tr = document.createElement("tr");
    tr.className = "ecors-row";

    const tdId = document.createElement("td");
    tdId.className = "ecors-id";
    tdId.textContent = plan.id;

    const tdCode = document.createElement("td");
    tdCode.className = "ecors-planCode";
    tdCode.textContent = plan.planCode;

    const tdNameEng = document.createElement("td");
    tdNameEng.className = "ecors-nameEng";
    tdNameEng.textContent = plan.nameEng;

    const tdNameTh = document.createElement("td");
    tdNameTh.className = "ecors-nameTh";
    tdNameTh.textContent = plan.nameTh;

    tr.append(tdId, tdCode, tdNameEng, tdNameTh);
    return tr;
}

function showDialog() {
  const dialog = document.querySelector(".ecors-dialog");
  dialog.showModal();
}