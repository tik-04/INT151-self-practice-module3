async function  declarePlan(url,planId) {
    try {
        const res = await fetch(`${url}`, { 
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ planId: parseInt(planId)}),
         })
        if (res.status !== 201) {
            const error = new Error("Fail to Declared")
            error.status = res.status;
            throw error;
        }
        const addedPlan = await res.json()
        return addedPlan

    } catch (error) {
        throw error
    }
}


async function  getDeclarePlan(url) {
    try {
        const res = await fetch(`${url}`, { 
            method : "GET",
            headers: {
                "Content-Type": "application/json",
            },
         })
        if (res.status !== 200) {
            const error = new Error("Fail to Declared")
            error.status = res.status;
            throw error;
        }

        const declaredPlan = await res.json()
        return declaredPlan

    } catch (error) {
        throw error
    }
}

async function getStudyPlan(url) {
    try { 
        const res = await fetch(`${url}`, { 
            method : "GET",
            headers: {
                "Content-Type": "application/json",
            },
         })
        
        if (!res.ok) {
            const error = new Error(`HTTP error! status: ${res.status}`);
            error.status = res.status;
            throw error;
        }
        const allPlan = await res.json()
        return allPlan

    } catch (error) {
        throw error
    }
}

async function updateDeclaredPlan(url, planId) {
  try {
    const res = await fetch(`${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId: parseInt(planId) }),
    });

    if (res.status !== 200) {
      const error = new Error("Fail to Update Declared Plan");
      error.status = res.status;
      throw error;
    }
    const updatedPlan = await res.json();
    return updatedPlan;

  } catch (error) {
    throw error
  }
}

async function cancelDeclaredPlan(url) {
  try {
    const res = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      const error = new Error("Fail to Cancel Declared Plan");
      error.status = res.status;
      throw error;
    }

    const cancelled = await res.json();
    return cancelled;
    
  } catch (error) {
    throw error;
  }
}

async function getCourseOfferings(url) {
    try {
        const res = await fetch(`${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }, 
        });
        if (res.status !== 200) {
            const error = new Error("Fail to get course offerings");
            error.status = res.status;
            throw error;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function reserveCourse(url, courseOfferingId) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseOfferingId: parseInt(courseOfferingId) })
        });
        if (res.status !== 201) {
            const error = new Error("Fail to reserve course");
            error.status = res.status;
            throw error;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function cancelReservation(url) {
    try {
        const res = await fetch(url, { method: "DELETE" });
        if (res.status !== 204) { 
            const error = new Error("Fail to cancel reservation");
            error.status = res.status;
            throw error;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

export { declarePlan, getStudyPlan, getDeclarePlan, updateDeclaredPlan, cancelDeclaredPlan, getCourseOfferings, reserveCourse, cancelReservation }