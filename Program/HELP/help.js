function pp(x) {
  return console.log(`${x}`);
}

themeToggler.addEventListener("click", () => {
  console.log("45");
  var options = themeToggler.querySelectorAll("span");
  options[0].classList.toggle("active_theme");
  options[1].classList.toggle("active_theme");
  document.querySelector("body").classList.toggle("dark-theme-colors");
});
CANopen_floating_options.style.display = "none";

CANdecoder_menu_btn.addEventListener("click", () => {
  CANopen_menu_btn.classList.remove("selected");
  CANdecoder_menu_btn.classList.add("selected");
  CANopen_Theory_space.classList.add("none");
  CANDECODER_Theory_space.classList.remove("none");
  CANopen_floating_options.style.display = "none";
  CANDECODER_floating_options.style.display = "flex";
});
CANopen_menu_btn.addEventListener("click", () => {
  CANdecoder_menu_btn.classList.remove("selected");
  CANopen_menu_btn.classList.add("selected");
  CANopen_Theory_space.classList.remove("none");
  CANDECODER_Theory_space.classList.add("none");
  CANopen_floating_options.style.display = "flex";
  CANDECODER_floating_options.style.display = "none";
});
function UI_clicked(e) {
  setTimeout(() => {
    scrollTo(0, window.scrollY - Main_header.getBoundingClientRect().height);
  }, 10);
  //remove history
  if (Main_header.querySelector(".active_nav_canopen") != null) {
    Main_header.querySelector(".active_nav_canopen").classList.remove(
      "active_nav_canopen"
    );
  }

  var temp = e.split("#")[1];
  temp = document.querySelector(`[href='#${temp}']`);
  temp.classList.add("active_nav_canopen");
}
document.onscroll = function () {
  if (CANdecoder_menu_btn.classList.contains("selected")) {
    var allEl = CANDECODER_floating_options.querySelectorAll(".nav-link");

    if (Main_header.querySelector(".active_nav_canopen") != null) {
      Main_header.querySelector(".active_nav_canopen").classList.remove(
        "active_nav_canopen"
      );
    }

    for (var i = allEl.length - 1; i >= 0; i--) {
      var temp = window[`${allEl[i].href.split("#")[1]}`].offsetTop;
      if (temp - window.scrollY < 0) {
        allEl[i].classList.add("active_nav_canopen");
        i = 0;
      }
    }
  } else {
    var allEl = CANopen_floating_options.querySelectorAll(".nav-link");

    if (Main_header.querySelector(".active_nav_canopen") != null) {
      Main_header.querySelector(".active_nav_canopen").classList.remove(
        "active_nav_canopen"
      );
    }

    for (var i = allEl.length - 1; i >= 0; i--) {
      var temp = window[`${allEl[i].href.split("#")[1]}`].offsetTop;
      if (temp - window.scrollY < 0) {
        allEl[i].classList.add("active_nav_canopen");
        i = 0;
      }
    }
  }
};
