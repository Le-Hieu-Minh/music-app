// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector(
    "[upload-image-input]"
  );
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );

  uploadImageInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const image = URL.createObjectURL(e.target.files[0]);
      uploadImagePreview.src = image;
    }
  });
}
// End Upload Image

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector(
    "[upload-audio-input]"
  );
  const uploadAudioPlay = uploadAudio.querySelector(
    "[upload-audio-play]"
  );

  uploadAudioInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const audio = URL.createObjectURL(e.target.files[0]);
      uploadAudioPlay.src = audio;
    }
  });
}
// End Upload Audio

//delete_song
const deleteButton = document.querySelectorAll("[button-delete]");
deleteButton.forEach(buttonDelete => {
  buttonDelete.addEventListener("click", () => {
    const idSong = buttonDelete.getAttribute("data-id");
    const url = `/admin/songs/delete/${idSong}`;
    const option = {
      method: "PATCH"
    }
    fetch(url, option)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const itemRow = buttonDelete.closest("tr");
          itemRow.remove();

        }

      })


  })
});
//end delete_song

//changeStatus_song
const buttonChangeStatus = document.querySelectorAll("[button-status]");
buttonChangeStatus.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const statusCurrent = button.getAttribute("data-status");
    const statusChange = statusCurrent === "active" ? "inactive" : "active";
    const url = `/admin/songs/changeStatus/${statusChange}/${id}`;

    fetch(url, { method: "PATCH" })
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          button.setAttribute("data-status", statusChange);
          if (statusChange === "active") {
            button.innerHTML = "Hoạt động";
            button.classList.remove("badge-danger");
            button.classList.add("badge-success");
          } else {
            button.innerHTML = "Dừng hoạt động";
            button.classList.remove("badge-success");
            button.classList.add("badge-danger");
          }
        }
      })
  })
})

//end changeStatus_song

//delete_singer
const deleteButtonSinger = document.querySelectorAll("[button-delete]");
deleteButtonSinger.forEach(buttonDelete => {
  buttonDelete.addEventListener("click", () => {
    const idTopic = buttonDelete.getAttribute("data-id");
    const url = `/admin/singers/delete/${idTopic}`;
    const option = {
      method: "DELETE"
    }
    fetch(url, option)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const itemRow = buttonDelete.closest("tr");
          itemRow.remove();

        }

      })
  })
});
//end delete_singer

//changeStatus_singer
const buttonChangeStatusSinger = document.querySelectorAll("[button-status]");
buttonChangeStatusSinger.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const statusCurrent = button.getAttribute("data-status");
    const statusChange = statusCurrent === "active" ? "inactive" : "active";
    const url = `/admin/singers/changeStatus/${statusChange}/${id}`;

    fetch(url, { method: "PATCH" })
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          button.setAttribute("data-status", statusChange);
          if (statusChange === "active") {
            button.innerHTML = "Hoạt động";
            button.classList.remove("badge-danger");
            button.classList.add("badge-success");
          } else {
            button.innerHTML = "Dừng hoạt động";
            button.classList.remove("badge-success");
            button.classList.add("badge-danger");
          }
        }
      })
  })
})

//end changeStatus_singer



//delete_topic
const deleteButtonTopic = document.querySelectorAll("[button-delete]");
deleteButtonTopic.forEach(buttonDelete => {
  buttonDelete.addEventListener("click", () => {
    const idTopic = buttonDelete.getAttribute("data-id");
    const url = `/admin/topics/delete/${idTopic}`;
    const option = {
      method: "DELETE"
    }
    fetch(url, option)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const itemRow = buttonDelete.closest("tr");
          itemRow.remove();

        }

      })
  })
});
//end delete_topic

//changeStatus_topic
const buttonChangeStatusTopic = document.querySelectorAll("[button-status]");
buttonChangeStatusTopic.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const statusCurrent = button.getAttribute("data-status");
    const statusChange = statusCurrent === "active" ? "inactive" : "active";
    const url = `/admin/topics/changeStatus/${statusChange}/${id}`;

    fetch(url, { method: "PATCH" })
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          button.setAttribute("data-status", statusChange);
          if (statusChange === "active") {
            button.innerHTML = "Hoạt động";
            button.classList.remove("badge-danger");
            button.classList.add("badge-success");
          } else {
            button.innerHTML = "Dừng hoạt động";
            button.classList.remove("badge-success");
            button.classList.add("badge-danger");
          }
        }
      })
  })
})

//end changeStatus_topic

//delete Role
const deleteButtonRole = document.querySelectorAll("[button-delete]");
deleteButtonRole.forEach(buttonDelete => {
  buttonDelete.addEventListener("click", () => {
    const idRole = buttonDelete.getAttribute("data-id");
    const url = `/admin/roles/delete/${idRole}`;
    const option = {
      method: "PATCH"
    }
    fetch(url, option)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const itemRow = buttonDelete.closest("tr");
          itemRow.remove();

        }

      })
  })
});

//end delete Role