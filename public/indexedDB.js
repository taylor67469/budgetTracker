
const request = window.indexedDB.open("budgetSomething", 1);
let db;
// let tx = db.transaction("budgetSomething", "readwrite");
// let store = tx.objectStore("budgetSomething");
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("budgetSomething", { autoIncrement: true});
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
  const tx = db.transaction("budgetSomething", "readwrite");
  const store = tx.objectStore("budgetSomething");
  store.add(data);
}

function checkData() {
  const tx = db.transaction("budgetSomething", "readwrite");
  const store = tx.objectStore("budgetSomething");
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