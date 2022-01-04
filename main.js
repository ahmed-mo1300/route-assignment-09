var siteName = document.getElementById('site-name');
var siteUrl = document.getElementById('site-url');
var siteBtn = document.getElementById('site-btn');
var siteSearch = document.getElementById('site-search');
var sites;
var updating = false;
var updatedSiteIndex;

if (localStorage.getItem('sites')) {
  sites = JSON.parse(localStorage.getItem('sites'));
  displayData(sites);
} else {
  sites = [];
}

function addData() {
  if (updating) {
    addUpdatedItem(updatedSiteIndex);
  } else {
    if (siteName.value && myUrlRules(siteUrl.value)) {
      var site = {
        siteName: myTextRules(siteName.value),
        siteUrl: siteUrl.value,
      };

      sites.unshift(site);
      saveToLocalStorage('sites', sites);
      displayData(sites);
    } else {
      if (!myUrlRules(siteUrl.value)) {
        alert('Please Add A Valid Url');
      } else {
        alert('Please Fill All Needed Data');
      }
    }
  }
}

function displayData(displayList) {
  var data = '';

  for (let i = 0; i < displayList.length; i++) {
    data += `
    <div class="row flex-column flex-md-row py-3 my-4 bg-secondary bg-opacity-50">
    <div class="col-5">
      <h2>${displayList[i].siteName}</h2>
    </div>
    <div class="col-12 col-md-7">
      <a class="btn btn-primary mx-1" href="${displayList[i].siteUrl}" target="_blank">
        visit
      </a>
      <button class="btn btn-warning mx-1" onclick="updateItem(${i});">Update</button>
      <button class="btn btn-danger mx-1" onclick="deleteItem(${i});">Delete</button>
    </div>
  </div>
`;
  }

  document.getElementById('display-data').innerHTML = data;
  clearInputs();
}

function clearInputs() {
  siteName.value = '';
  siteUrl.value = '';
}

function updateItem(index) {
  updating = true;
  siteBtn.innerHTML = 'Update Bookmark';

  var updatedSite = sites.concat().splice(index, 1);

  siteName.value = updatedSite[0].siteName;
  siteUrl.value = updatedSite[0].siteUrl;

  updatedSiteIndex = index;
}

function addUpdatedItem(index) {
  if (siteName.value && myUrlRules(siteUrl.value)) {
    var updatedSite = {
      siteName: myTextRules(siteName.value),
      siteUrl: siteUrl.value,
    };

    sites.splice(index, 1, updatedSite);
    saveToLocalStorage('sites', sites);
    displayData(sites);

    updating = false;
    siteBtn.innerHTML = 'Add Bookmark';
  } else {
    alert('Please Fill All Needed Data');
  }
}

function deleteItem(index) {
  sites.splice(index, 1);
  saveToLocalStorage('sites', sites);
  displayData(sites);

  if (sites.length === 0) {
    localStorage.removeItem('sites');
  }

  updating = false;
  siteBtn.innerHTML = 'Add Bookmark';
}

function saveToLocalStorage(myKey, myValue) {
  localStorage.setItem(`${myKey}`, JSON.stringify(myValue));
}

function myTextRules(text) {
  var out = `${text}`.trim().toLowerCase();
  return out.charAt(0).toUpperCase() + out.slice(1);
}

// https://stackoverflow.com/a/5717133/16107539
function myUrlRules(url) {
  var regex = new RegExp(
    '^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator

  return regex.test(url);
}

function searchItems() {
  var searchItems = [];
  var searchValue = siteSearch.value.trim().toLowerCase();

  for (let i = 0; i < sites.length; i++) {
    if (sites[i].siteName.toLowerCase().includes(searchValue)) {
      searchItems.push(sites[i]);
    }
  }

  displayData(searchItems);
}
