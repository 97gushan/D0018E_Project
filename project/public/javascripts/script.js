
//alert("Detta funkar till och med - Brought to you by 'public/javascripts/scripts.js linked by index.ejs");


window.onscroll = function() {myFunction()};

var header = document.getElementById("banner");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}