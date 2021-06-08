const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const request = indexedDB.open("budget", 1);
let db;

// const tx = db.transaction("static-cache-v2", "readwrite");
// const store = tx.objectStore("static-cache-v2");
// let tx = db.transaction("budgetSomething", "readwrite");
// let store = tx.objectStore("budgetSomething");
request.onupgradeneeded = function (e) {
  db = e.target.result;
  db.createObjectStore("budgetTable",{
    autoIncrement: true
  });
};

request.onerror = function () {
  console.log("There was an error");
};

request.onsuccess = function (e) {
  db = e.target.result;
  db.onerror = function (e) {
    console.log("error");
  };
  if (navigator.onLine) checkData();
};

function saveRecord(data) {
  const tx = db.transaction(["budgetTable"], "readwrite");
  const store = tx.objectStore("budgetTable");
  console.log(data)
  store.add(data);
}

function checkData() {
  // console.log(e);
  const tx = db.transaction(["budgetTable"], "readwrite");
  const store = tx.objectStore("budgetTable");
  const getAll = store.getAll(); 
  getAll.onsuccess=function() {
    if(getAll){
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then((response)=>{
          return response.json();
      })
      .then(() => {
        const tx = db.transaction(["budgetTable"], "readwrite");
        const store = tx.objectStore("budgetTable");
        store.clear();
        // clear the object store
      });
    }
  }
}
window.addEventListener('online', checkData);
