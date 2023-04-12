const base_url = "https://user-list.alphacamp.io"
const index_url = base_url + "/api/v1/users/"

const user_data = JSON.parse(localStorage.getItem('favoriteFriend')) || []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

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
              <button class="btn btn-danger btn-remove-favorite" data-id="${element.id}">Delete</button>
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

function removeFromFavorite(id) {
  const userIndex = user_data.findIndex(user => user.id === id)
  if (!user_data || !user_data.length) return
  if (userIndex === -1) return
  user_data.splice(userIndex, 1)
  localStorage.setItem('favoriteFriend', JSON.stringify(user_data))
  renderUserList(user_data)
}

dataPanel.addEventListener("click", function clickAvatar(e) {
  if (e.target.matches(".card-img-top")) {
    showModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.card-body')) {
    showModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(e.target.dataset.id))
  }
})


renderUserList(user_data)