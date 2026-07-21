// APlayer + Queue
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  let dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
  let dataQueue = [];
  try {
    dataQueue = JSON.parse(aplayer.getAttribute("data-queue") || "[]");
  } catch (e) {
    dataQueue = [];
  }

  const audioList = [{
    name: dataSong.title,
    artist: dataSinger.fullName || "Unknown",
    url: dataSong.audio,
    cover: dataSong.avatar,
    lrc: `${dataSong.lyrics || ""}`,
    slug: dataSong.slug,
    id: dataSong._id
  }];

  dataQueue.forEach((item) => {
    if (item && item.audio) {
      audioList.push({
        name: item.title,
        artist: item.singerName || "Unknown",
        url: item.audio,
        cover: item.avatar,
        lrc: `${item.lyrics || ""}`,
        slug: item.slug,
        id: item._id
      });
    }
  });

  const ap = new APlayer({
    container: aplayer,
    fixed: false,
    autoplay: true,
    theme: "#00a8e8",
    loop: "all",
    order: "list",
    preload: "auto",
    volume: 0.7,
    lrcType: 1,
    listFolded: false,
    listMaxHeight: 220,
    audio: audioList
  });

  const avatar = document.querySelector(".inner-avatar img");
  const listenedIds = new Set();

  const trackListen = (track) => {
    const id = track && (track.id || (dataSong && dataSong._id));
    if (!id || listenedIds.has(String(id))) return;
    listenedIds.add(String(id));
    fetch(`/songs/listen/${id}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const spanListen = document.querySelector(".singer-detail .inner-listen span");
          if (spanListen && String(id) === String(dataSong._id)) {
            spanListen.innerHTML = `${data.listen} lượt nghe`;
          }
        }
      })
      .catch(() => {});
  };

  ap.on("play", function () {
    if (avatar) {
      avatar.style.animationPlayState = "running";
    }
    const current = ap.list.audios[ap.list.index];
    trackListen(current);
  });

  ap.on("pause", function () {
    if (avatar) {
      avatar.style.animationPlayState = "paused";
    }
  });

  ap.on("ended", function () {
    // APlayer loop:all sẽ tự next; nếu muốn điều hướng trang:
    // giữ trong cùng player để nghe liên tục
  });
}
// End APlayer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");
    const typeLike = isActive ? "dislike" : "like";

    fetch(`/songs/like/${typeLike}/${idSong}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const span = buttonLike.querySelector("span");
          if (span) {
            span.innerHTML = `${data.like} thích`;
          }
          buttonLike.classList.toggle("active");
        } else if (data.code == 401) {
          window.location.href = "/users/login";
        }
      })
      .catch(() => {});
  });
}
// End Button Like

// Button Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if (listButtonFavorite.length > 0) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");
      const typeFavorite = isActive ? "unfavorite" : "favorite";

      fetch(`/songs/favorite/${typeFavorite}/${idSong}`, { method: "PATCH" })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            buttonFavorite.classList.toggle("active");
          } else if (data.code == 401) {
            window.location.href = "/users/login";
          }
        })
        .catch(() => {});
    });
  });
}
// End Button Favorite

// Add to playlist
const formAddPlaylist = document.querySelector("#form-add-playlist");
if (formAddPlaylist) {
  formAddPlaylist.addEventListener("submit", (e) => {
    e.preventDefault();
    const playlistId = formAddPlaylist.querySelector("[name='playlistId']").value;
    const songId = formAddPlaylist.querySelector("[name='songId']").value;
    if (!playlistId) return;

    fetch(`/playlists/${playlistId}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: `songId=${encodeURIComponent(songId)}`
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          alert("Đã thêm vào playlist");
        } else if (data.code == 401) {
          window.location.href = "/users/login";
        } else {
          alert(data.message || "Không thể thêm");
        }
      })
      .catch(() => alert("Có lỗi xảy ra"));
  });
}

// Delete playlist
document.querySelectorAll("[button-delete-playlist]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-id");
    if (!id || !confirm("Xóa playlist này?")) return;
    fetch(`/playlists/delete/${id}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const card = btn.closest(".col-12, .col-md-6, .col-lg-4");
          if (card) card.remove();
        }
      })
      .catch(() => {});
  });
});

// Remove song from playlist
document.querySelectorAll("[button-remove-playlist-song]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const playlistId = btn.getAttribute("data-playlist-id");
    const songId = btn.getAttribute("data-song-id");
    if (!playlistId || !songId) return;
    fetch(`/playlists/${playlistId}/songs/${songId}`, { method: "PATCH" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const item = btn.closest(".col-12, .col-md-6");
          if (item) item.remove();
        }
      })
      .catch(() => {});
  });
});

// Search suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");

  if (input && boxSuggest) {
    input.addEventListener("keyup", () => {
      const keyword = input.value.trim();

      if (!keyword) {
        boxSuggest.classList.remove("show");
        return;
      }

      fetch(`/search/suggest?keyword=${encodeURIComponent(keyword)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            const songs = data.songs;
            if (songs.length > 0) {
              boxSuggest.classList.add("show");
              const html = songs.map((song) => {
                return `
              <a href="/songs/detail/${song.slug}" class="inner-item">
                <div class="inner-image">
                  <img src="${song.avatar}">
                </div>
                <div class="inner-info">
                  <div class="inner-title">${song.title}</div>
                  <div class="inner-singer">
                    <i class="fa-solid fa-microphone-lines"></i>
                    ${song.infoSinger.fullName}
                  </div>
                </div>
              </a>
              `;
              });
              const boxList = boxSuggest.querySelector(".inner-list");
              if (boxList) {
                boxList.innerHTML = html.join("");
              }
            } else {
              boxSuggest.classList.remove("show");
            }
          }
        })
        .catch(() => {});
    });
  }
}
// End search suggest
