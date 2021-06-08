
const request = window.indexedDB.open("data-cache-v1", 1);
let db;
// const tx = db.transaction("static-cache-v2", "readwrite");
// const store = tx.objectStore("static-cache-v2");
// let tx = db.transaction("budgetSomething", "readwrite");
// let store = tx.objectStore("budgetSomething");
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("data-cache-v1", { autoIncrement: true});
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
  const tx = db.transaction("data-cache-v1", "readwrite");
  const store = tx.objectStore("data-cache-v1");
  store.add(data);
}

function checkData() {
  const tx = db.transaction("data-cache-v1", "readwrite");
  const store = tx.objectStore("data-cache-v1");
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
        store.clear();
        // clear the object store
      });
    }
  }
}