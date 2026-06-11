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