const base_url = "https://user-list.alphacamp.io"
const index_url = base_url + "/api/v1/users/"
const FRIEND_PER_PAGE = 18

const user_data = []
let filteredUser = []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")

function renderUserList(data) {
  let HTMLcontent = ``
  data.forEach((element) => {
    //要替換：name+surname / avatar
    HTMLcontent += `
    <div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img
              src="${element.avatar}"
              class="card-img-top"
              data-id="${element.id}"
              data-bs-toggle="modal" 
              data-bs-target="#user-modal" alt="Avatar">
            <div class="card-body" data-id="${element.id}" data-bs-toggle="modal" 
              data-bs-target="#user-modal">
              <h6 class="card-title">${element.name} ${element.surname}</h6>
            </div>
            <div class="card-footer">
              <button class="btn btn-info btn-add-favorite" data-id="${element.id}">Add</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = HTMLcontent
}

function showModal(id) {
  const modalName = document.querySelector("#modal-user-name")
  const modalGender = document.querySelector("#modal-user-gender")
  const modalAge = document.querySelector("#modal-user-age")
  const modalBirthday = document.querySelector("#modal-user-birthday")
  const modalRegion = document.querySelector("#modal-user-region")
  const modalEmail = document.querySelector("#modal-user-email")

  axios
    .get(index_url + id)
    .then((response) => {
      console.log(response)
      const data = response.data
      modalName.innerText = data.name + " " + data.surname
      modalGender.innerText = "Gender: " + data.gender
      modalAge.innerText = "Age: " + data.age
      modalBirthday.innerText = "Birthday: " + data.birthday
      modalRegion.innerText = "Region: " + data.region
      modalEmail.innerText = "Email: " + data.email
    })
    .catch((err) => {
      console.log(err)
    });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriend')) || []
  const friend = user_data.find(user => user.id === id)

  if (list.some(user => user.id === id)) {
    return alert('Already added to favorite.')
  }

  list.push(friend)
  localStorage.setItem('favoriteFriend', JSON.stringify(list))
}

function getFriendByPage(page) {
  const data = filteredUser.length? filteredUser : user_data
  const startIndex = (page - 1) * FRIEND_PER_PAGE
  return data.slice(startIndex, startIndex + FRIEND_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / FRIEND_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener("click", function clickAvatar(e) {
  if (e.target.matches(".card-img-top")) {
    showModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.card-body')) {
    showModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(e.target.dataset.id))
  }
})

searchForm.addEventListener("submit", function submitForm(e) {
  e.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  filteredUser = user_data.filter(user => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))

  if (filteredUser.length === 0) {
    return alert("Cannot find user.")
  }
  renderPaginator(filteredUser.length)
  renderUserList(getFriendByPage(1))
})

paginator.addEventListener("click", function onPaginatorClicked(e) {
  if (e.target.tagName !== 'A') return
  const page = Number(e.target.dataset.page)
  renderUserList(getFriendByPage(page))
})

axios
  .get(index_url)
  .then((response) => {
    // console.log(response.data.results);
    user_data.push(...response.data.results)
    renderUserList(getFriendByPage(1))
    renderPaginator(user_data.length)
  })
  .catch((err) => console.log(err))
