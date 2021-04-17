if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/scripts/service-worker.js")
        .then(console.log("swrk registerd !"))
        .catch((err) => console.log(err));
}
var ldr = document.querySelector(".loader");
window.onload = () => {
    ldr.style.opacity = "0";
    setTimeout(() => ldr.classList.add("stop"),500);
};

const spn = document.getElementById("spn-bcm");
if(spn) {
   spn.onclick = ()=>{
       document.getElementById("name").value = "Company name";
       document.getElementById("object").value = "sponsorship proposal";
   }
}