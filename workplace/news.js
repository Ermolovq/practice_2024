import { getDatabase, ref, query, orderByChild, limitToLast, onValue, push, set, equalTo, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

const db = getDatabase()

const addNewsForm = document.getElementById("addNewsForm")
addNewsForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const title = document.getElementById("title").value
  const content = document.getElementById("content").value

  const newsRef = ref(db, "News")
  const newNewsRef = push(newsRef)

  set(newNewsRef, {
    title: title,
    content: content,
    createdAt: Date.now()
  }).then(() => {
    console.log("Дані додано")
    addNewsForm.reset()
  }).catch((error) => {
    console.error(error)
  })
})

function createNewsBlock(newsData, createdAt) {
  const newsBlock = document.createElement("div")
  newsBlock.classList.add("news")

  const title = document.createElement("p")
  title.textContent = newsData.title
  title.classList.add("title")

  const content = document.createElement("p")
  content.innerHTML = newsData.content
  content.classList.add("content")

  const editNewsButton = document.createElement("button")
  editNewsButton.textContent = "Редагувати"
  editNewsButton.classList.add("edit-button")
  
  editNewsButton.addEventListener("click", () => {
    const newTitle = prompt("Введіть новий заголовок:", newsData.title)
    const newContent = prompt("Введіть новий вміст:", newsData.content)

    if (newTitle && newContent) {
      const newsQuery = query(ref(db, "News"), orderByChild("createdAt"), equalTo(createdAt))
      onValue(newsQuery, (snapshot) => {
          const newsContainer = document.getElementById("newsContainer");
          newsContainer.innerHTML = "";

          if (snapshot.exists()) {
            const newsKey = Object.keys(snapshot.val())[0]
            const newsItemRef = ref(db, `News/${newsKey}`)

            set(newsItemRef, {
              title: newTitle,
              content: newContent,
              createdAt: createdAt,
            })
              .then(() => {
                console.log("Дані оновлено")
                title.textContent = newTitle
                content.textContent = newContent
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

  const deleteNewsBlock = document.createElement("button")
  deleteNewsBlock.innerHTML = "Видалити новину"
  deleteNewsBlock.classList.add("delete-button")

  deleteNewsBlock.addEventListener("click", () => {
    const newsQuery = query(ref(db, "News"), orderByChild("createdAt"), equalTo(createdAt))
    onValue(newsQuery, (snapshot) => {
      const newsContainer = document.getElementById("newsContainer");
      newsContainer.innerHTML = "";

      if (snapshot.exists()) {
        const newsKey = Object.keys(snapshot.val())[0]
        const newsItemRef = ref(db, `News/${newsKey}`)
        remove(newsItemRef)
          .then(() => {
            newsBlock.remove()
            console.log(`Новина "${newsData.title}" успішно видалена.`)
          })
          .catch((error) => {
            console.error("Помилка видалення:", error)
          })
      } else {
        console.log("Новина не знайдена.")
      }
    }, { onlyOnce: true })
  })

  newsBlock.appendChild(title)
  newsBlock.appendChild(content)
  newsBlock.appendChild(editNewsButton)
  newsBlock.appendChild(deleteNewsBlock)

  return newsBlock
}

const newsRef = ref(db, "News")
const newsQuery = query(newsRef, orderByChild("createdAt"), limitToLast(10))

onValue(newsQuery, (snapshot) => {
  const newsContainer = document.getElementById("newsContainer")
  newsContainer.innerHTML = ""

  if (snapshot.exists()) {
    const newsData = snapshot.val()
    const newsArray = Object.entries(newsData)

    newsArray.sort((a, b) => b[1].createdAt - a[1].createdAt)

    newsArray.forEach(([key, news]) => {
      const newsBlock = createNewsBlock(news, news.createdAt)
      newsContainer.appendChild(newsBlock)
    });
  }
});
