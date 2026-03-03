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