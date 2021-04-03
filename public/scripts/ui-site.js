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
  containerEdit.querySelector("span.title").textContent = input.value;
};
/**/
editTitle.onclick = () => {
  containerEdit.classList.add("sh-inp");
  input.focus();
  input.onblur = ChangeTitle;
  input.onkeyup = (e) => {
    if (e.keyCode === 13) {
      ChangeTitle();
    }
  };
};

settings_btn.onclick = () => {
  main.classList.toggle("br-50");
  settings.classList.toggle("active");
};
close_settings.onclick = () => {
  main.classList.toggle("br-50");
  settings.classList.toggle("active");
};

//editor

DecoupledEditor.create(document.querySelector("#editor"))
  .then((editor) => {
    const toolbarContainer = document.querySelector("#toolbar-container");

    toolbarContainer.appendChild(editor.ui.view.toolbar.element);
  })
  .catch((error) => {
    console.error(error);
  });

