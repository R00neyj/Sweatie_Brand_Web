// marquee tool ================== //
function marqueeTools__init() {
const track = document.querySelector(".track");
const slides = document.querySelectorAll(".slide");
const slideCount = slides.length;
const slideWidth = slides[0].offsetWidth;

let index = 1;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slideCount - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

track.style.transform = `translateX(-${slideWidth * index}px)`;

function moveToNext() {
  index++;
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(-${slideWidth * index}px)`;

  track.addEventListener("transitionend", () => {
    if (track.children[index].id === "first-clone") {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (track.children[index].id === "last-clone") {
      track.style.transition = "none";
      index = slideCount;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  });
}

setInterval(moveToNext, 2000);
}

marqueeTools__init();
