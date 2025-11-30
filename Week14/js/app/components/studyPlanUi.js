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

export default createStudyPlanRow