const API =
    "https://backend.himehimzvtuber.workers.dev/api/schedule";

let currentScheduleId = null;

const dayInput = document.getElementById("day");
const timeInput = document.getElementById("time");
const titleInput = document.getElementById("title");

const scheduleList =
    document.getElementById("schedule-list");

const saveButton =
    document.getElementById("save-schedule");

const addButton =
    document.getElementById("add-schedule-row");


//=========================
// LOAD
//=========================

async function loadSchedule() {

    const response = await fetch(API);

    const schedules = await response.json();

    renderSchedule(schedules);

}


//=========================
// RENDER
//=========================

function renderSchedule(schedules) {

    scheduleList.innerHTML = "";

    schedules.forEach(schedule => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${schedule.day}</strong>

            ${schedule.time}

            ${schedule.title}

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>
        `;

        //-----------------------
        // EDIT
        //-----------------------

        li.querySelector(".edit-btn")
            .addEventListener("click", () => {

                currentScheduleId = schedule.id;

                dayInput.value = schedule.day;

                timeInput.value = schedule.time;

                titleInput.value = schedule.title;

            });

        //-----------------------
        // DELETE
        //-----------------------

        li.querySelector(".delete-btn")
            .addEventListener("click", () => {

                deleteSchedule(schedule.id);

            });

        scheduleList.appendChild(li);

    });

}


//=========================
// SAVE
//=========================

async function saveSchedule() {

    const day = dayInput.value;

    const time = timeInput.value.trim();

    const title = titleInput.value.trim();

    if (!time || !title) {

        alert("Please fill in all fields.");

        return;

    }

    //--------------------------------
    // ADD
    //--------------------------------

    if (currentScheduleId === null) {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                day,

                time,

                title

            })

        });

        const schedules = await response.json();

        renderSchedule(schedules);

    }

    //--------------------------------
    // UPDATE
    //--------------------------------

    else {

        const response = await fetch(

            `${API}/${currentScheduleId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    day,

                    time,

                    title

                })

            }

        );

        const schedules = await response.json();

        renderSchedule(schedules);

    }

    //-----------------------
    // RESET FORM
    //-----------------------

    currentScheduleId = null;

    dayInput.value = "Monday";

    timeInput.value = "";

    titleInput.value = "";

}


//=========================
// DELETE
//=========================

async function deleteSchedule(id){

    if(!confirm("Delete this schedule?")){

        return;

    }

    const response = await fetch(

        `${API}/${id}`,

        {

            method:"DELETE"

        }

    );

    const schedules = await response.json();

    renderSchedule(schedules);

}


//=========================
// BUTTON
//=========================

saveButton.addEventListener(

    "click",

    saveSchedule

);

addButton.addEventListener(

    "click",

    ()=>{

        currentScheduleId = null;

        dayInput.value="Monday";

        timeInput.value="";

        titleInput.value="";

    }

);


//=========================

loadSchedule();