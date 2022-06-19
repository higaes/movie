const BaseURL = 'https://movie-list.alphacamp.io'
const IndexURL = BaseURL + '/api/v1/movies/'
const ImgURL = BaseURL + '/posters/'

const dataPanel = document.querySelector('#data-panel')

const SearchButton = document.querySelector('#search-form')
console.log(dataPanel)


const movies = []
// 貼movie電影, 80部區2 function
function AddMovies(data, SearchMovie = 1) {
  // 目前 SearchMovie = 1沒用到
  // 填入80部
  let rawHTML = ''
  if (SearchMovie === 1) {
    // console.log("1")
    data.forEach((j) => {
      // console.log(i)
      rawHTML += `
        <div class="col-sm-4">
          <div class="mb-2">
            <div class="card">
              <img
                src="${ImgURL + j.image}"
                class="card-img-top" alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${j.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${j.id}">More</button>
                <button class="btn btn-info btn-add-favorite"  data-id="${j.id}">+</button>
              </div>
            </div>
          </div>
        </div>`

    })
  }


  dataPanel.innerHTML = rawHTML

}

//--------------
// 處理按鈕Search區
SearchButton.addEventListener('submit', function onSearchFormSubmiited(event) {
  event.preventDefault()
  let TextSearch = document.querySelector("#search-input")
  // console.log("SearchbButton")


  console.log(movies)
  // 先用filter篩選，就不用另外let 新賦予值，並用includes挑選一樣的小寫字內容 {左右兩邊都要記得小寫}
  // trim是刪除使用者按下兩邊的space空格健
  const MoviesDes = movies.filter(m => m.title.toLowerCase().includes(TextSearch.value.trim().toLowerCase()))
  console.log(MoviesDes)
  AddMovies(MoviesDes)



})
// --------------------------------------
// 處理按鈕More區


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  // 直接抓axios電影單一的頁面矩陣值回傳
  axios.get(IndexURL + id).then((response) => {
    const data = response.data.results
    // 再axios一次抓值

    console.log(data.description)
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = ` <img src="${ImgURL + data.image}" alt="movie-poster" class="img-fluid">`


  })
}
// 處裡按鈕 +區 favorite影 2022/5/29未處理
function addToFavorite(id) {
  // console.log(id)
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 這裡事件處理器選用了非匿名函式的寫法ㄝ考量日後在為程式除錯時，能夠較快速找到報錯
dataPanel.addEventListener('click', function onPanelClicked(event) {
  // console.error('error')
  // console.log(event.target.dataset)
  // console.log(event.target)
  const target = event.target
  // 兩種找class 內資料用法，可以自己看要怎麼使用 matches前面要加.
  if (target.classList.contains('btn-show-movie')) {
    // 我們可以用 dataset 在 HTML 標籤上紀錄客製化的資訊 可以直接在 class= bstarget= bstoggle= id= 放在dataset.bstarget dataset.id 就可以直接拿
    showMovieModal(event.target.dataset.id)

    console.log(event)
  }


  // } else if(target.classList.contains('btn-add-favorite")){
  //   console.log("N");
  // }
})



// --------------------------------------




// 貼movie電影,80部區1---------
// ------------start--------------------------
axios.get(IndexURL).then((response) => {


  console.log(response.data.results)
  // (...相當於for概念 適合ES6版本javascrip 其他語言要自己看 自動push 一列一列至內容)
  movies.push(...response.data.results)

  AddMovies(movies)
})