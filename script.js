//////////////////////////////////// global
console.clear();
AOS.init();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// header after content swap
function HeaderbtnSwapContent() {
  const btns = document.querySelectorAll(".header .menu-wrap a");
  btns.forEach((el) => {
    let content = el.querySelector("span").textContent;
    el.querySelector("span").style.setProperty("--content", `"${content}"`);
  });
}

// scrollsmoother
let isSmomther = null;
function ScrollSmoother__init() {
  if (isMobile) {
    return;
  }

  console.log("ScrollSmoother__init");
  isSmomther = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.25,
    effects: true,
  });
}

// side bar
function sideBar__init() {
  const headerEl = document.querySelector(".header");
  const openBtn = headerEl.querySelector(".side-bar-btn");
  const sideBarEl = document.querySelector(".mside-bar ");
  const closeBtn = sideBarEl.querySelector(".close-btn");

  openBtn.addEventListener("click", () => {
    sideBarEl.classList.add("active");
    headerEl.style.opacity = 0;
    headerEl.style.transform = `translateY(-200%)`;
  });

  closeBtn.addEventListener("click", () => {
    sideBarEl.classList.remove("active");
    headerEl.style.opacity = 1;
    headerEl.style.transform = `translateY(0%)`;
  });
}

// AOS 지연시간일일히적기너무귀찮음
function aos지연시간일일히적기귀찮아함수() {
  const 적용할애들 = document.querySelectorAll(
    `
               [data-aos="fade-in"],
               [data-aos="fade-left"],
               [data-aos="fade-right"],
               [data-aos="fade-up"],
               [data-aos="fade-down"] `
  );
  if (적용할애들.length == 0) {
    return;
  }

  const 메인페이지 = document.querySelector("#mainPage");
  let 메인페이지있다 = !!메인페이지;

  const 메인_오프셋 = 200;
  const 듀레이션 = 800;
  const 오프셋 = 300;

  적용할애들.forEach((엘리먼트) => {
    let 듀레이션이미있는애찾기 = 엘리먼트.getAttribute(`data-aos-duration`);
    let 오프셋이미있는애찾기 = 엘리먼트.getAttribute(`data-aos-offset`);
    let 둘다없는애 = (듀레이션이미있는애찾기 == null) & (오프셋이미있는애찾기 == null);

    if (둘다없는애) {
      if (메인페이지있다) {
        엘리먼트.setAttribute("data-aos-duration", 듀레이션);
        엘리먼트.setAttribute("data-aos-offset", 메인_오프셋);
      } else {
        엘리먼트.setAttribute("data-aos-duration", 듀레이션);
        엘리먼트.setAttribute("data-aos-offset", 오프셋);
      }
    }

    if (isMobile) {
      console.log("aos-offset reset");
      엘리먼트.removeAttribute("data-aos-offset");
      엘리먼트.setAttribute("data-aos-offset", "100");
    }
  });
}

//
//////////////////////////////////// mainpage
//

// main sec2 highlight
let HighlightObserver = null;
function highlightAni__init() {
  const cardBox = document.querySelector(".sec-2 .scroll-ani");
  const cards = cardBox.querySelectorAll(".card");

  if (!HighlightObserver) {
    HighlightObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          let isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            cards.forEach((el) => {
              el.classList.remove("active");
            });
            entry.target.classList.add("active");
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 500);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );
  }

  if (isMobile) {
    cards.forEach((el) => {
      el.classList.remove("active");
      HighlightObserver.unobserve(el);
    });
  } else {
    cards.forEach((el) => {
      HighlightObserver.observe(el);
    });
  }

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

// main sec6 news
function newsHover__init() {
  const cardBox = document.querySelector(".sec-6 .card-box");
  const cards = cardBox.querySelectorAll(".card");

  if (isMobile) {
    cards.forEach((cardDeactive) => {
      cardDeactive.classList.remove("active");
    });

    new Swiper(cardBox, {
      slidesPerView: 1.1,
      spaceBetween: 0,
      speed: 600,

      breakpoints: {
        770: {
          slidesPerView: "auto",
        },
      },
    });
  } else {
    cards.forEach((el) => {
      el.addEventListener("pointerenter", (e) => {
        cards.forEach((cardDeactive) => {
          cardDeactive.classList.remove("active");
        });
        el.classList.add("active");
      });
    });
  }
}

// main sec4 btn after content swap
function sec4btnSwapContent() {
  const btns = document.querySelectorAll(".sec-4 .btn-wrap a");
  btns.forEach((el) => {
    let content = el.querySelector("span").textContent;
    el.querySelector("span").style.setProperty("--content", `"${content}"`);
  });
}

// text split for sec 4
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

// sec3 gsap
function sec3_gsapScroll__init() {
  const pinWrap = document.querySelector(".sec-3 .content-wrap");
  if (pinWrap == null) {
    return;
  }

  const header = document.querySelector(".header");

  if (isMobile) {
    console.log(`sec3_gsapScroll__init paused`);
    return;
  }
  // Pinning and horizontal scrolling

  gsap.to(pinWrap, {
    scrollTrigger: {
      scroller: "#smooth-wrapper",
      scrub: 1,
      trigger: pinWrap,
      pin: true,
      // anticipatePin: 1,
      start: "top top",
      end: () => pinWrap.offsetWidth + 200,
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
    x: () => -(pinWrap.offsetWidth - window.innerWidth),
    ease: "none",
  });

  console.log(`main/section3 gsap loaded`);
}

// sec3 swiper
function sec3__Swiper() {
  const swiperEl = document.querySelector(".sec-3 .right.swiper");
  const outerSwiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 100,
    centeredslides: true,

    breakpoints: {
      770: {
        slidesPerView: 4,
        spaceBetween: 80,
        centeredslides: false,
      },
    },
  });

  const BoxesEl = document.querySelectorAll(".sec-3 .right .box");

  BoxesEl.forEach((box) => {
    let swiperBox = box.querySelector(".swiper");
    let paginationEl = box.querySelector(".swiper-pagination");
    let nextBtn = box.querySelector(".swiper-button-next");
    let prevBtn = box.querySelector(".swiper-button-prev");

    const innerSwiper = new Swiper(swiperBox, {
      loop: true,
      spaceBetween: 24,
      effect: "fade",
      grabCursor: false,

      pagination: {
        el: paginationEl,
        clickable: true,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      breakpoints: {
        770: {
          touchRatio: 0.8,
          grabCursor: true,
        },
      },
    });
  });
}

//
//////////////////////////////////// subpage 2
//

// sub2 sec-2 text animation
function sec_2Gsap__init() {
  const target = document.querySelector(".sub2-sec-2 .content-wrap");
  if (target == null) {
    console.log(`sec-2 gsap stoped ${target}`);
    return;
  }
  const spanEl = target.querySelectorAll("span.splited");
  if (spanEl.length == 0) {
    setTimeout(() => {
      sec_2Gsap__init();
    }, 100);
  } else {
    console.log("sec-2 gsap init");
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 70%",
        end: "bottom 70%",
        toggleActions: "play none none reverse",
        // markers: true,
        scrub: 1,
      },
    });
    tl.fromTo(
      spanEl,
      {
        opacity: 0.2,
      },
      {
        opacity: 1,
        duration: 1,
        stagger: 0.05,
      }
    );
  }
}

// subpage 2 sec3,4,5 drawsvg
function sub2Gsap__init() {
  ////////////////// sub2 sec-3
  const target = document.querySelector(".sub2-sec-3");
  if (target == null) {
    return;
  }
  const svgLine1 = document.querySelector("#sec-3-line");
  let drawLineTl = gsap.timeline();

  sub2Trigger__1 = ScrollTrigger.create({
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

  sub2Trigger__2 = ScrollTrigger.create({
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

  sub2Trigger__3 = ScrollTrigger.create({
    trigger: target3,
    animation: drawLineTl3,
    start: "0% 0%",
    end: "100% 100%",
    scrub: 3,
    //  markers: true,
  });
  drawLineTl3.fromTo(svgLine3, { drawSVG: "0%" }, { duration: 10, drawSVG: "100%" });
}

// text spliter // it can be used all section
function AdvancedTextSplit__init() {
  const target = document.querySelectorAll(`[data-split="true"]`);
  if ((target.length = 0)) {
    return;
  }
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

    textAniDelay();
  });
}

// text spliter add delay //// this for main sec4
function textAniDelay() {
  const target = document.querySelectorAll(".splited");
  let targetHas = !!target[0].getAttribute("data-split-delay");
  if (targetHas) {
    return;
  } else {
    target.forEach((el) => {
      // check span has parent span
      let parentEl = el.parentElement.getAttribute("data-split");
      if (parentEl) {
        const index = el.getAttribute("data-splited-index");
        el.style.animationDelay = `${index * 100 + 200}ms`;
      }
    });
  }
}

// main mobile section 2
function mainMobile() {
  if (!isMobile) {
    return;
  }
  const cards = document.querySelectorAll(".scroll-ani > .card");
  const lastCard = cards[cards.length - 1];

  cards.forEach((card, index) => {
    // 💡 scaleSet은 최종 스케일 값으로 사용됨
    let scaleSet = 1 - (cards.length - index) * 0.025;

    gsap.to(card, {
      // ⭐ 1. 스크롤에 따라 scale이 1에서 scaleSet으로 변하도록 설정
      scale: scaleSet,
      ease: "none",

      scrollTrigger: {
        trigger: card,

        // Pin 시작: 뷰포트 중앙에 도달하면 핀 시작
        start: "center center",

        // ⭐ 2. Pin 종료 지점을 마지막 카드 요소의 시작 지점으로 설정
        // 마지막 카드가 뷰포트 상단에 도달할 때 핀 해제
        endTrigger: lastCard,
        end: "center center", // 마지막 카드의 상단이 뷰포트 중앙에 올 때까지 핀 유지

        pin: true,
        pinSpacing: false,
        scrub: true, // ⭐ 스크롤에 동기화
        // markers: true
      },
    });
  });
  // 제미니야 고맙다!
  // let firstCardST = ScrollTrigger.create({
  //   trigger: cards[0],
  //   start: "center center",
  // });

  // let lastCardST = ScrollTrigger.create({
  //   trigger: cards[cards.length - 1],
  //   start: "center center",
  // });

  // cards.forEach((card, index) => {
  //   let scaleSet = 1 - (cards.length - index) * 0.025;
  //   let scaleDown = gsap.to(card, { scale: scaleSet, "transform-origin": '"50% ' + lastCardST.start + '"' });

  //   ScrollTrigger.create({
  //     trigger: card,
  //     start: "center center",
  //     end: () => lastCardST.start,
  //     pin: true,
  //     pinSpacing: false,
  //     ease: "none",
  //     animation: scaleDown,
  //     toggleActions: "restart none none reverse",
  //   });
  // });
}

// sub3 sec 2 filter
function sub3__sec2Filter() {
  const faqFilter = document.querySelectorAll(".filter .button");
  const faqContent = document.querySelectorAll(".faq .faq-content");

  faqFilter.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      faqFilter.forEach((filterEl) => {
        filterEl.classList.remove("active");
      });

      faqContent.forEach((ContentEl) => {
        ContentEl.classList.remove("active");
      });

      btn.classList.add("active");
      faqContent[index].classList.add("active");
    });
  });
}
// sub3 sec 2 modal popup
function sub3__sec2Modal() {
  const btnSupport = document.querySelector(".sub3-sec-2 .btn.support");
  const sub3__modal = document.querySelector(".sub3-contact--modal");
  const btn__sub3__modalClose = sub3__modal.querySelector(".head .btn-close");
  const btn__sub3__modalSubmit = sub3__modal.querySelector(".body .submit");

  btnSupport.addEventListener("click", () => {
    sub3__modal.classList.add("active");
  });
  btn__sub3__modalClose.addEventListener("click", () => {
    sub3__modal.classList.remove("active");
  });
  btn__sub3__modalSubmit.addEventListener("click", () => {
    sub3__modal.classList.remove("active");
    alert(`문의 완료염~~`);
  });
}

////////////////////////////////////
// ========= function load =========
////////////////////////////////////
// ctrl + click  jump to function

function loadList() {
  /////////// global function
  HeaderbtnSwapContent();
  aos지연시간일일히적기귀찮아함수();
  sideBar__init();
  ScrollSmoother__init();

  /////////////////////////////////
  /////////// main page ///////////
  /////////////////////////////////
  if (document.querySelector("#mainPage") == null) {
  } else {
    console.log("mainpage founded");
    sec3_gsapScroll__init();
    sec3__Swiper();
    textSplit__init();
    sec4btnSwapContent();
    highlightAni__init();
    newsHover__init();
    mainMobile();
  }

  /////////////////////////////////
  /////////// subpage 1 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-1") == null) {
  } else {
    console.log("subpage-1 founded");
  }

  /////////////////////////////////
  /////////// subpage 2 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-2") == null) {
  } else {
    console.log("subpage-2 founded");
    sec_2Gsap__init();
    AdvancedTextSplit__init();
    sub2Gsap__init();
  }

  /////////////////////////////////
  /////////// subpage 3 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-3") == null) {
  } else {
    console.log("subpage-3 founded");
    sub3__sec2Filter();
    sub3__sec2Modal();
  }
}

let viewportWidth = window.innerWidth;
const thresholdMobile = 768;
let isMobile = thresholdMobile >= viewportWidth;

window.addEventListener("load", () => {
  console.log(`isMobile : ${isMobile}`);
  loadList();
});

////////////////////////////////////
//============= resize =============
////////////////////////////////////

function reSizeLoadList() {
  const body = document.querySelector("body");
  if (document.querySelector("#mainPage") == null) {
  } else {
    highlightAni__init();
    newsHover__init();
    mainMobile();
    sec3_gsapScroll__init();
  }
  if (document.querySelector("#subpage-2") == null) {
  } else {
    sub2Gsap__init();
    sec_2Gsap__init();
  }
  if (document.querySelector("#subpage-3") == null) {
  } else {
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    // 리사이즈시 너비값 변동 없으면 중지 <= 이거 없으면 모바일에서 계속 리사이즈됨
    let currentWidth = window.innerWidth;
    if (currentWidth == viewportWidth) {
      return;
    }

    viewportWidth = currentWidth;
    isMobile = thresholdMobile >= viewportWidth;

    if (isSmomther) {
      isSmomther.kill();
    }
    isSmomther = null;
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });
    ScrollTrigger.refresh(true);
    reSizeLoadList();

    // console.clear();
    console.log(`isMobile : ${isMobile}`);
    console.log("Resize done // ScrollTrigger reset");
  }, 200);
});
