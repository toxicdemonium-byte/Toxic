const container = document.querySelector(".container");

function signup(){
    container.classList.add("active");
}

function signin(){
    container.classList.remove("active");
}






const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove",(e)=>{
cursor.style.left=e.clientX+"px";
cursor.style.top=e.clientY+"px";
});

const themeBtn=document.getElementById("themeBtn");

themeBtn.onclick=()=>{
document.body.classList.toggle("light");
};
// Drag Drop Effect

const dropZone=document.querySelector(".drop-zone");

dropZone.addEventListener("dragover",(e)=>{
e.preventDefault();
dropZone.style.borderColor="#3b82f6";
});

dropZone.addEventListener("dragleave",()=>{
dropZone.style.borderColor="rgba(255,255,255,.2)";
});

// Live Search

const searchInput =
document.querySelector(".search-box input");

const tools =
document.querySelectorAll(".tool-card");

searchInput.addEventListener("keyup",()=>{

const value =
searchInput.value.toLowerCase();

tools.forEach(tool=>{

const text =
tool.textContent.toLowerCase();

if(text.includes(value)){
tool.style.display="block";
}else{
tool.style.display="none";
}

});

});

/* PRELOADER */

window.addEventListener("load",()=>{

document.getElementById("preloader")
.style.display="none";

});

/* TOP BUTTON */

const topBtn =
document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>400){
topBtn.style.display="block";
}else{
topBtn.style.display="none";
}

});

topBtn.onclick=()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

};

/* THEME SAVE */

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="light"){
document.body.classList.add("light");
}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){
localStorage.setItem("theme","light");
}else{
localStorage.setItem("theme","dark");
}

});

/* MOBILE MENU */

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.getElementById("navLinks");

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});