import {getDatabase, ref, push, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

const db = getDatabase();

const addNewsForm = document.getElementById("addNewsForm")
addNewsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value
  const content = document.getElementById("content").value

  const newsRef = ref(db, "News");
  const newNewsRef = push(newsRef);

  set(newNewsRef, {
    title: title,
    content: content,
    createdAt: Date.now()
  }).then(()=>{
    console.log("data added")
    addNewsForm.reset()
  }).catch((error)=>{
    console.log(error)
  })
})