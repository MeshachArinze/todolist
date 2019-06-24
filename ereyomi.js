document.addEventListener("DOMContentLoaded", function() {
  let addBtn = document.querySelector(".addBtn"),
    table = document.querySelector(".myTable");

  addBtn.addEventListener("click", function() {
    console.log("add btn clicked");
    let time = document.querySelector(".time").value,
      task = document.querySelector(".task").value;
    if ((time == null && task == null) || (time == "" && task == "")) {
      alert("All inputs are empty...Please inout a task and time");
    } else if (task == null || task == "") {
      alert("The task input cannot be empty");
    } else if (time == null || time == "") {
      alert("please specify the time");
    } else {
      // time format am-pm

      let timesplit = time.split(":");
      let hours, minutes, meridian;
      hours = timesplit[0];
      minutes = timesplit[1];
      if (hours > 12) {
        meridian = "PM";
        hours -= 12;
      } else if (hours < 12) {
        meridian = "AM";
        if (hours == 0) {
          hours = 12;
        } else {
          meridian = "PM";
        }
      }

      let listRow = document.createElement("div");
      listRow.setAttribute("class", "listRow");
      let div1 = document.createElement("div");
      div1.setAttribute("class", "todo");
      //div1 = document.createTextNode(time);
      div1.innerHTML = `<span> ${hours}:${minutes} ${meridian} | ${task}<span>`;
      listRow.appendChild(div1);
      div3 = document.createElement("div");
      div3.setAttribute("class", "close");
      div3.innerHTML = "&times;";
      listRow.appendChild(div3);
      table.appendChild(listRow);
    }
  });

  table.addEventListener("click", function(event) {
    event.preventDefault();
    const parent = event.target.parentElement;
    if (event.target.className == "close") {
      console.log("you click close");
      table.removeChild(parent);
    } else {
      //event.target.previousElementSibling.classList.toggle("checked");

      if (!event.target.matches(".close")) {
        if (event.target.classList.contains("checked")) {
          event.target.classList.remove("checked");
          console.log("check class removed");
        } else {
          event.target.classList.add("checked");
          console.log("check class add");
        }
      }
    }
  });
});

//modal box
const modal = document.getElementById("modal-box");
const refresh = document.getElementById("refreshBtn");
const dismissBtn = document.getElementById("dismissBtn");

const ereModal = () => {
  modal.style.display = "flex";

  dismissBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = event => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};
//modal box end
/*-----------------------
my service worker
------------------------*/
// service worker registeration'
showAlert = message => {
  console.log(message);
  const DisplayMessage = document.getElementById("display");
  DisplayMessage.innerHTML = message;
  ereModal();
};

updateReady = worker => {
  console.log("Update found");
  showAlert("New version available");
  document.getElementById("refreshBtn").addEventListener("click", () => {
    worker.postMessage({ action: "skipWaiting" });
    modal.style.display = "none";
    console.log("referesh clicked");
    //location.reload();
  });
};
trackInstalling = worker => {
  worker.addEventListener("statechange", () => {
    if (worker.state === "installed") {
      console.log("installed");
      updateReady(worker);
    }
  });
};
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(reg => {
        console.log("service worker registered!", reg);
        if (reg.waiting) {
          updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener("updatefound", () => {
          trackInstalling(reg.installing);
          return;
        });

        let refreshing;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          //window.location.reload();
          location.reload();
          refreshing = true;
        });
      })
      .catch(err => {
        console.error("service worker failed!", err);
      });
  });
}
/*-----------------------
add manifest to homescreen for phone
------------------------*/
let deferredprompt;
window.addEventListener("beforeinstallprompt", event => {
  //prevent chrome 67 and earlier from automatic showing the promt
  event.preventDefault();

  //stash the event so it can be triggered later
  deferredprompt = event;

  //attach the install prompt to a user gesture
  document.querySelector("#installBtn").addEventListener("click", event => {
    //show the prompt
    deferredprompt.prompt();

    //wait for the user to respond to the prompt
    deferredprompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredprompt = null;
    });
  });
  //update UI notify the user they can add to home screen
  document.querySelector("#installBanner").style.display = "flex";
});
