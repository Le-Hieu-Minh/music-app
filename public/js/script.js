// APlyaer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  let dataSinger = aplayer.getAttribute("data-singer");
  dataSong = JSON.parse(dataSong);
  dataSinger = JSON.parse(dataSinger);



  const ap = new APlayer({
    container: aplayer, // ID của thẻ div trong file Pug
    fixed: false,
    autoplay: true,
    theme: '#00a8e8',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    lrcType: 1,
    audio: [{
      name: dataSong.title, // Tên bài hát
      artist: dataSinger.fullName, // Tên ca sĩ
      url: dataSong.audio, // Link file audio
      cover: dataSong.avatar, // Link ảnh cover
      lrc: `${dataSong.lyrics}`
    }]
  });
  const avatar = document.querySelector(".inner-avatar img");


  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
  });
  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
  });
  ap.on('ended', function () {
    const like = `/songs/listen/${dataSong._id}`;
    const option = {
      method: "PATCH"
    }
    fetch(like, option)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code == 200) {
          const spanListen = document.querySelector(".singer-detail .inner-listen span");
          spanListen.innerHTML = `${data.listen} lượt nghe`;
          console.log(spanListen);

        }


      })
  });
}
// End APlyaer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");

    const typeLike = isActive ? "dislike" : "like";

    const like = `/songs/like/${typeLike}/${idSong}`;
    const option = {
      method: "PATCH"
    }
    fetch(like, option)
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          const span = buttonLike.querySelector("span");
          span.innerHTML = `${data.like} thích`;
          buttonLike.classList.toggle("active");
        }
      })
  })

}

// End Button Like


// Button Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if (listButtonFavorite) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");

      const typeFavorite = isActive ? "unfavorite" : "favorite";

      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
      const option = {
        method: "PATCH"
      }
      fetch(link, option)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            buttonFavorite.classList.toggle("active");

          }
        })
    })
  });


}

// End Button Favorite

// search suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");

  input.addEventListener("keyup", () => {
    const keyword = input.value;


    const link = `/search/suggest?keyword=${keyword}`;

    fetch(link)
      .then(res => res.json())
      .then(data => {
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
            boxList.innerHTML = html.join("");
          } else {
            boxSuggest.classList.remove("show");
          }

        }
      })
  })
}

// end search suggest