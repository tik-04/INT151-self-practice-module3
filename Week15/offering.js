import { getCourseOfferings, getUserOfferings } from "../../myLib/fetchUtils";

const userReservationContainer = document.querySelector('[data-cy="user-reservation-container"]');
const courseOfferingsContainer = document.querySelector('[data-cy="course-offerings-container"]');

async function loadCourseOfferings(planData = null) {
    try {
        const apiUrl = "api/v1/course-offerings-plans";
        const data = await getCourseOfferings(apiUrl);
        

        courseOfferingsContainer.innerHTML = "";

        const coursesArray = data && data.courseOfferings ? data.courseOfferings : [];
        
        if (coursesArray.length === 0) {
            console.log("No course offerings available now.")
            return;
        }

        const header = document.createElement("h2");
        header.setAttribute("data-cy", "course-offerings-header");
        header.textContent = "Course Offerings";
        courseOfferingsContainer.appendChild(header);

        coursesArray.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.setAttribute("data-cy", "course-offering");
            courseCard.classList.add("course-card"); 

            if ((planData.status !== "CANCELLED") && course.planIds.includes(planData.planId)) {
                courseCard.classList.add("highlight-core"); 
            }

            const codeEl = document.createElement("div");
            codeEl.setAttribute("data-cy", "course-code");
            codeEl.textContent = course.courseCode;
            courseCard.appendChild(codeEl);

            const titleEl = document.createElement("div");
            titleEl.setAttribute("data-cy", "course-title");
            titleEl.textContent = course.courseTitle;
            courseCard.appendChild(titleEl);

            const creditsEl = document.createElement("div");
            creditsEl.setAttribute("data-cy", "course-credits");
            creditsEl.textContent = `${course.courseCredits} credits`;
            courseCard.appendChild(creditsEl);

            const btnContainer = document.createElement("div");

            const reserveBtn = document.createElement("button");
            reserveBtn.setAttribute("data-cy", "button-reserve");
            reserveBtn.textContent = "Reserve";

            const removeBtn = document.createElement("button");
            removeBtn.setAttribute("data-cy", "button-remove");
            removeBtn.textContent = "Remove";

            btnContainer.appendChild(reserveBtn);
            btnContainer.appendChild(removeBtn);
            courseCard.appendChild(btnContainer);

            courseOfferingsContainer.appendChild(courseCard);
        });

    } catch (error) {
        console.error("Error loading course offerings:", error);
    }
}

async function stdReservation(stdId) {

    const header = document.createElement("h2");
    header.setAttribute("data-cy", "user-reserve-header");
    header.textContent = "Your Reservations";
    userReservationContainer.appendChild(header)

    const reserveMessage = document.createElement('p')
    reserveMessage.setAttribute("data-cy", "reservation-message");
    reserveMessage.style.display = "none"

    try {   
        const apiUrl = `api/v1/students/${stdId}/reservations`;
        const userDataReseve = await getUserOfferings(apiUrl)

        const userReservedCourse = userDataReseve.reservedCourses || [];

        if (userDataReseve && userReservedCourse.length > 0) {
            userReservedCourse.forEach(course => {
                const courseElement = document.createElement("p")
                courseElement.setAttribute("data-cy", "course-reserved")
                courseElement.textContent = `${course.courseCode} ${course.courseTitle} (${course.courseCredits})`
                userReservationContainer.appendChild(courseElement)
            })
            reserveMessage.textContent = `Total Credits Reserved: ${userDataReseve.reservedCredits}`
            reserveMessage.style.display = "inline-block"

        }  else {
            reserveMessage.textContent = "No reserved courses for the coming semester."
            reserveMessage.style.display = "inline-block"
        }

        userReservationContainer.appendChild(reserveMessage)

    } catch (error) {
        console.error("Error loading users reservation:", error);
        if (error.status == 404) {
            reserveMessage.textContent = "No reserved courses for the coming semester."
            reserveMessage.style.display = "inline-block"
            userReservationContainer.appendChild(reserveMessage);
        }
    }
}

export { loadCourseOfferings,stdReservation };
