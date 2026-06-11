/* =========================
   CURSOR
========================= */

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove",(e)=>{
if(cursor){
cursor.style.left = e.clientX + "px";
cursor.style.top = e.clientY + "px";
}
});

/* =========================
   PRELOADER
========================= */

window.addEventListener("load",()=>{

const preloader =
document.getElementById("preloader");

if(preloader){
preloader.style.display="none";
}

});

/* =========================
   DARK MODE
========================= */

const themeBtn =
document.getElementById("themeBtn");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="light"){
document.body.classList.add("light");
}

if(themeBtn){

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

if(
document.body.classList.contains("light")
){
localStorage.setItem("theme","light");
}else{
localStorage.setItem("theme","dark");
}

});

}

/* =========================
   MOBILE MENU
========================= */

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.getElementById("navLinks");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});

}

/* =========================
   TOP BUTTON
========================= */

const topBtn =
document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(!topBtn) return;

if(window.scrollY > 400){
topBtn.style.display="block";
}else{
topBtn.style.display="none";
}

});

if(topBtn){

topBtn.addEventListener("click",()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

});

}

/* =========================
   FILE SYSTEM
========================= */

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

if(selectFile){

selectFile.onclick=()=>{
fileInput.click();
};

}

if(fileInput){

fileInput.addEventListener(
"change",
handleFiles
);

}

if(dropZone){

dropZone.addEventListener(
"dragover",
(e)=>{
e.preventDefault();
}
);

dropZone.addEventListener(
"drop",
(e)=>{

e.preventDefault();

handleFileList(
e.dataTransfer.files
);

}
);

}

function handleFiles(){

handleFileList(
fileInput.files
);

}

function handleFileList(files){

if(!previewArea) return;

previewArea.innerHTML="";

let progress=0;

const timer=setInterval(()=>{

progress+=10;

if(progressBar){
progressBar.style.width=
progress+"%";
}

if(progress>=100){
clearInterval(timer);
}

},100);

[...files].forEach(file=>{

const card =
document.createElement("div");

card.className=
"preview-card";

if(
file.type.startsWith("image")
){

const reader =
new FileReader();

reader.onload=(e)=>{

card.innerHTML=`
<img src="${e.target.result}">
<h4>${file.name}</h4>
<p>${(file.size/1024).toFixed(1)} KB</p>
`;

};

reader.readAsDataURL(file);

}else{

card.innerHTML=`
<h3>📄</h3>
<h4>${file.name}</h4>
<p>${(file.size/1024).toFixed(1)} KB</p>
`;

}

previewArea.appendChild(card);

});

}

/* =========================
   LIVE SEARCH
========================= */

const searchInput =
document.querySelector(
".search-box input"
);

const tools =
document.querySelectorAll(
".tool-card"
);

if(searchInput){

searchInput.addEventListener(
"keyup",
()=>{

const value =
searchInput.value.toLowerCase();

tools.forEach(tool=>{

const text =
tool.textContent.toLowerCase();

tool.style.display =
text.includes(value)
? "block"
: "none";

});

}
);

}

/* =========================
   DOWNLOAD HISTORY
========================= */

function addToHistory(name){

let history =
JSON.parse(
localStorage.getItem(
"downloads"
)
)||[];

history.push(name);

localStorage.setItem(
"downloads",
JSON.stringify(history)
);

renderHistory();

}

function renderHistory(){

const list =
document.getElementById(
"historyList"
);

if(!list) return;

list.innerHTML="";

let history =
JSON.parse(
localStorage.getItem(
"downloads"
)
)||[];

history.reverse().forEach(item=>{

const li =
document.createElement("li");

li.textContent=item;

list.appendChild(li);

});

}

renderHistory();

/* =========================
   IMAGE WATERMARK
========================= */

const watermarkTool =
document.getElementById(
"watermarkTool"
);

if(watermarkTool){

watermarkTool.addEventListener(
"click",
()=>{

fileInput.onchange=(e)=>{

const file=e.target.files[0];

const reader=
new FileReader();

reader.onload=(event)=>{

const img=
new Image();

img.onload=()=>{

const canvas=
document.createElement("canvas");

canvas.width=
img.width;

canvas.height=
img.height;

const ctx=
canvas.getContext("2d");

ctx.drawImage(img,0,0);

ctx.font="40px Arial";

ctx.fillStyle=
"rgba(255,255,255,.5)";

ctx.fillText(
"TOXIC",
50,
80
);

const a=
document.createElement("a");

a.href=
canvas.toDataURL();

a.download=
"watermark.png";

a.click();

addToHistory(
"watermark.png"
);

};

img.src=
event.target.result;

};

reader.readAsDataURL(file);

};

fileInput.click();

}
);

}

/* =========================
   QR GENERATOR
========================= */

const qrGenerator =
document.getElementById(
"qrGenerator"
);

if(qrGenerator){

qrGenerator.addEventListener(
"click",
()=>{

const text =
prompt(
"Enter URL or Text"
);

if(!text) return;

QRCode.toCanvas(
document.getElementById(
"qrCanvas"
),
text
);

}
);

}

/* =========================
   OCR
========================= */

const ocrTool =
document.getElementById(
"ocrTool"
);

if(ocrTool){

ocrTool.addEventListener(
"click",
()=>{

fileInput.onchange =
async(e)=>{

const file =
e.target.files[0];

const output =
document.getElementById(
"ocrResult"
);

output.innerHTML =
"Scanning...";

const result =
await Tesseract.recognize(
file,
"eng"
);

output.innerText =
result.data.text;

};

fileInput.click();

}
);

}

console.log(
"TOXIC Toolkit Loaded Successfully"
);