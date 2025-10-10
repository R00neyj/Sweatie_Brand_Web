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
}

// main mobile section 2
function main_sec2MobileGsap__init() {
  if (!isMobile) {
    return;
  }
  const cards = document.querySelectorAll(".scroll-ani > .card");
  const lastCard = cards[cards.length - 1];

  cards.forEach((card, index) => {
    // 💡 scaleSet은 최종 스케일 값으로 사용됨
    let scaleSet = 1 - (cards.length - index) * 0.025;

    let tl = gsap.timeline();
    tl.to(card, {
      scale: scaleSet,
      y: -100,
      ease: "none",
    });

    ScrollTrigger.create({
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
  });
  ScrollTrigger.refresh();
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
  ScrollTrigger.create({
    trigger: pinWrap,
    pin: true,
    scrub: 1,
    animation: tl,
    // anticipatePin: 1,
    start: "top top",
    // end: () => pinWrap.offsetWidth * 1.5,
    end: "+=270%",
    onEnter: () => {
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

//
//////////////////////////////////// subpage 1
//

function sub1Swiper_1__init() {
  var swiper1 = new Swiper(".mySwiper", {
    direction: "horizontal",
    slidesPerView: 1.2,
    spaceBetween: 30,
    mousewheel: true,
    breakpoints: {
      768: {
        direction: "vertical",
      },
    },
  });
}

function sub1Swiper_2__init() {
  var swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 1.2,
    spaceBetween: 30,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });
}

function textFlow__init() {
  $("html").mouseenter(function () {
    $(this).find("> body > .sub-1-main > .sub-section-1 > .slogun-text-wrapper").addClass("textSlider");
  });
}

function boxViewer__init() {
  $(".sub-1-main > .sub-section-5 > .view-value-container > div > img").hover(
    function () {
      $(this).parent().children("span").children("h5").addClass("viewer");
    },
    function () {
      $(this).parent().children("span").children("h5").removeClass("viewer");
    }
  );
}

function sub1_getMarqueeWidth() {
  const marqueeWrap = document.querySelector(".section-divider-wrap");
  const marqueeSlide = marqueeWrap.querySelectorAll(".section-divider");

  let width = marqueeSlide[0].offsetWidth;
  console.log(width);

  marqueeWrap.style.setProperty("--sub1-marquee-width", `${width}px`);
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
function sub2_GsapSvg__init() {
  CreateGsapSvgAni(".sub2-sec-3", "#sec-3-line");
  CreateGsapSvgAni(".sub2-sec-4", "#sec-4-line");
  CreateGsapSvgAni(".sub2-sec-5", "#sec-5-line");

  function CreateGsapSvgAni(targetEl, lineEl) {
    const target = document.querySelector(targetEl);
    if (target == null) {
      return;
    }
    const svgLine = document.querySelector(lineEl);
    let tl = gsap.timeline();

    gsap.set(svgLine, { drawSVG: "5%" });
    tl.fromTo(svgLine, { drawSVG: "5%" }, { duration: 10, drawSVG: "100%" });

    let st = ScrollTrigger.create({
      trigger: target,
      animation: tl,
      start: "0% 10%",
      end: "100% 0%",
      scrub: 1,
      // markers: true,
    });

    st.refresh();
  }
}

// text spliter // it can be used all section
function sub2_textSplit__init() {
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
  /////////// global function
  HeaderbtnSwapContent();
  aos지연시간일일히적기귀찮아함수();
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
    sub1_getMarqueeWidth();
    textFlow__init();
    sub1Swiper_1__init();
    sub1Swiper_2__init();
    boxViewer__init();
  }

  /////////////////////////////////
  /////////// subpage 2 ///////////
  /////////////////////////////////
  if (document.querySelector("#subpage-2") == null) {
  } else {
    console.log("subpage-2 founded");
    sub2_sec2Gsap__init();
    sub2_textSplit__init();
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
  console.log(`isMobile : ${isMobile}`);
  loadList();
});

////////////////////////////////////
//============= resize =============
////////////////////////////////////

function reSizeLoadList() {
  aos지연시간일일히적기귀찮아함수();
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
  }

  if (document.querySelector("#subpage-2") == null) {
  } else {
    sub2_sec2Gsap__init();
    sub2_GsapSvg__init();
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
