//////////////////////////////////// global
console.clear();
AOS.init();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function HeaderbtnSwapContent() {
   const btns = document.querySelectorAll(".header .menu-wrap a");
   btns.forEach((el) => {
      let content = el.querySelector("span").textContent;
      el.querySelector("span").style.setProperty("--content", `"${content}"`);
   });
}
function ScrollSmoother__init() {
   ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
   });
}

//////////////////////////////////// mainpage
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
   const pinWrap = document.querySelector(".sec-3 .content-wrap");
   let pinWrapWidth = pinWrap.offsetWidth;
   let horizontalScrollLength = pinWrapWidth - window.innerWidth;
   const header = document.querySelector(".header");

   if (window.innerWidth < 768) {
      console.log(`sec3_gsapScroll__init paused`);
      return;
   }
   // Pinning and horizontal scrolling

   gsap.to(".sec-3 .content-wrap", {
      scrollTrigger: {
         scroller: "#smooth-wrapper",
         scrub: 1,
         trigger: ".sec-3 .content-wrap",
         pin: true,
         // anticipatePin: 1,
         start: "top top",
         end: pinWrapWidth,
         onEnter: () => {
            header.classList.add("invert");
         },
         onEnterBack: () => {
            header.classList.add("invert");
         },
         onLeave: () => {
            header.classList.remove("invert");
         },
         onLeaveBack: () => {
            header.classList.remove("invert");
         },
      },
      x: -horizontalScrollLength,
      ease: "none",
   });
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
//////////////////////////////////// subpage 2

function aos지연시간일일히적기귀찮아함수() {
   const 적용할애들 = document.querySelectorAll(
      `
               [data-aos="fade-in"],
               [data-aos="fade-left"],
               [data-aos="fade-right"],
               [data-aos="fade-up"],
               [data-aos="fade-down"] `
   );
   let 지연시간 = 800;
   let 오프셋 = 300;

   적용할애들.forEach((엘리먼트) => {
      let 지연시간이미있는애찾기 = 엘리먼트.getAttribute(`data-aos-duration`);
      let 오프셋이미있는애찾기 = 엘리먼트.getAttribute(`data-aos-offset`);
      let 불리언타입으로바꾸기 = (지연시간이미있는애찾기 == null) & (오프셋이미있는애찾기 == null);

      if (불리언타입으로바꾸기) {
         엘리먼트.setAttribute("data-aos-duration", 지연시간);
         엘리먼트.setAttribute("data-aos-offset", 오프셋);
      }
   });
}
function gsap__init() {
   ////////////////// sec-3
   const target = document.querySelector(".sub2-sec-3");
   const svgLine1 = document.querySelector("#sec-3-line");
   let drawLineTl = gsap.timeline();

   const trigger__1 = ScrollTrigger.create({
      trigger: target,
      animation: drawLineTl,
      start: "0% 0%",
      end: "100% 100%",
      scrub: 3,
      //  markers: true,
   });
   drawLineTl.fromTo(svgLine1, { drawSVG: "0%" }, { duration: 10, drawSVG: "100%" });

   ////////////////// sec-4
   const target2 = document.querySelector(".sub2-sec-4");
   const svgLine2 = document.querySelector("#sec-4-line");
   let drawLineTl2 = gsap.timeline();

   const trigger__2 = ScrollTrigger.create({
      trigger: target2,
      animation: drawLineTl2,
      start: "0% 0%",
      end: "100% 100%",
      scrub: 3,
      //  markers: true,
   });
   drawLineTl2.fromTo(svgLine2, { drawSVG: "0%" }, { duration: 10, drawSVG: "100%" });

   ////////////////// sec-5
   const target3 = document.querySelector(".sub2-sec-5");
   const svgLine3 = document.querySelector("#sec-5-line");
   let drawLineTl3 = gsap.timeline();

   const trigger__3 = ScrollTrigger.create({
      trigger: target3,
      animation: drawLineTl3,
      start: "0% 0%",
      end: "100% 100%",
      scrub: 3,
      //  markers: true,
   });
   drawLineTl3.fromTo(svgLine3, { drawSVG: "0%" }, { duration: 10, drawSVG: "100%" });
}

function AdvancedTextSplit__init() {
   const target = document.querySelectorAll(`[data-split="true"]`);
   target.forEach((el, index) => {
      let char = el.textContent.split("");
      el.textContent = "";

      for (let i = 0; i < char.length; i++) {
         let spans = document.createElement("span");
         spans.textContent = char[i];

         spans.classList.add(`splited`);
         spans.classList.add(`splited_${char[i].replace(" ", "_")}`);
         spans.setAttribute("data-splited-index", i + 1);

         el.append(spans);
      }

      // textAniDelay();
   });
}
function textAniDelay() {
   const target = document.querySelectorAll(".splited");

   target.forEach((el) => {
      let parentEl = el.parentElement.getAttribute("data-split");
      if (parentEl) {
         const index = el.getAttribute("data-splited-index");
         el.style.animationDelay = `${index * 100 + 200}ms`;
      }
   });
}

////////////////////////////////////
////////// function load
////////////////////////////////////
// ctrl + click function

let viewportWidth = window.innerWidth;
const thresholdMobile = 768;

window.addEventListener("load", () => {
   /////////// global function

   HeaderbtnSwapContent();
   if (viewportWidth >= thresholdMobile) {
      ScrollSmoother__init();
      console.log("ScrollSmoother__init");
   }

   /////////// vertify main page
   if (document.querySelector("#mainPage") == null) {
      console.log("mainpage not founded");
   } else {
      console.log("mainpage founded");
      if (viewportWidth > thresholdMobile) {
      }
      sec3_gsapScroll__init();
      sec3__Swiper();
      textSplit__init();
      sec4btnSwapContent();
      highlightAni__init();
      newsHover__init();
   }

   /////////// vertify subpage 2
   if (document.querySelector("#subpage-2") == null) {
      console.log("subpage-2 not founded");
   } else {
      console.log("subpage-2 founded");
      aos지연시간일일히적기귀찮아함수();
      AdvancedTextSplit__init();
      gsap__init();
   }
});

////////////////////////////////////
// resize
////////////////////////////////////
let resizeTimer;
window.addEventListener("resize", function () {
   clearTimeout(resizeTimer);

   resizeTimer = setTimeout(function () {
      viewportWidth = window.innerWidth;
      if (viewportWidth >= thresholdMobile) {
         sec3_gsapScroll__init();
      }
      ScrollSmoother__init();
      console.log("Resize done");

      console.log(viewportWidth);
   }, 200);
});
