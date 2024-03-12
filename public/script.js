//! LOCAL STORAGE BACKUP
// [{"Username":"dan","Highscore":14},{"Username":"juju","Highscore":7},{"Username":"sopil","Highscore":8},{"Username":"hassoun","Highscore":4},{"Username":"offat","Highscore":6},{"Username":"ren","Highscore":8},{"Username":"ryan","Highscore":10},{"Username":"joudy","Highscore":12},{"Username":"reabal","Highscore":16},{"Username":"roudi","Highscore":8},{"Username":"jawad","Highscore":8}]
let sequence = [];
let userSequence = [];
let users = [];
let taps = ["tap1", "tap2", "tap3", "tap4"];
let tempTap;
let tapId;
let level = 1;
let win;
let winMessage = "you won";
let loseMessage = "you lose";
let shadowColor;
let userRegister = document.querySelector(".register-user");
let playerRegister = document.querySelector(".returning-player");
let gameCont = document.querySelector(".centerGame");
let highscores = document.querySelector(".highscores");
let profile = document.querySelector(".profile_user");
let gamcontainer = document.querySelector(".game_container");
let userdiv = document.querySelector(".userdiv");
let userSub = document.querySelector(".buttonSub");
let userSubRet = document.querySelector(".buttonSubRet");
let usernameInput = document.querySelector(".input");
let usernameInputRet = document.querySelector(".input-ret");
let highscoresdiv = document.querySelector(".highscores-table");
let highscoresbigdiv = document.querySelector(".highscores-div");
let username = localStorage.getItem("username");
let newUser;
let userAE = document.querySelector(".userAExist");
let userDE = document.querySelector(".userDExist");
let remainingTime;
let interval;
let left = document.querySelector(".left");
let winLose = document.querySelector(".winLose");
let winsound = document.getElementById("winsound");
let losesound = document.getElementById("losesound");

firstDisplay();
function startButton() {
  level = 1;
  displayLevel();
  sequence = [];
  userSequence = [];

  function startGame() {
    remainingTime = 1000 * level + 1000;
    interval = 1000;
    startNewLevel();

    function updateTimer() {
      showRemainingTime();
      remainingTime -= interval;
      // if (sequence.length == userSequence.length) {
      //     remainingTime = 0

      if (remainingTime <= 0) {
        clearInterval(timer);
        checkMemory();
        if (win === true) {
          // console.log(winMessage)
          showYouWin();
          winsound.play();
          level++;
          userSequence = [];
          displayLevel();
          // updateLocalStorage(users)
          updateHighscore(localStorage.getItem("username"));
          startGame();
        } else if (win === false) {
          level = 1;
          losesound.play();
          hideRemainingTime();
          displayLevel();
          showHscores();
          // console.log(loseMessage)
          showYouLose();
        }
      }
    }
    let timer = setInterval(updateTimer, interval);
  }
  startGame();
}

function showYouWin() {
  winLose.innerHTML = ``;
  winLose.innerHTML = `
    <p class="uwin">You Win!&#x1F31E</p>
    `;
  setTimeout(() => {
    winLose.innerHTML = `
        <p class="wldummy text-gray-200">You Win!</p>
        `;
  }, 1000);
}
function showYouLose() {
  winLose.innerHTML = ``;
  winLose.innerHTML = `
    <p class="ulose">You Lose!&#x1F47B</p>
    `;
  setTimeout(() => {
    winLose.innerHTML = `
        <p class="wldummy text-gray-200">You Win!</p>
        `;
  }, 1000);
}

function showRemainingTime() {
  left.innerHTML = ``;
  left.innerHTML = `
    <p class="timer">time left: ${remainingTime / 1000 - 1}</p>
    `;
}
function hideRemainingTime() {
  left.innerHTML = ``;
}

async function updateHighscore(username) {
  users = await getUsers();
  let user = users.find((user) => user.Username === username);
  if (user.Highscore < level) {
    user.Highscore = level - 1;
    console.log("Updated user:", user); // Add this line for debugging

    localStorage.setItem("userArray", JSON.stringify(users));

    console.log("Users after update:", localStorage.getItem("userArray")); // Add this line for debugging
  }
}
function showHscores() {
  users = getUsers();
  users.sort((a, b) => b.Highscore - a.Highscore);
  highscoresdiv.innerHTML = ``;
  users.forEach((user) => {
    highscoresdiv.innerHTML += `
            <div class="indHS m-3">
            <p class="p" ${(onclick = handleUserClick(user.username))}>${
      user.Username
    } ${user.Highscore}</p>
            </div>
            `;
  });
  highscoresbigdiv.style.display = "block";
  highscoresdiv.style.display = "flex";
  highscores.style.display = "block";
}
function handleUserClick(username) {}
// gets users from local storage
function getUsers() {
  let storedData = localStorage.getItem("userArray");
  return storedData ? JSON.parse(storedData) : [];
}
function addUser() {
  users = getUsers();
  let userInp = usernameInput.value;
  let userExists = users.find((user) => user.Username === userInp);
  if (!userExists) {
    newUser = {
      Username: localStorage.getItem("username"),
      Highscore: level - 1,
    };
    users.push(newUser);
    localStorage.setItem("userArray", JSON.stringify(users));
    return true;
  } else if (userExists) {
    userAE.style.display = "inline";
    console.log("user already exists.");
    usernameInput.value = "";
    return false;
  }
}
// Enter submition (click or Enter key)
userSub.addEventListener("click", displayUser);
usernameInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.getElementById("submit").click();
  }
});
userSubRet.addEventListener("click", addUserRet);
usernameInputRet.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.getElementById("submitRet").click();
  }
});
// Stores username in storage and shows it on screen
function displayUser() {
  localStorage.setItem("username", usernameInput.value);
  if (addUser()) {
    addUser();
    userdivHTML();
    hideUser();
    hidePlayer();
    showBG();
    showHscores();
    userAE.style.display = "none";
  }
}
function addUserRet() {
  users = getUsers();
  let userInput = usernameInputRet.value;
  console.log("Input username:", userInput);
  let existingUser = users.find((user) => user.Username === userInput);
  if (existingUser) {
    localStorage.setItem("username", usernameInputRet.value);
    console.log("User found. Setting username in local storage.");
    userdivHTML();
    hidePlayer();
    showHscores();
    hidePlayer();
    hideUser();
    showBG();
    userDE.style.display = "none";
  } else {
    console.log("User not found. Logging users for debugging:");
    userDE.style.display = "inline";
  }
}

// Executed first thing on page load
function firstDisplay() {
  if (
    !localStorage.getItem("username") ||
    localStorage.getItem("username") === "Sign up"
  ) {
    localStorage.setItem("username", "Sign up");
    highscoresbigdiv.style.display = "none";
    userdivHTML();
  } else if (localStorage.getItem("username")) {
    userdivHTML();
    showHscores();
  }
}

function userdivHTML() {
  userdiv.innerHTML = ``;
  userdiv.innerHTML += `<p class="users">${localStorage.getItem(
    "username"
  )}</p>`;
  // Clear username input
  usernameInput.value = "";
  usernameInputRet.value = "";
}
profile.addEventListener("click", showOrhide);
// Register User
function showOrhide() {
  if (getComputedStyle(userRegister).display === "none") {
    showUser();
  } else if (getComputedStyle(userRegister).display !== "none") {
    hideUser();
  }
}
document
  .querySelector(".retplayer")
  .addEventListener("click", showPlayer, hideUser);
document
  .querySelector(".newplayer")
  .addEventListener("click", hidePlayer, showUser);

function showUser() {
  userRegister.style.display = "flex";
  hideBG();
  document.getElementById("username").focus();
}
function hideUser() {
  userRegister.style.display = "none";
  userAE.style.display = "none";
}
// Returning User
function showPlayer() {
  playerRegister.style.display = "flex";
  document.getElementById("usernameret").focus();
}
function hidePlayer() {
  playerRegister.style.display = "none";
  userDE.style.display = "none";
}

function hideBG() {
  gameCont.style.display = "none";
  highscoresbigdiv.style.display = "none";
  highscores.style.display = "none";
}
function showBG() {
  gameCont.style.display = "flex";
  highscoresbigdiv.style.display = "block";
  highscores.style.display = "flex";
}
function hideBoth() {
  hideUser();
  hidePlayer();
  showBG();
}

function startNewLevel() {
  generateRandomTap();
  tempTap = sequence[sequence.length - 1];
  showTap(tempTap);
}
function displayLevel() {
  levelHTML = `
    <p class="level text-3xl">LEVEL ${level}</p>
    `;
  levelDiv = document.getElementById("level-div");
  levelDiv.innerHTML = ``;
  levelDiv.innerHTML += levelHTML;
  let levelp = document.querySelector(".level");
  levelp.style.color = "black";
}

function checkMemory() {
  if (sequence.length == userSequence.length) {
    for (i = 0; i < sequence.length; i++) {
      if (sequence[i] !== userSequence[i]) {
        win = false;
        break;
      } else if (sequence[i] === userSequence[i]) {
        win = true;
      }
    }
  } else win = false;
}

function generateRandomTap() {
  // Generate random tap index
  function getRandomClass() {
    let randomIndex = Math.floor(Math.random() * taps.length);
    return taps[randomIndex];
  }
  // push generated tap index to main sequence
  let randomTap = getRandomClass();
  sequence.push(randomTap);
}

// Show style on tap that was pushed to the user
function showTap(tempTap) {
  let tapClass = document.getElementById(tempTap);
  // let shadowColor = document.querySelector('.tap2').style.backgroundColor;
  // let shadowColor = window.getComputedStyle(document.querySelector('.tap2')).backgroundColor;
  shadowColor = window.getComputedStyle(
    document.querySelector(`.${tempTap}`)
  ).backgroundColor;

  tapClass.style.boxShadow = `1px 1px 50px 8px ${shadowColor}`;
  setTimeout(() => {
    tapClass.style.boxShadow = "unset";
  }, 1000);
}
// console.log(tempTap, level);

// Function to handle the click event
function handleClick(event) {
  // Get the ID of the clicked element
  tapId = event.target.id;
  // push user tap to userseq
  userSequence.push(tapId);
  console.log(userSequence);
  playSound();
}
function playSound() {
  if (tapId === "tap1") aud1.play();
  else if (tapId === "tap2") aud2.play();
  else if (tapId === "tap3") aud3.play();
  else if (tapId === "tap4") aud4.play();
}

let tap1 = document.getElementById("tap1");
let tap2 = document.getElementById("tap2");
let tap3 = document.getElementById("tap3");
let tap4 = document.getElementById("tap4");

let aud1 = document.getElementById("aud1");
let aud2 = document.getElementById("aud2");
let aud3 = document.getElementById("aud3");
let aud4 = document.getElementById("aud4");
// Add event listeners to each element
tap1.addEventListener("click", handleClick);
tap2.addEventListener("click", handleClick);
tap3.addEventListener("click", handleClick);
tap4.addEventListener("click", handleClick);
