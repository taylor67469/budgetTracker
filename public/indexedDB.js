
const request = window.indexedDB.open(databaseName, 1);
let db
let tx = db.transaction("budgetSomething", "readwrite");
let store = tx.objectStore("budgetSomething");
request.onupgradeneeded = function (e) {
  const db = request.result;
  db.createObjectStore(storeName, { keyPath: "_id" });
};

request.onerror = function (e) {
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
  store.add(data);
}

function checkData() {
  const getAll = store.getAll(); 
  getAll.onsuccess=function(params) {
    if(getAll){
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
    }
  }
}