const editTitle = document.getElementById("edit-title");
const containerEdit = document.querySelector(".container-edit");
const input = containerEdit.querySelector("#titleID");
const route = window.location.pathname.replace("/","");
const opid = localStorage.getItem("opid");
const message = document.querySelector(".message-alert");
const Title_input = document.getElementById("title-prj");
var Title_input_value = document.getElementById("title-prj").value;
const email_input = document.getElementById("email-prj");
var email_input_value = document.getElementById("email-prj").value;
const Name_input = document.getElementById("yourname-prj");
var Name_input_value = document.getElementById("yourname-prj").value;
const Description_input = document.getElementById("Description-prj");
var Description_input_value = document.getElementById("Description-prj").value;
const currentPassword = document.getElementById("repo-change-current-prj");
const newPassword = document.getElementById("repo-change-new-prj")
var newPassword_value = document.getElementById("repo-change-new-prj").value
const DeleteRepo = document.getElementById("repo-delete-prj");
var Editor = document.getElementById("editor").innerHTML;
const updateForm = (type,value) => {
    fetch("./api/update",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type,value,route,opid })
    })
        .then(res => res.json())
        .then(response => {
            if (response.updated == "deleted") {
                location.href = "/";
            }
            else if (response.updated) {
                message.classList.add("success-bg")
                message.textContent = response.message;
                message.classList.toggle("show")
                setTimeout(() => {
                    message.classList.toggle("show")
                },3500)
                setTimeout(() => {
                    message.classList.remove("success-bg")
                },4000)
            }

            else {
                message.classList.add("danger-bg")
                message.textContent = response.message;
                message.classList.toggle("show")
                setTimeout(() => {
                    message.classList.toggle("show")
                },3500)
                setTimeout(() => {
                    message.classList.remove("danger-bg")
                },4000)
            }

        })
        .catch(err => {
            message.classList.add("danger-bg")
            message.textContent = err;
            message.classList.toggle("show")
            setTimeout(() => {
                message.classList.toggle("show")
                message.classList.remove("danger-bg")
            },3500)
        })
}
const ChangeTitle = () => {
    containerEdit.classList.remove("sh-inp");
    containerEdit.querySelector("span.title").textContent = input.value;
    updateForm("title",input.value)
};
editTitle.onclick = () => {
    containerEdit.classList.add("sh-inp");
    input.focus();
    input.onkeyup = (e) => {
        if (e.keyCode === 13) {
            ChangeTitle();
        }
    };
};
Title_input.onblur = e => {
    if (Title_input_value != e.target.value) {
        Title_input_value = e.target.value;
        containerEdit.querySelector("span.title").textContent = Title_input.value;
        updateForm("Title",Title_input_value)
    }

}
Description_input.onblur = e => {
    if (Description_input_value != e.target.value) {
        Description_input_value = e.target.value;
        updateForm("Description",Description_input_value)
    }

}
Name_input.onblur = e => {
    if (Name_input_value != e.target.value) {
        Name_input_value = e.target.value;
        updateForm("Name",Name_input_value)
    }
}
newPassword.onblur = e => {
    if (currentPassword.value != e.target.value && newPassword_value != e.target.value && newPassword.value != "" && currentPassword.value != "") {
        newPassword_value = e.target.value;
        updateForm("Password",{ currentPassword: currentPassword.value,newPassword: newPassword_value })
    }
}
DeleteRepo.onblur = e => {
    if (e.target.value == document.querySelector("#delete-repo small span").textContent) {
        let fire = confirm("Are you sure ?")
        if (fire) {
            updateForm("Delete",null)
        }
        else {
            e.target.value = ""
        }
    }
}
email_input.onblur = e => {
    if (email_input_value != e.target.value) {
        email_input_value = e.target.value;
        updateForm("email",email_input_value)
    }

}
document.getElementById("save").onclick = () => {
    let Editor_value = document.getElementById("editor").innerHTML;
    if (Editor != Editor_value) {
        Editor = Editor_value;
        updateForm("save",Editor_value);
    }
}
document.addEventListener('keydown',e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        let Editor_value = document.getElementById("editor").innerHTML;
        if (Editor != Editor_value) {
            Editor = Editor_value;
            updateForm("save",Editor_value);
        }
    }
});