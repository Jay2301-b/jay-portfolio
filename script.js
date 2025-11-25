// Smooth page fade-in
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});


// YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// DARK / LIGHT MODE TOGGLE
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

// SCROLL REVEAL EFFECT
const revealItems = document.querySelectorAll(".fade-up");
function reveal() {
  revealItems.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      item.classList.add("show");
    }
  });
}
window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

// CONTACT FORM
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  document.getElementById("formMsg").textContent = "Message sent ✔️";
  this.reset();
});
