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
function scrollSmoother__init() {
  gsap.matchMedia().add("(min-width: 769px)", () => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.25,
      effects: true,
    });

    return () => {
      if (smoother) smoother.kill();
    };
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
function aosSetDelay__init() {
  const AosTarget = document.querySelectorAll(
    `
               [data-aos="fade-in"],
               [data-aos="fade-left"],
               [data-aos="fade-right"],
               [data-aos="fade-up"],
               [data-aos="fade-down"] `
  );
  if (AosTarget.length == 0) {
    return;
  }

  const mainPage = document.querySelector("#mainPage");
  let isMainPage = !!mainPage;

  const mainOffset = 200;
  const duration = 800;
  const offset = 300;

  AosTarget.forEach((El) => {
    let isDuration = El.getAttribute(`data-aos-duration`);
    let isOffset = El.getAttribute(`data-aos-offset`);
    let isNoSetting = (isDuration == null) & (isOffset == null);

    if (isNoSetting) {
      if (isMainPage) {
        El.setAttribute("data-aos-duration", duration);
        El.setAttribute("data-aos-offset", mainOffset);
      } else {
        El.setAttribute("data-aos-duration", duration);
        El.setAttribute("data-aos-offset", offset);
      }
    }

    if (isMobile) {
      console.log("aos-offset reset");
      El.removeAttribute("data-aos-offset");
      El.setAttribute("data-aos-offset", "100");
    }

    AOS.refresh();
  });
}

//
//////////////////////////////////// mainpage
//
function main_loading__init() {
  const loadingTime = 1800;
  const htmlEl = document.querySelector("html");
  const loadingEl = document.querySelector(".loading-screen");
  if (loadingEl === null) {
    return;
  }
  const numb = document.querySelector(".percentage .number");
  const video = document.querySelector("#main-video");
  const loadingScreenKey = "hasVisitedBefore";
  const isFirstVisit = sessionStorage.getItem(loadingScreenKey) === null;

  if (isFirstVisit) {
    sessionStorage.setItem(loadingScreenKey, "true");
    loading();
  } else {
    loaded();
  }

  function loading() {
    htmlEl.style.overflow = "hidden";
    let isVideoReady = false;
    loadingEl.style.setProperty("--loading-time", `${loadingTime}ms`);
    video.pause();

    video.addEventListener("canplaythrough", () => {
      isVideoReady = true;
    });

    for (let i = 0; i <= 100; i++) {
      setTimeout(() => {
        numb.textContent = i;
      }, (loadingTime / 100) * i);
    }
    setTimeout(loadCheck, loadingTime + 300);

    function loadCheck() {
      if (isVideoReady) {
        loaded();
      } else {
        console.log("video not loaded...");
        setTimeout(loadCheck, 300);
      }
    }
  }
  function loaded() {
    htmlEl.style.overflow = "auto";
    loadingEl.classList.remove("active");
    document.querySelector(".intro-container > .intro-wrap > .intro-box").classList.add("active");
    document.querySelector(".top-section > .video-container").classList.add("active");
    video.play();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  main_loading__init();
});
// main sec2 highlight
let HighlightObserver = null;
function main_sec2PcAni__init() {
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

            // timer for gsap position refresh
            let timer;
            timer = setTimeout(() => {
              clearTimeout(timer);
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
}

// main mobile section 2
function main_sec2MobileGsap__init() {
  if (!isMobile) {
    return;
  }
  const cards = document.querySelectorAll(".scroll-ani > .card");
  const lastCard = cards[cards.length - 1];

  cards.forEach((card, index) => {
    // scaleSet은 최종 스케일 값으로 사용됨
    let scaleSet = 1 - (cards.length - index) * 0.025;

    let tl = gsap.timeline();
    tl.to(card, {
      scale: scaleSet,
      y: -100,
      ease: "none",
    });

    let st = ScrollTrigger.create({
      trigger: card,
      start: "center center",
      endTrigger: lastCard,
      end: "bottom center",
      pin: true,
      pinSpacing: false,
      scrub: true,
      animation: tl,
      // markers: true,
    });
    st.refresh();
  });
}

// main sec3 gsap
function main_sec3Gsap__init() {
  const pinWrap = document.querySelector(".sec-3 .content-wrap");
  if (pinWrap == null) {
    return;
  }

  const header = document.querySelector(".header");

  if (isMobile) {
    console.log(`main_sec3Gsap__init paused`);
    return;
  }
  // Pinning and horizontal scrolling

  let tl = gsap.timeline();
  tl.to(pinWrap, {
    x: () => -(pinWrap.offsetWidth - window.innerWidth),
    ease: "none",
    duration: 10,
  });
  let st = ScrollTrigger.create({
    trigger: pinWrap,
    pin: true,
    scrub: 1,
    animation: tl,
    // anticipatePin: 1,
    start: "top top",
    // end: () => pinWrap.offsetWidth * 1.5,
    end: "+=270%",
    onEnter: () => {
      ScrollTrigger.refresh();
      header.classList.add("invert");
    },
    onEnterBack: () => {
      header.classList.add("invert");
    },
    onLeave: () => {
      header.classList.remove("invert");
      AOS.refresh();
    },
    onLeaveBack: () => {
      header.classList.remove("invert");
      AOS.refresh();
    },
  });

  console.log(`main/section3 gsap loaded`);
}

// main sec3 swiper
function main_sec3Swiper__init() {
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

// main sec4 btn after content swap
function main_sec4btnSwapContent() {
  const btns = document.querySelectorAll(".sec-4 .btn-wrap a");
  btns.forEach((el) => {
    let content = el.querySelector("span").textContent;
    el.querySelector("span").style.setProperty("--content", `"${content}"`);
  });
}

// text split for sec 4
function main_sec4TextSplit__init() {
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
}

// main sec4 gsap
function main_sec4Gsap__init() {
  const target = document.querySelector(".sec-4");
  let spanEl = document.querySelectorAll(".sec-4 .text-box span span");
  if (spanEl.length === 0) {
    console.log("error");
    return;
  }
  let tl = gsap.timeline();
  tl.fromTo(
    spanEl,
    {
      opacity: 0,
      filter: "blur(4px)",
      x: -25,
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.out",
    }
  );

  let st = ScrollTrigger.create({
    trigger: target,
    animation: tl,
    start: "top center",
    toggleActions: "play none none reverse",
  });

  st.refresh();
}

// main sec5 marquee
function main_sec5GetMarqueeWidth() {
  const sec5 = document.querySelector(".sec-5");
  if (sec5 == null) {
    return;
  }
  const target1 = document.querySelector(".sec-5 .marquee-slider.slider-1 .tracker");
  const target2 = document.querySelector(".sec-5 .marquee-slider.slider-2 .tracker");

  let marquee1Width = target1.getBoundingClientRect().width;
  let marquee2Width = target2.getBoundingClientRect().width;

  sec5.style.setProperty("--main-marquee-1-width", `${marquee1Width}px`);
  sec5.style.setProperty("--main-marquee-2-width", `${marquee2Width}px`);
}

// main sec6 news
function main_sec6Hover__init() {
  const cardBox = document.querySelector(".sec-6 .card-box");
  const cards = cardBox.querySelectorAll(".card");

  if (isMobile) {
    cards.forEach((cardDeactive) => {
      cardDeactive.classList.remove("active");
    });

    new Swiper(cardBox, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      centeredslides: true,

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

//
//////////////////////////////////// subpage 1
//

function sub1Swiper_1__init() {
  let swiper1 = new Swiper(".mySwiper", {
    direction: "horizontal",
    slidesPerView: 1.2,
    spaceBetween: 30,
    mousewheel: true,
    breakpoints: {
      768: {
        direction: "vertical",
        slidesPerView: 1.2,
      },
    },
  });
}

function sub1Swiper_2__init() {
  let swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 1.2,
    spaceBetween: 20,
    slidesPerGroup: 1,
    freeMode: true,
    loop: true,
    speed: "4500",
    loopFillGroupWithBlank: true,
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 30,
      },
    },
  });
}

function sub1_getMarqueeWidth() {
  const marqueeWrap = document.querySelector(".section-divider-wrap");
  const marqueeSlide = marqueeWrap.querySelectorAll(".section-divider");

  let width = marqueeSlide[0].offsetWidth;

  marqueeWrap.style.setProperty("--sub1-marquee-width", `${width}px`);
}

function sub1_sec5Gsap__init() {
  const triggerTarget = document.querySelector(".sub-section-5 .view-value-container");
  const aniTarget = triggerTarget.querySelectorAll(" .value");

  // 스크롤바 생김 방지
  triggerTarget.style.overflowY = "hidden";

  let st;
  let tl = gsap.timeline();

  gsap.set(aniTarget, { y: 100, opacity: 0 });

  tl.fromTo(
    aniTarget,
    {
      y: "50%",
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power1.out",
    }
  );

  st = ScrollTrigger.create({
    trigger: triggerTarget,
    start: "center bottom",
    animation: tl,
    toggleActions: "play none none reverse",
  });

  st.refresh();
}

//
//////////////////////////////////// subpage 2
//

// sub2 sec-2 text animation
function sub2_sec2Gsap__init() {
  const target = document.querySelector(".sub2-sec-2 .content-wrap");
  if (target == null) {
    console.log(`sec-2 gsap stoped ${target}`);
    return;
  }
  const spanEl = target.querySelectorAll("span.splited");
  if (spanEl.length == 0) {
    setTimeout(() => {
      sub2_sec2Gsap__init();
    }, 100);
  } else {
    console.log("sec-2 gsap init");
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 60%",
        end: "bottom 60%",
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
function sub2_GsapSvg__init() {
  CreateGsapSvgAni(".sub2-sec-3 > .svg-box", "#sec-3-line", "50%");
  CreateGsapSvgAni(".sub2-sec-4", "#sec-4-line", "50%");
  CreateGsapSvgAni(".sub2-sec-5 > .svg-box", "#sec-5-line", "50%");

  function CreateGsapSvgAni(targetEl, lineEl, start) {
    const target = document.querySelector(targetEl);
    if (target == null) {
      return;
    }
    const svgLine = document.querySelector(lineEl);
    let tl = gsap.timeline();

    gsap.set(svgLine, { drawSVG: "0%" });
    tl.fromTo(svgLine, { drawSVG: "0%" }, { duration: 10, drawSVG: "100%" });

    let st = ScrollTrigger.create({
      trigger: target,
      animation: tl,
      start: `0% ${start}`,
      end: `100% ${start}`,
      scrub: 1,
      // markers: true,
    });

    st.refresh();
  }
}

// text spliter // it can be used all section
function sub2_textSplit__init() {
  const target = document.querySelectorAll(`[data-split="true"]`);
  if (target.length === 0) {
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

    // textAniDelay();
  });
}

// text spliter add delay ////
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

//
//////////////////////////////////// subpage 3
//

// sub3 sec 2 filter
function sub3_sec2Filter() {
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
function sub3_sec2Modal() {
  const btnSupport = document.querySelector(".sub3-sec-2 .btn.support");
  const sub3__modal = document.querySelector(".sub3-contact--modal");
  const btn__sub3__modalClose = sub3__modal.querySelector(".head .btn-close");
  const form = sub3__modal.querySelector("form.grid");

  btnSupport.addEventListener("click", () => {
    sub3__modal.classList.add("active");
  });
  btn__sub3__modalClose.addEventListener("click", () => {
    sub3__modal.classList.remove("active");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`문의 완료염~~`);
    form.reset();
    sub3__modal.classList.remove("active");
  });
}

////////////////////////////////////
// ========= function load =========
////////////////////////////////////
// ctrl + click  jump to function

function loadList() {
  //loading screen

  /////////// global function
  HeaderbtnSwapContent();
  aosSetDelay__init();
  sideBar__init();
  scrollSmoother__init();

  /////////////////////////////////
  /////////// main page ///////////
  /////////////////////////////////
  if (document.querySelector("#mainPage") == null) {
  } else {
    console.log("mainpage founded");
    main_sec2PcAni__init();
    main_sec2MobileGsap__init();
    main_sec3Gsap__init();
    main_sec3Swiper__init();
    main_sec4TextSplit__init();
    main_sec4Gsap__init();
    main_sec4btnSwapContent();
    main_sec5GetMarqueeWidth();
    main_sec6Hover__init();
  }

  /////////////////////////////////
  /////////// subpage 1 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-1") == null) {
  } else {
    console.log("subpage-1 founded");

    sub1Swiper_1__init();
    sub1Swiper_2__init();
    sub1_getMarqueeWidth();
    sub1_sec5Gsap__init();
  }

  /////////////////////////////////
  /////////// subpage 2 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-2") == null) {
  } else {
    console.log("subpage-2 founded");
    sub2_textSplit__init();
    sub2_sec2Gsap__init();
    sub2_GsapSvg__init();
  }

  /////////////////////////////////
  /////////// subpage 3 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-3") == null) {
  } else {
    console.log("subpage-3 founded");
    sub3_sec2Filter();
    sub3_sec2Modal();
  }

  AOS.refresh();
}

let viewportWidth = window.innerWidth;
const thresholdMobile = 768;
let isMobile = thresholdMobile >= viewportWidth;

window.addEventListener("load", () => {
  // console.log(`isMobile : ${isMobile}`);

  loadList();
  console.clear();
});

////////////////////////////////////
//============= resize =============
////////////////////////////////////

function reSizeLoadList() {
  aosSetDelay__init();
  if (document.querySelector("#mainPage") == null) {
  } else {
    main_sec2PcAni__init();
    main_sec2MobileGsap__init();
    main_sec3Gsap__init();
    main_sec4Gsap__init();
    main_sec5GetMarqueeWidth();
    main_sec6Hover__init();
  }
  if (document.querySelector("#subpage-1") == null) {
  } else {
    sub1_getMarqueeWidth();
    sub1_sec5Gsap__init();
  }

  if (document.querySelector("#subpage-2") == null) {
  } else {
    sub2_sec2Gsap__init();
    sub2_GsapSvg__init();
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    // 리사이즈시 너비값 변동 없으면 중지 <= 이거 없으면 모바일에서 계속 리사이즈됨
    let newWidth = window.innerWidth;
    if (newWidth == viewportWidth) {
      return;
    }

    viewportWidth = newWidth;
    isMobile = thresholdMobile >= viewportWidth;

    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });
    reSizeLoadList();
    ScrollTrigger.refresh();
    AOS.refresh();

    if (isMobile) {
      // 모바일 전환시 스크롤 스무더가 만든 style 해제
      document.querySelector("body").style.height = "auto";
    }

    console.log(`isMobile : ${isMobile}`);
    console.log("Resize done // ScrollTrigger reset");
  }, 200);
});
