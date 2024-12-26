import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import {getDatabase, ref, query, orderByChild, limitToLast, onValue} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyCPhTf35H-6QRXqUYZLLdL6QnXFtPou6qU",
  authDomain: "practice-2024-2cf9d.firebaseapp.com",
  databaseURL: "https://practice-2024-2cf9d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "practice-2024-2cf9d",
  storageBucket: "practice-2024-2cf9d.firebasestorage.app",
  messagingSenderId: "781001774275",
  appId: "1:781001774275:web:af81307e67927cd3027e76",
  measurementId: "G-XFZB4YQT0M"
};

const app = initializeApp(firebaseConfig)
const db = getDatabase()

const newsRef = ref(db, "News");

function createNewsBlock(newsData) {
  const newsBlock = document.createElement("div")
  newsBlock.classList.add("news")

  const title = document.createElement("p")
  title.textContent = newsData.title;
  title.classList.add("title")

  const content = document.createElement("p")
  content.innerHTML = newsData.content
  content.classList.add("content")

  newsBlock.appendChild(title)
  newsBlock.appendChild(content)

  return newsBlock
}

const newsQuery = query(newsRef, orderByChild("createdAt"), limitToLast(10))
onValue(newsQuery, (snapshot) => {
  const main = document.getElementById("main")
  main.innerHTML = ""

  const newsData = snapshot.val()
  const newsArray = Object.values(newsData)

  newsArray.sort((a, b) => b.createdAt -a.createdAt)

  newsArray.forEach(news => {
    const newsBlock = createNewsBlock(news)
    main.appendChild(newsBlock)
  })
})