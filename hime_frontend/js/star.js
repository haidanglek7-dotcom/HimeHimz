const starsLayer = document.getElementById('starsLayer');
    const shootingLayer = document.getElementById('shootingStars');

    // ---- Twinkling background stars ----
    const STAR_COUNT = 150;
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'bg-star';

      const size = Math.random() * 2 + 1; // 1px - 3px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      starsLayer.appendChild(star);
    }

    // ---- Falling / shooting stars ----
    function createShootingStar() {
      const star = document.createElement('div');
      star.className = 'shooting-star';

      // random starting position along the top/right area
      const startTop = Math.random() * 40 - 10; // -10% to 30%
      const startLeft = Math.random() * 100;

      // random size & speed for variety
      const scale = Math.random() * 0.6 + 0.6; // 0.6 - 1.2
      const duration = Math.random() * 1.2 + 1.2; // 1.2s - 2.4s

      star.style.top = `${startTop}%`;
      star.style.left = `${startLeft}%`;
      star.style.setProperty('--scale', scale);
      star.style.animationDuration = `${duration}s`;

      shootingLayer.appendChild(star);

      // clean up after animation ends
      setTimeout(() => {
        star.remove();
      }, duration * 1000 + 100);
    }

    // spawn shooting stars at random intervals
    function scheduleNextStar() {
      const delay = Math.random() * 240 + 80; // 0.08s - 0.32s
      setTimeout(() => {
        createShootingStar();
        scheduleNextStar();
      }, delay);
    }

    scheduleNextStar();

 const loadingFill = document.getElementById("loadingFill");

const DURATION = 3200; // 3.2 giây

let start = null;

function easeProgress(t) {

    // 0 -> 1

    if (t < 0.75) {

        // Ban đầu khá nhanh
        return t * 1.15;

    } else if (t < 0.92) {

        // Chậm lại khoảng 75-92%
        return 0.86 + (t - 0.75) * 0.35;

    } else {

        // Tăng nhanh về đích
        return 0.92 + (t - 0.92) * 1.0;

    }

}

function animateLoading(timestamp){

    if(!start) start = timestamp;

    let elapsed = timestamp - start;

    let t = Math.min(elapsed / DURATION,1);

    let progress = easeProgress(t);

    progress = Math.min(progress,1);

    loadingFill.style.width = (progress*100)+"%";

    if(t<1){

        requestAnimationFrame(animateLoading);

    }else{

        loadingFill.style.width="100%";

        loadingFill.classList.add("finish");

        setTimeout(()=>{

            document
            .getElementById("introScreen")
            .classList.add("intro-hide");

        },500);

    }

}

requestAnimationFrame(animateLoading);