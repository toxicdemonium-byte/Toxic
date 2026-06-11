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
/* FILE SYSTEM */

const fileInput =
document.getElementById("fileInput");

const selectFile =
document.getElementById("selectFile");

const previewArea =
document.getElementById("previewArea");

const progressBar =
document.getElementById("progressBar");

const dropZone =
document.getElementById("dropZone");

/* SELECT FILE */

selectFile.onclick=()=>{

fileInput.click();

};

/* FILE CHANGE */

fileInput.addEventListener(
"change",
handleFiles
);

/* DROP */

dropZone.addEventListener(
"drop",
(e)=>{

e.preventDefault();

handleFileList(
e.dataTransfer.files
);

}
);

dropZone.addEventListener(
"dragover",
(e)=>{

e.preventDefault();

}
);

/* HANDLE */

function handleFiles(){

handleFileList(
fileInput.files
);

}

function handleFileList(files){

previewArea.innerHTML="";

let progress=0;

const timer=
setInterval(()=>{

progress+=10;

progressBar.style.width=
progress+"%";

if(progress>=100){

clearInterval(timer);

}

},100);

[...files].forEach(file=>{

const card=
document.createElement("div");

card.className=
"preview-card";

if(file.type.startsWith("image")){

const reader=
new FileReader();

reader.onload=(e)=>{

card.innerHTML=`

<img src="${e.target.result}">

<h4>${file.name}</h4>

<p>
${(
file.size/1024
).toFixed(1)}
KB
</p>

`;

};

reader.readAsDataURL(file);

}else{

card.innerHTML=`

<h3>📄</h3>

<h4>${file.name}</h4>

<p>
${(
file.size/1024
).toFixed(1)}
KB
</p>

`;

}

previewArea.appendChild(card);

});

}
document
.getElementById("compressImage")
?.addEventListener("click",()=>{

fileInput.onchange=(e)=>{

const file=e.target.files[0];

new Compressor(file,{

quality:0.4,

success(result){

const link=
document.createElement("a");

link.href=
URL.createObjectURL(result);

link.download=
"compressed-"+file.name;

link.click();

}

});

};

fileInput.click();

});