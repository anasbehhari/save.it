const editTitle = document.getElementById("edit-title");
const containerEdit = document.querySelector(".container-edit");
const input = containerEdit.querySelector("input");
const settings_btn = document.getElementById("settings");
const settings = document.querySelector(".settings");
const close_settings = document.getElementById("close");
const main = document.querySelector("main");

/* Function for changing Title */

const ChangeTitle = () => {
  containerEdit.classList.remove("sh-inp");
  input.value = "";
};
/**/
editTitle.onclick = () => {
  containerEdit.classList.add("sh-inp");
  input.value = containerEdit.querySelector("span.title").textContent;
  input.focus();
  input.onblur = ChangeTitle;
  input.onkeyup = (e) => {
    if (e.keyCode === 13) {
      ChangeTitle();
    }
  };
};

settings_btn.onclick = () => {
  main.classList.toggle("filter");
  settings.classList.toggle("active");
};
close_settings.onclick = () => {
  main.classList.toggle("filter");
  settings.classList.toggle("active");
};
