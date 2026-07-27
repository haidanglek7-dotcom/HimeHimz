
const texts = [
    "Himehimz.com"
];

const typewriter = document.getElementById("introTypewriter");

let textIndex = 0;
let charIndex = 0;

function typeEffect(){

    if(charIndex < texts[textIndex].length){

        typewriter.textContent += texts[textIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeEffect,60); // tốc độ gõ

    }else{

        setTimeout(deleteEffect,1500); // dừng trước khi xóa

    }

}

function deleteEffect(){

    if(charIndex > 0){

        typewriter.textContent =
            texts[textIndex].substring(0,charIndex-1);

        charIndex--;

        setTimeout(deleteEffect,20);

    }else{

        textIndex = (textIndex+1)%texts.length;

        setTimeout(typeEffect,400);

    }

}

typeEffect();

async function loadSchedule() {
    const response = await fetch("https://backend.himehimzvtuber.workers.dev/api/schedule")
    const schedules = await response.json();

    const scheduleList = document.getElementById("schedule-list");

    scheduleList.innerHTML = "";

    schedules.forEach(item => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong class="schedule-day">${item.day}</strong>
            <span class="schedule-time">${item.time}</span>
            <span class="schedule-show">${item.title}</span>
        `;

        scheduleList.appendChild(li);
    });
}

loadSchedule();