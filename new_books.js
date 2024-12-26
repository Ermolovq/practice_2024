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

const bookRef = ref(db, "Books");

function createBookBlock(bookData) {
  const bookBlock = document.createElement("div")
  bookBlock.classList.add("book")

  const title = document.createElement("p")
  title.textContent = bookData.title;
  title.classList.add("title")

  const author = document.createElement("p")
  author.textContent = bookData.author;
  author.classList.add("author")

  const description = document.createElement("p")
  description.innerHTML = bookData.description
  description.classList.add("description")

  bookBlock.appendChild(title)
  bookBlock.appendChild(author)
  bookBlock.appendChild(description)

  return bookBlock
}

const bookQuery = query(bookRef, orderByChild("createdAt"), limitToLast(10))
onValue(bookQuery, (snapshot) => {
  const main = document.getElementById("main")
  main.innerHTML = ""

  const bookData = snapshot.val()
  const bookArray = Object.values(bookData)

  bookArray.sort((a, b) => b.createdAt -a.createdAt)

  bookArray.forEach(book => {
    const bookBlock = createBookBlock(book)
    main.appendChild(bookBlock)
  })
})