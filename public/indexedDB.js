
const request = indexedDB.open("data-cache-v1", 1);
const db;

// const tx = db.transaction("static-cache-v2", "readwrite");
// const store = tx.objectStore("static-cache-v2");
// let tx = db.transaction("budgetSomething", "readwrite");
// let store = tx.objectStore("budgetSomething");
request.onupgradeneeded = function (e) {
  let db = e.target.result;
  db.createObjectStore("Budget");
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
  const db = e.target.result
  const tx = db.transaction(["Budget"], "readwrite");
  const store = tx.objectStore("Budget");
  store.add(data);
}

function checkData(e) {
  const db = e.target.result
  const tx = db.transaction(["Budget"], "readwrite");
  const store = tx.objectStore("Budget");
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
window.addEventListener('online', checkData);
