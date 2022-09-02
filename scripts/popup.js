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








