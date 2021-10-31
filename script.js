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
let autoplay = false;
let eventNow = 0;
let btn = document.createElement("button");
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
    setTimeout(() => {
      update(myObj, eventNow);
      addLog(myObj, eventNow);
      const next = document.querySelector(".next");
      next.addEventListener("click", () => {
        let dialog = myObj[eventNow];
        clear();
        let choice = captureLink(dialog.text);
        console.log(captureLink(dialog.text));
        eventNext(myObj, choice.target);
        addLog(myObj, eventNow);
      });
      introBox.addEventListener("click", () => {
        clear();
        // console.log(myObj[eventNow].title);
        eventNext(myObj);
        addLog(myObj, eventNow);
      });
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
    }, 5000);
  }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();

// console.log(myObj[0].char);
function update(dialog, i) {
  // dialog();
  displayChar(dialog[i].display);
  talk(dialog[i].char);
  person.innerText = dialog[i].char;
  let text = document.createElement("p");
  text.classList.add("play");
  text.innerText = dialog[i].text;
  text.append(btn);
  textBox.append(text);
  // textBox.classList.add("play");

  if (dialog[i].event) {
    eventShow.classList.add("show");
    eventBox.classList.add("show");
    let options = dialog[i].options;
    for (let i = 0; i < options.length; i++) {
      let option = document.createElement("button");
      option.innerText = options[i];
      option.classList.add("btn-event");
      eventBox.append(option);
    }
    // console.log(dialog[i].options);
  }
  if (dialog[i].type != "intro") {
    content();
  } else {
    prolog();
    let prologText = document.createElement("p");
    prologText.innerText = dialog[i].text;
    intro.append(prologText);
  }
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
  } else {
    eventNow += 1;
    if (eventNow > dialog.length - 1) {
      eventNow = dialog.length - 1;
    }
  }
  update(dialog, eventNow);
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
  intro.innerHTML = "";
  charBox.innerHTML = "";
  textBox.innerHTML = "";
  // textBox.classList.remove("play");
  eventBox.innerHTML = "";
  eventBox.classList.remove("show");
  eventShow.classList.remove("show");
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
function addLog(dialog, history) {
  let div = document.createElement("div");
  let logPerson = document.createElement("p");
  let logText = document.createElement("p");

  for (let x = 0; x <= history; x++) {
    logPerson.innerText = dialog[x].char;
    div.append(logPerson);
    // logBox.append(div);
    logText.innerText = dialog[x].text;
    div.append(logText);
    logBox.append(div);
  }
  // console.log(history);
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
  charBox.classList.add("hidden");
  dialogBox.classList.add("hidden");
}
function content() {
  introBox.classList.remove("show");
  charBox.classList.remove("hidden");
  dialogBox.classList.remove("hidden");
}

bgm.volume = 0.2;
