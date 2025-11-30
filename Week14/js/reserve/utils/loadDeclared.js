import { getDeclarePlan } from "../../myLib/fetchUtils";
import timeFormat from "./timeFormat";

const fullNameDom = document.querySelector(".ecors-fullname");

async function fetchStudyDecalred(kc,studentId) {
  try {
    if (fullNameDom) fullNameDom.textContent = kc.tokenParsed.name;

    const apiUrl = `api/v1/students/${studentId}/declared-plan`
    const data = await getDeclarePlan(apiUrl)


    return data
  } catch (error) {
    console.error("Error fetching declared plan:", error);
    if (error.status === 404) {
        return null
    }
  }
}

async function showDeclared(data) {

  const declaredDom = document.querySelector(".ecors-declared-plan");
  const declareBtn = document.querySelector(".ecors-button-declare");
  const changeBtn = document.querySelector(".ecors-button-change");
  const cancelBtn = document.querySelector(".ecors-button-cancel")
  
  if (!declaredDom) return;

  if (data && data.status === "DECLARED") {

    const dataDate = data.updatedAt
    const declareText = await timeFormat(dataDate,data)
    declaredDom.textContent = `Declared ${declareText}`

    if (declareBtn) declareBtn.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-block";
    if (cancelBtn) cancelBtn.style.display = "inline-block";

    return declareText

  }
  
  if (data && data.status === "CANCELLED") {
    const dataDate = data.updatedAt
    const declareText = await timeFormat(dataDate,data)
    declaredDom.textContent = `Cancelled ${declareText}`

    if (declareBtn) declareBtn.style.display = "inline-block";
    if (changeBtn) changeBtn.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";

  } else {
    declaredDom.textContent = "Not Declared";

    if (declareBtn) declareBtn.style.display = "inline-block";
    if (changeBtn) changeBtn.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";
  }
    
}

export { fetchStudyDecalred,showDeclared }
