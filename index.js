const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML =''
  //processing
  data.forEach((item)  => {
    //title,image
    
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster" >
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>`
  });
  dataPanel.innerHTML = rawHTML
}

//li.page-item
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作template
  let rawHTML =''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回HTML
  paginator.innerHTML = rawHTML
}

// page ->
function getMoviesByPage(page) {

  const data = filteredMovies.length?filteredMovies : movies
  //計算起始 index
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列 //新增分頁器後 將movie.slice改為data.slice
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}
//將使用者點擊到的那一部電影送進 local storage 儲存起來
function addToFavorite(id) {
 
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // console.log(JSON.stringify(list))
}
dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movies')) {
    showMoviesModal (Number(event.target.dataset.id))
  } else if (event.target.matches('btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
//分頁器監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

//Model 委派點擊事件 製作事件監聽器 監聽data panel
// 此function 可改寫為簡潔的匿名函式
dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')){
    //console.log(event.target)用於檢查console的結果
    //dataset
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite (Number(event.target.dataset.id))
  }
})
//SearchFunction監聽器
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()//請瀏覽器停止做預設動作
  const keyword = searchInput.value.trim().toLowerCase()//一律轉為小寫//.trim可以將字串前後空白去除掉
  //存放搜尋完的結果

  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  //for (const movie of movies) {
  //  if(movie.title.toLowerCase().includes(keyword)){
  //      filteredMovies.push(movie)
  //}
  //}
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  ) 
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredMovies.length)
  //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(1))
})

axios.get(INDEX_URL ).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
})
  // .catch((err)=> console.log(err))

  //Array(80)陣列的顯示方式，測試串接IndexAPI
  // for (const movie of response.data.results) {
  //   movies.push(movies)
  // }
  // movies.push(response.data.results)
  // const numbers = [1, 2, 3]
  // movies.push(...numbers)
  // console.log(response.data.results)

  