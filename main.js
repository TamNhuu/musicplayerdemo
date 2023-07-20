const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "nickki";

const cd = $(".cd");
const heading = $("header h1");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: '"906090"',
      singer: "TÓC TIÊN",
      path: "./asset/music/906090.mp3",
      image: "./asset/img/906090.jpg",
    },
    {
      name: 'ÁNH SAO VÀ BẦU TRỜI',
      singer: "T.R.I x CÁ",
      path: "./asset/music/anhsaovabautroi.mp3",
      image: "./asset/img/anhsaovabautroi.jpg",
    },
    {
      name: "CÔ ẤY CỦA ANH ẤY",
      singer: "BẢO ANH",
      path: "./asset/music/coaycuaanhay.mp3",
      image: "./asset/img/coaycuaanhay.jpg",
    },
    {
      name: "CÔ ĐƠN TRÊN SOFA",
      singer: "HỒ NGỌC HÀ",
      path: "./asset/music/codontrensofa.mp3",
      image: "./asset/img/codontrensofa.jpg",
    },
    {
      name: "ĐỐT",
      singer: "VĂN MAI HƯƠNG",
      path: "./asset/music/dot.mp3",
      image: "./asset/img/dot.jpg",
    },
    {
      name: "LIKE THIS LIKE THAT",
      singer: "TÓC TIÊN x TLINH",
      path: "./asset/music/likethislikethat.mp3",
      image: "./asset/img/likethislikethat.jpg",
    },
    {
      name: "MỘT NGÀN NỖI ĐAU",
      singer: "VĂN MAI HƯƠNG",
      path: "./asset/music/motngannoidau.mp3",
      image: "./asset/img/motngannoidau.jpg",
    },
    {
      name: "MƯA THÁNG SÁU",
      singer: "VĂN MAI HƯƠNG",
      path: "./asset/music/muathangsau.mp3",
      image: "./asset/img/muathangsau.jpg",
    },
    {
      name: "SHH! CHỈ TA BIẾT THÔI",
      singer: "CHIPU",
      path: "./asset/music/shh!chitabietthoi.mp3",
      image: "./asset/img/shh!chitabietthoi.jpg",
    },
    {
      name: "THIÊU THÂN",
      singer: "B RAY x SOFIA & CHÂU ĐĂNG KHOA",
      path: "./asset/music/thieuthan.mp3",
      image: "./asset/img/thieuthan.jpg",
    },
    {
      name: "TỪNG LÀ CỦA NHAU",
      singer: "BẢO ANH",
      path: "./asset/music/tunglacuanhau.mp3",
      image: "./asset/img/tunglacuanhau.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index ="${index}">
      <div
        class="thumb"
        style="
          background-image: url('${song.image}');
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`;
    });
    playlist.innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    // Xử lý CD quay - dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // onscroll - Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // onclick - Xử lý play
    playBtn.onclick = function () {
      app.isPlaying ? audio.pause() : audio.play();
    };

    //audio play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //audio pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //audio timeupdate
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //audio seek
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // audio ended
    audio.onended = function () {
      app.isRepeat ? audio.play() : nextBtn.click();
    };

    //next song
    nextBtn.onclick = function () {
      app.isRandom ? app.playRandomSong() : app.nextSong();
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    //previous song
    prevBtn.onclick = function () {
      app.isRandom ? app.playRandomSong() : app.prevSong();
      audio.play();
      app.render();
    };

    //random song
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // repeat song
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    //click song in playlist
    playlist.onclick = function (e) {
      const song = e.target.closest(".song:not(.active)");
      const option = e.target.closest(".option");
      if (song || option) {
        // Click song
        if (song) {
          app.currentIndex = Number(song.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
        }
        // Click option
        if (option) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(
      () =>
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      300
    );
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ cònig vào ứng dụng
    this.loadConfig();

    // Định nghĩa thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bà hát đầu tiên vào UI
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Display first status after refresh
    randomBtn.classList.toggle("active", app.isRandom);
    repeatBtn.classList.toggle("active", app.isRepeat);

  },
};
app.start();

//fix bug update khi seek
