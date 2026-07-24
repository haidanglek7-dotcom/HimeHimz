
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