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