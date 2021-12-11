const xmlhttp = new XMLHttpRequest();
const bgm = document.querySelector(".bgm");
const textBox = document.querySelector(".text");
const person = document.querySelector(".person");
const eventShow = document.querySelector(".event");
const eventBox = document.querySelector(".event-box");
const btnAuto = document.querySelector(".btn-auto");
const logBox = document.querySelector(".log-box");
const btnLog = document.querySelector(".btn-log");
const charBox = document.querySelector(".char-box");
const introBox = document.querySelector(".intro-box");
const dialogBox = document.querySelector(".dialog-box");
const intro = document.querySelector(".intro");
const videoBox = document.querySelector(".video-box");
const video = document.querySelector(".video");
let autoplay = false;
let eventNow = 0;
let btn = document.createElement("button");
let progresJSON = JSON.parse(localStorage.getItem("progresJSON"));
let player = JSON.parse(localStorage.getItem("playerJSON")).player;
btn.innerText = "Next";
btn.className = "next";

const gambar = {
  kazuma: "./src/kazuma.png",
  aqua: "./src/aqua.png",
  megumin: "./src/Megumin.png",
  darkness: "./src/Darkness.png",
};

// function utama
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const myObj = JSON.parse(this.responseText);
    // start game
    // console.log(eventNow);
    setTimeout(() => {
      //console.log(player);
      // mengupdate tampilan layar
      cekProgres(myObj, progresJSON, player);
      // update(myObj, eventNow);
      // addLog(myObj, eventNow);

      btnLog.addEventListener("click", () => {
        btnLog.classList.toggle("active");
        logBox.classList.toggle("show");
      });
      btnAuto.addEventListener("click", () => {
        btnAuto.classList.toggle("active");

        if (autoplay) {
          autoplay = false;
        } else {
          autoplay = true;
        }
      });
      //  fungsi auto play
      setInterval(() => {
        if (autoplay) {
          if (eventNow >= myObj.length - 1) {
            autoplay = false;
          } else {
            clear();
            eventNext(myObj);
            addLog(myObj, eventNow);
          }
        }
      }, 2000);
    }, 0);
  }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();

function update(dialog, i) {
  // mengecek jenis dialog
  // console.log("0");
  if (dialog[i].type === "text") {
    // tampilkan text
    displayText(dialog, i);
    content();
    // console.log("text");
  } else if (dialog[i].type === "intro") {
    // jika dialog intro
    displayIntro(dialog, i);
  } else if (dialog[i].type === "video") {
    // jika dialog video
    content();
    displayVideo(dialog, i);
  } else if (dialog[i].type === "event") {
    // jika dialog event
    content();
    displayEvent(dialog, i);
    // console.log("4");
  }
  addLog(dialog, eventNow);
  if (dialog[i].save != null) {
    let saveData = captureLink(dialog[i].save);
    // console.log(saveData.target + "," + player + "," + dialog[i].title);
    if (saveData.target == "gallery") {
      savedData(
        saveData.target,
        dialog[i].title,
        dialog[i].video,
        dialog[i].img
      );
      // console.log(
      //   saveData.target + "," + dialog[i].title + "," + dialog[i].video
      // );
    } else if (saveData.target == "progress") {
      savedData(saveData.target, player, dialog[i].title, player);
    }
  }
  // console.log(i);
}
// tampilkan text
function displayText(dialog, i) {
  charBox.classList.add("show");
  dialogBox.classList.add("show");
  displayChar(dialog[i].display);
  talk(dialog[i].char);
  let choice = captureLink(dialog[i].text);
  person.innerText = dialog[i].char;
  let text = document.createElement("p");
  text.classList.add("play");
  text.innerText = choice.text;
  text.append(btn);
  textBox.append(text);
  const next = document.querySelector(".next");
  // console.log("1");
  next.addEventListener("click", () => {
    clear();
    eventNext(dialog, choice.target);
    // console.log("2");
  });
}
// tampilkan intro
function displayIntro(dialog, i) {
  prolog();
  let prologText = document.createElement("p");
  let choice = captureLink(dialog[i].text);
  prologText.innerText = choice.text;
  intro.append(prologText);
  introBox.addEventListener("click", () => {
    clear();
    // console.log(myObj[eventNow].title);
    eventNext(dialog, choice.target);
    // addLog(dialog, eventNow);
  });
}
// tampilkan event
function displayEvent(dialog, i) {
  displayChar(dialog[i].display);
  talk(dialog[i].char);
  let options = dialog[i].options;
  eventShow.classList.add("show");
  eventBox.classList.add("show");
  for (let i = 0; i < options.length; i++) {
    let choice = captureLink(options[i]);
    let option = document.createElement("button");
    option.innerText = choice.text;
    option.classList.add("btn-event");
    option.addEventListener("click", () => {
      clear();
      eventNext(dialog, choice.target);
    });
    // addLog(dialog, eventNow);
    eventBox.append(option);
  }
}
// tampilkan video
function displayVideo(dialog, i) {
  videoBox.classList.add("show");
  video.src = dialog[i].video;

  // console.log(video);
  // let choice = captureLink(dialog[i].text);
  video.addEventListener("ended", () => {
    if (dialog[i].title === "ed") {
      window.location.replace("./index.html");
    } else {
      video.src = "#";
      let choice = captureLink(dialog[i].text);
      clear();
      eventNext(dialog, choice.target);
    }
  });
  videoBox.addEventListener("click", () => {
    if (dialog[i].title === "ed") {
      window.location.replace("./index.html");
    } else {
      video.src = "#";
      let choice = captureLink(dialog[i].text);
      clear();
      eventNext(dialog, choice.target);
    }
  });
}

function talk(char) {
  let talkChar = document.getElementById(char);
  talkChar.classList.add("talk");
}

// menampilkan adegan selanjutnya
function eventNext(dialog, target) {
  if (target != null) {
    let idTarget = findWithAttr(dialog, "title", target);
    eventNow = idTarget;
    if (eventNow > dialog.length - 1) {
      eventNow = dialog.length - 1;
    }
    //console.log("3");
  } else {
    eventNow += 1;
    if (eventNow > dialog.length - 1) {
      eventNow = dialog.length - 1;
    }
  }
  update(dialog, eventNow);
  // console.log(eventNow);
}
// mengambil link di teks
function captureLink(text) {
  let choice = { target: "", text: "" };
  let data = text.split("|");
  choice.text = data[0];
  if (data.length > 1) {
    choice.target = data[1].trim().toLowerCase();
  }
  return choice;
}
// menemukan id target
function findWithAttr(array, attr, value) {
  for (let i = 0; i < array.length; i++) {
    // console.log(value);
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
// mereset tampilan layar
function clear() {
  // content();
  intro.innerHTML = "";
  charBox.innerHTML = "";
  textBox.innerHTML = "";
  eventBox.innerHTML = "";
  logBox.innerHTML = "";
  charBox.classList.remove("show");
  dialogBox.classList.remove("show");
  eventBox.classList.remove("show");
  eventShow.classList.remove("show");
  videoBox.classList.remove("show");
  video.src = "#";
  let charList = document.querySelectorAll(".char");
  for (let i = 0; i < charList.length; i++) {
    charList[i].classList.remove("talk");
  }
}
logBox.addEventListener("click", () => {
  if (logBox.classList.contains("show")) {
    logBox.classList.remove("show");
    btnLog.classList.remove("active");
  }
});
function addLog(dialog, i) {
  for (let x = 0; x < i; x++) {
    let div = document.createElement("div");
    let logPerson = document.createElement("p");
    let logText = document.createElement("p");

    let dataLog = { char: "", text: "" };
    if (dialog[x].type != "video") {
      let textLog = captureLink(dialog[x].text);
      if (dialog[x].char != null) {
        dataLog.char = dialog[x].char;
      } else {
        dataLog.char = "";
      }
      dataLog.text = textLog.text;
      logPerson.innerText = dataLog.char;
      logText.innerText = dataLog.text;
      div.append(logPerson);
      div.append(logText);
      logBox.append(div);
    }
  }

  //console.log(logBox);
}
function displayChar(variabel) {
  if (Array.isArray(variabel)) {
    // console.log(variabel);
    const charList = [];
    for (let i = 0; i < variabel.length; i++) {
      let charDiv = document.createElement("div");
      charDiv.classList.add("char");
      let charImg = document.createElement("img");
      charImg.src = gambar[variabel[i]];
      charDiv.append(charImg);
      charDiv.id = variabel[i];
      // charBox.append(charDiv);
      charList.push(charDiv);
    }
    // console.log(charList);
    charList.forEach((row) => {
      charBox.append(row);
      // console.log(row);
    });
  } else {
    let charDiv = document.createElement("div");
    charDiv.classList.add("char");
    let charImg = document.createElement("img");
    charImg.src = gambar[variabel];
    charDiv.append(charImg);
    charDiv.id = variabel;
    charBox.append(charDiv);
    // console.log(variabel);
    // console.log("img: " + gambar[variabel]);
  }
}
function prolog() {
  introBox.classList.add("show");
}
function content() {
  introBox.classList.remove("show");
}
function savedData(savedata, name, data, img) {
  if (savedata == "progres") {
    let progres = {
      name: name,
      progres: data,
      time: "00:00:00",
    };
    let dataProgres = [];

    let savedProgres = JSON.parse(localStorage.getItem("progresJSON"));

    if (savedProgres != null) {
      let i = 0;
      for (let x = 0; x < savedProgres.length; x++) {
        if (savedProgres[x].name == name) {
          dataProgres.push(progres);
        } else {
          dataProgres.push(savedProgres[x]);
        }
      }

      let newdata = JSON.stringify(dataProgres);
      console.log(newdata);
      localStorage.setItem("progresJSON", newdata);
    } else {
      let Progres = [];
      Progres.push(progres);
      let newdata = JSON.stringify(Progres);
      localStorage.setItem("progresJSON", newdata);
    }
  } else if (savedata == "gallery") {
    let gallery = {
      title: name,
      link: data,
      img: img,
    };
    let dataGallery = [];
    let savedGallery = JSON.parse(localStorage.getItem("galleryJSON"));

    if (savedGallery != null) {
      for (let x = 0; x < savedGallery.length; x++) {
        dataGallery.push(savedGallery[x]);
      }
      let i = findWithAttr(savedGallery, "title", name);
      if (i < 0) {
        dataGallery.push(gallery);
      }
      let newdata = JSON.stringify(dataGallery);
      console.log(newdata);
      localStorage.setItem("galleryJSON", newdata);
    } else {
      let Gallery = [];
      Gallery.push(gallery);
      let newdata = JSON.stringify(Gallery);
      localStorage.setItem("galleryJSON", newdata);
    }
  }
}
function clearData() {
  localStorage.clear("galleryJSON");
  localStorage.clear("testJSON");
}

function cekProgres(dialog, array, user) {
  let id = findWithAttr(array, "name", user);
  if (id > -1) {
    // eventNow = id;
    //console.log(progresJSON[id].progres);
    eventNext(dialog, progresJSON[id].progres);
  } else {
    eventNow = 0;
    update(dialog, eventNow);
  }
}
bgm.volume = 0.2;
