// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

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
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");

  uploadAudioInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const audio = URL.createObjectURL(e.target.files[0]);
      uploadAudioPlay.src = audio;
    }
  });
}
// End Upload Audio

// Generic delete (dùng data-path + data-method)
const deleteButtons = document.querySelectorAll("[button-delete]");
deleteButtons.forEach((buttonDelete) => {
  buttonDelete.addEventListener("click", () => {
    const id = buttonDelete.getAttribute("data-id");
    const path = buttonDelete.getAttribute("data-path");
    const method = buttonDelete.getAttribute("data-method") || "PATCH";

    if (!path || !id) return;
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    fetch(`${path}/${id}`, { method })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          const itemRow = buttonDelete.closest("tr");
          if (itemRow) itemRow.remove();
        }
      })
      .catch(() => {});
  });
});

// Generic change status (dùng data-path)
const statusButtons = document.querySelectorAll("[button-status]");
statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const statusCurrent = button.getAttribute("data-status");
    const path = button.getAttribute("data-path");
    const statusChange = statusCurrent === "active" ? "inactive" : "active";

    if (!path || !id) return;

    fetch(`${path}/${statusChange}/${id}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
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
      .catch(() => {});
  });
});
