if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/scripts/service-worker.js")
    .then(console.log("service worker registerd !"))
    .catch((err) => console.log(err));
}

//loader
var ldr = document.querySelector(".loader");
window.onload = () => {
  ldr.style.opacity = "0";
  setTimeout(() => ldr.classList.add("stop"), 500);
};
