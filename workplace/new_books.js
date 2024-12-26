import { getDatabase, ref, query, orderByChild, limitToLast, onValue, push, set, equalTo, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

const db = getDatabase()

const addBookForm = document.getElementById("addBookForm")
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const title = document.getElementById("title").value
  const author = document.getElementById("author").value
  const description = document.getElementById("description").value

  const bookRef = ref(db, "Books")
  const bookBookRef = push(bookRef)

  set(bookBookRef, {
    title: title,
    author: author,
    description: description,
    createdAt: Date.now()
  }).then(() => {
    console.log("Дані додано")
    addBookForm.reset()
  }).catch((error) => {
    console.error(error)
  })
})

function createBookBlock(bookData, createdAt) {
  const bookBlock = document.createElement("div")
  bookBlock.classList.add("book")

  const title = document.createElement("p")
  title.textContent = bookData.title
  title.classList.add("title")

  const author = document.createElement("p")
  author.textContent = bookData.author
  author.classList.add("author")

  const description = document.createElement("p")
  description.innerHTML = bookData.description
  description.classList.add("description")

  const editBookButton = document.createElement("button")
  editBookButton.textContent = "Редагувати"
  editBookButton.classList.add("edit-button")

  editBookButton.addEventListener("click", () => {
    const newTitle = prompt("Введіть нову назву книги:", bookData.title)
    const newAuthor = prompt("Введіть нового автора:", bookData.author)
    const newDescription = prompt("Введіть новий опис:", bookData.description)

    if (newTitle && newAuthor && newDescription) {
      const bookQuery = query(ref(db, "Books"), orderByChild("createdAt"), equalTo(createdAt))
      onValue(bookQuery, (snapshot) => {
          const booksContainer = document.getElementById("booksContainer");
          booksContainer.innerHTML = "";

          if (snapshot.exists()) {
            const bookKey = Object.keys(snapshot.val())[0]
            const bookItemRef = ref(db, `Books/${bookKey}`)

            set(bookItemRef, {
              title: newTitle,
              author: newAuthor,
              description: newDescription,
              createdAt: createdAt,
            })
              .then(() => {
                console.log("Дані оновлено")
                title.textContent = newTitle
                author.textContent = newAuthor
                description.textContent = newDescription
              })
              .catch((error) => {
                console.error("Помилка оновлення:", error)
              })
          }
        },
        { onlyOnce: true }
      )
    }
  })

  const deleteBookBlock = document.createElement("button")
  deleteBookBlock.innerHTML = "Видалити"
  deleteBookBlock.classList.add("delete-button")

  deleteBookBlock.addEventListener("click", () => {
    const bookQuery = query(ref(db, "Books"), orderByChild("createdAt"), equalTo(createdAt))
    onValue(bookQuery, (snapshot) => {
      const booksContainer = document.getElementById("booksContainer");
      booksContainer.innerHTML = "";
      
      if (snapshot.exists()) {
        const bookKey = Object.keys(snapshot.val())[0]
        const bookItemRef = ref(db, `Books/${bookKey}`)
        remove(bookItemRef)
          .then(() => {
            bookBlock.remove()
            console.log(`Книга "${bookData.title}" успішно видалена.`)
          })
          .catch((error) => {
            console.error("Помилка видалення:", error)
          })
      } else {
        console.log("Новина не знайдена.")
      }
    }, { onlyOnce: true })
  })

  bookBlock.appendChild(title)
  bookBlock.appendChild(author)
  bookBlock.appendChild(description)
  bookBlock.appendChild(editBookButton)
  bookBlock.appendChild(deleteBookBlock)

  return bookBlock
}

const bookRef = ref(db, "Books")
const bookQuery = query(bookRef, orderByChild("createdAt"), limitToLast(10))

onValue(bookQuery, (snapshot) => {
  const booksContainer = document.getElementById("booksContainer")
  booksContainer.innerHTML = ""

  if (snapshot.exists()) {
    const bookData = snapshot.val()
    const bookArray = Object.entries(bookData)

    bookArray.sort((a, b) => b[1].createdAt - a[1].createdAt)

    bookArray.forEach(([key, book]) => {
      const bookBlock = createBookBlock(book, book.createdAt)
      booksContainer.appendChild(bookBlock)
    });
  }
});
