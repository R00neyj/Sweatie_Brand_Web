console.clear();
AOS.init();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function highlightAni__init() {
  const cardBox = document.querySelector(".sec-2 .scroll-ani");
  const cards = cardBox.querySelectorAll(".card");

  const HighlightObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        let isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          cards.forEach((el) => {
            el.classList.remove("active");
          });
          entry.target.classList.add("active");
          ScrollTrigger.refresh();
        }
      });
    },
    {
      root: null,
      threshold: 0.6,
    }
  );

  cards.forEach((el) => {
    HighlightObserver.observe(el);
  });

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      cards.forEach((el) => {
        el.classList.remove("active");
      });
      card.classList.add("active");

      let Yaxis;
      let delay;
      clearTimeout(delay);
      let delayTime = 600;
      delay = setTimeout(() => {
        Yaxis = card.offsetTop;
        console.log(card, Yaxis);
        window.scrollTo({
          top: Yaxis,
          behavior: "smooth",
        });
      }, delayTime);
    });
  });
}

function newsHover__init() {
  const cardBox = document.querySelector(".sec-6 .card-box");
  const cards = cardBox.querySelectorAll(".card");

  cards.forEach((el) => {
    el.addEventListener("pointerenter", (e) => {
      cards.forEach((cardDeactive) => {
        cardDeactive.classList.remove("active");
      });
      el.classList.add("active");
    });
  });
}

function sec4btnSwapContent() {
  const btns = document.querySelectorAll(".sec-4 .btn-wrap a");
  btns.forEach((el) => {
    let content = el.querySelector("span").textContent;
    el.querySelector("span").style.setProperty("--content", `"${content}"`);
  });
}

function HeaderbtnSwapContent() {
  const btns = document.querySelectorAll(".header .menu-wrap a");
  btns.forEach((el) => {
    let content = el.querySelector("span").textContent;
    el.querySelector("span").style.setProperty("--content", `"${content}"`);
  });
}
HeaderbtnSwapContent();

function textSplit__init() {
  const target = document.querySelectorAll(".sec-4 .text-box span");
  let charArr = [];
  let spanEl;

  target.forEach((el, index) => {
    char = el.textContent.split("");

    charArr.push(char);
    el.innerText = "";

    for (let i = 0; i < char.length; i++) {
      let spans = document.createElement("span");
      spans.textContent = charArr[index][i];
      spans.classList.add(charArr[index][i]);

      el.append(spans);
    }
  });

  // set- data-aos-delay
  const target2 = document.querySelectorAll(".sec-4 .text-box span span");
  target2.forEach((el, index) => {
    el.setAttribute("data-aos", "fade-in");
    el.setAttribute("data-aos-duration", "500");
    el.setAttribute("data-aos-once", "true");
    el.setAttribute("data-aos-delay", (index + 1) * 100);
  });
}

function sec3_gsapScroll__init() {
  let pinWrap = document.querySelector(".sec-3 .content-wrap");
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;

  // Pinning and horizontal scrolling

  gsap.to(".sec-3 .content-wrap", {
    scrollTrigger: {
      scroller: "#smooth-wrapper",
      scrub: true,
      trigger: ".sec-3 .content-wrap",
      pin: true,
      // anticipatePin: 1,
      start: "top top",
      end: pinWrapWidth,
    },
    x: -horizontalScrollLength,
    ease: "none",
  });

  ScrollTrigger.refresh();
}

function sec3__Swiper() {
  const BoxesEl = document.querySelectorAll(".sec-3 .right .box");

  BoxesEl.forEach((box) => {
    let swiperBox = box.querySelector(".swiper");
    let paginationEl = box.querySelector(".swiper-pagination");
    let nextBtn = box.querySelector(".swiper-button-next");
    let prevBtn = box.querySelector(".swiper-button-prev");

    const swiper = new Swiper(swiperBox, {
      loop: true,
      spaceBetween: 24,
      effect: "fade",
      grabCursor: true,

      pagination: {
        el: paginationEl,
        clickable: true,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
    });
  });
}

////////////////////////////////////
// function load
////////////////////////////////////

window.addEventListener("load", () => {
  sec3_gsapScroll__init();
  sec3__Swiper();
  textSplit__init();
  sec4btnSwapContent();
  highlightAni__init();
  newsHover__init();

  ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
  });
});

////////////////////////////////////
// resize
////////////////////////////////////
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(function () {
    sec3_gsapScroll__init();
    ScrollTrigger.refresh();
    console.log("Resize done");
  }, 200);
});
