const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))    

let buttons = document.querySelectorAll(".btn-back-to-top");
buttons.forEach(function(button) {
  button.addEventListener("click", backToTop);
});

// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = "block";
//   } else {
//     mybutton.style.display = "none";
//   }
// }

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
