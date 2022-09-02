var urlName;
var hostName;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(tabs);
  urlName = tabs[0].url;
  hostName = new URL(tabs[0].url).hostname;

    console.log(urlName, hostName);
  let url = document.getElementById("url");
  url.innerText = hostName;
});

function ShowError(text) {
  var divElement = document.createElement("div");
  divElement.setAttribute("id", "ERRORcontainer");
  divElement.innerHTML = `
                <div class="ERROR">
                    <p>${text}</p>     
                </div>`;
  document.getElementsByClassName("bottomItem")[0].appendChild(divElement);

  setTimeout(() => {
    let ERRORcontainer = document.getElementById("ERRORcontainer");
    ERRORcontainer.remove();
  }, 4000);
}

//***** */

let btn = document.getElementById("btn")
btn.addEventListener("click", () => {

  if (urlName.toLowerCase().includes("chrome://")) {
      ShowError("You cannot block a chrome URL")
  }
  else {
      chrome.storage.local.get("BlockedUrls", (data) => {
          if (data.BlockedUrls === undefined) {
              chrome.storage.local.set({ BlockedUrls: [{ status: "In_Progress", url: hostName }] })
              chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                  chrome.tabs.sendMessage(
                      tabs[0].id,
                      { from: "popup", subject: "startTimer" }
                  );
              });

              setTimeout(() => {
                  var then = new Date();
                  then.setHours(24, 0, 0, 0);
                  const blockTill = then.getTime()

                  chrome.storage.local.set({
                      BlockedUrls: [{
                          status: "BLOCKED", url: hostName, BlockTill: blockTill
                      }]
                  })
              }, 5000);

          }
          else {
              if (data.BlockedUrls.some((e) => e.url === hostName && e.status === "In_Progress")) {
                  ShowError("This URL will be completely blocked after some time")
              }
              else if (data.BlockedUrls.some((e) => e.url === hostName && e.status === "BLOCKED")) {
                  ShowError("This URL is Blocked completely")
              }
              else {
                  chrome.storage.local.set({ BlockedUrls: [...data.BlockedUrls, { status: "In_Progress", url: hostName }] })

                  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                      chrome.tabs.sendMessage(
                          tabs[0].id,
                          { from: "popup", subject: "startTimer" }
                      );
                  });

                  setTimeout(() => {
                      chrome.storge.local.get("BlockedUrls", (data) => {
                          data.BlockedUrls.forEach((e, index) => {
                              if (e.url === hostName && e.status === 'In_Progress') {
                                  var arr = data.BlockedUrls.splice(index, 1);

                                  var then = new Date();
                                  then.setHours(24, 0, 0, 0);
                                  const blockTill = then.getTime()

                                  chrome.storage.local.set({ BlockedUrls: [...arr, { status: "BLOCKED", url: hostName, BlockTill: blockTill }] })
                              }
                          })
                      })


                  }, 5000);

              }
          }
      })

  }


})








