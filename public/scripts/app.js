if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/scripts/service-worker.js")
    .then(console.log("swrk registerd !"))
    .catch((err) => console.log(err));
}
function Decode(params) {
  var parser = new DOMParser().parseFromString(params,"text/html");
  return parser.documentElement.textContent
}
//loader
var ldr = document.querySelector(".loader");
window.onload = () => {
  ldr.style.opacity = "0";
  setTimeout(() => ldr.classList.add("stop"),500);
};


const settings_btn = document.getElementById("settings");
const settings = document.querySelector(".settings");
const close_settings = document.getElementById("close");
const main = document.querySelector("main");
if (settings_btn) {
  settings_btn.onclick = () => {
    main.classList.toggle("br-50");
    settings.classList.toggle("active");
  };
}

if (close_settings) {
  close_settings.onclick = () => {
    main.classList.toggle("br-50");
    settings.classList.toggle("active");
  };
}
const vis = document.querySelector(".visibilty");
if (vis) {
  vis.onclick = () => {

    if (vis.textContent == "show") {
      document.getElementById("repo-change-current-prj").setAttribute("type","text")
      document.getElementById("repo-change-new-prj").setAttribute("type","text")
      vis.innerHTML = "hide"
    }
    else {
      document.getElementById("repo-change-current-prj").setAttribute("type","password")
      document.getElementById("repo-change-new-prj").setAttribute("type","password")
      vis.innerHTML = "show"

    }
  }
}

//editor


if (typeof DecoupledEditor != "undefined") {
  DecoupledEditor.create(document.querySelector("#editor"))
    .then((editor) => {
      fetch("./api/content",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route,opid })
      })
        .then(res => res.json())
        .then(Data => {
          if(Data.data!=""){
            editor.setData(Data.data);
          }
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        })
        .catch(err => {
          console.error(error);
        })
    })
    .catch((error) => {
      console.error(error);
    });
}
console.log();



