import { reserveCourse, cancelReservation } from "../../myLib/fetchUtils";
import { showDialog } from "./dialog";

// --- State ---
let userReservations = [];
let cumulativeCreditLimit = 9;
let currentPeriod = null;

// --- DOM Elements ---
const reservationMessageEl = document.querySelector('[data-cy="reservation-message-container"]');

async function loadReservations(stdId) {
    try {
        // --- Load current reservation period ---
        const periodsRes = await fetch("api/v1/reservation-periods");
        const periodsDataRaw = await periodsRes.json();
        const periodsData = Array.isArray(periodsDataRaw) ? periodsDataRaw : periodsDataRaw.data || [];

        const now = new Date();
        currentPeriod = periodsData.find(
            p => p.isActive && new Date(p.startDatetime) <= now && now <= new Date(p.endDatetime)
        );

        // --- Load user reservations ---
        console.log("Fetching reservations for student:", stdId);       // <-- เพิ่มตรงนี้
        console.log(`URL: api/v1/students/${stdId}/reservations`); 
        const resRes = await fetch(`api/v1/students/${stdId}/reservations`);
        userReservations = resRes.ok ? (await resRes.json()).reservations || [] : [];

        // --- Update course cards ---
        const courseCards = document.querySelectorAll('[data-cy="course-offering"]');

        courseCards.forEach(card => {
            const offeringId = parseInt(card.getAttribute('data-course-id'));
            if (!offeringId) return;

            const reserveBtn = card.querySelector('[data-cy="button-reserve"]');
            const removeBtn = card.querySelector('[data-cy="button-remove"]');

            const reserved = userReservations.some(r => r.courseOfferingId === offeringId);
            const totalReservedCredits = userReservations.reduce((acc, r) => acc + r.courseCredits, 0);

            const courseCreditsText = card.querySelector('[data-cy="course-credits"]').textContent || "0";
            const courseCredits = parseInt(courseCreditsText.replace(/\D/g, "")) || 0;

            // --- Enable/Disable buttons ---
            reserveBtn.disabled = !currentPeriod || reserved || (totalReservedCredits + courseCredits > cumulativeCreditLimit);
            removeBtn.disabled = !currentPeriod || !reserved;

            // --- Button colors ---
            reserveBtn.style.backgroundColor = reserveBtn.disabled ? "#ccc" : "#1e90ff";
            removeBtn.style.backgroundColor = removeBtn.disabled ? "#ccc" : "#ffcc00";

            // --- Clear previous listeners ---
            reserveBtn.replaceWith(reserveBtn.cloneNode(true));
            removeBtn.replaceWith(removeBtn.cloneNode(true));

            const newReserveBtn = card.querySelector('[data-cy="button-reserve"]');
            const newRemoveBtn = card.querySelector('[data-cy="button-remove"]');

            // --- Reserve Event ---
            newReserveBtn.addEventListener("click", async () => {
                try {
                    const url = `api/v1/students/${stdId}/reservations`;
                    const res = await reserveCourse(url, offeringId);
                    userReservations.push(res);
                    await loadReservations(stdId); // refresh UI
                } catch (err) {
                    handleReserveError(err);
                }
            });

            // --- Remove Event ---
            newRemoveBtn.addEventListener("click", async () => {
                try {
                    const url = `api/v1/students/${stdId}/reservations/${offeringId}`;
                    await cancelReservation(url);
                    userReservations = userReservations.filter(r => r.courseOfferingId !== offeringId);
                    await loadReservations(stdId); // refresh UI
                } catch (err) {
                    handleReserveError(err);
                }
            });
        });

        renderReservations();
    } catch (err) {
        console.error(err);
        showDialog("Cannot load reservation data. Please try again later.");
    }
}

function renderReservations() {
    const totalCredits = userReservations.reduce((acc, r) => acc + r.courseCredits, 0);

    if (!currentPeriod) {
        reservationMessageEl.textContent = userReservations.length === 0
            ? "No reserved courses for the coming semester."
            : `Total Credits Reserved: ${totalCredits}`;
    } else {
        reservationMessageEl.textContent = `Total Credits Reserved: ${totalCredits} / ${cumulativeCreditLimit}`;
    }
}

function handleReserveError(err) {
    console.error(err);
    if (err.status === 403) {
        showDialog("Cannot perform this action because the reservation period is currently closed.");
    } else if (err.status === 409) {
        showDialog(err.message || "Reservation conflict.");
    } else {
        showDialog("Cannot perform this action. Please try again later.");
    }
}

export { loadReservations };
