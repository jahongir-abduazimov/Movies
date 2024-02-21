"use strict";

movies.splice(40)

const categoryOption = $('#category');
const moviesWrapper = $('.movies');
const inputSearch = $('#header-input');
const body = $('body');
const darkMode = $('.moon');
const darkBtn = $('.bi');
const resultCount = $('.search-result')

const formFilter = $('#filter-form')
const searchName = $('#name');
const filmRating = $('#number')

const toastElement = $('.toast')

const allMovies = movies.map((el) => {
    return {
        title: el.title,
        year: el.year,
        category: el.categories,
        id: el.imdbId,
        rating: el.imdbRating,
        time: `${Math.trunc(el.runtime / 60)}h ${Math.trunc(el.runtime % 60)}m`,
        language: el.language,
        youtube: `https://www.youtube.com/embed/${el.youtubeId}`,
        summary: el.summary,
        minImage: el.smallThumbnail,
        maxImage: el.bigThumbnail,
    }
})

function getCategory(moviesList) {
    const category = []

    if (moviesList.length) {
        moviesList.forEach((el) => {
            el.category.forEach((e) => {
                if (!category.includes(e)) {
                    category.push(e)
                }
            })
        })
    }
    render(category)
}

getCategory(allMovies);


function render(data) {
    if (data.length) {
        data.sort().forEach((el) => {
            const option = createElement('option', '', el);
            categoryOption.appendChild(option);
        })
    }
}

function renderAllMovies(movieList) {
    if (movieList.length) {
        movieList.forEach((el) => {
            const card = createElement('div', 'card', `
            <img src="${el.minImage}" alt="smth">
            <div class="card-body">
                <h2>${el.title.length > 26 ? el.title.substring(0, 23) + "..." : el.title}</h2>
                <ul>
                    <li><strong>Year:</strong> ${el.year}</li>
                    <li><strong>Categories:</strong>${el.category}</li>
                    <li><strong>Rating:</strong>${el.rating}</li>
                    <li><strong>Language:</strong>${el.language}</li>
                </ul>

                <div class="flex btn-wrappeer items-center gap-x-3">
                   
                    <button 
                        data-like=${el.id}
                        class="like grid text-red-700 place-content-center p-4 border w-12 h-12 rounded-full">
                        <i data-like=${el.id} class="like bi bi-suit-heart-fill "></i>
                    </button>

                    <a href="${el.youtube}" target="_blank" class="flex hover:bg-black hover:text-white duration-500  justify-center gap-x-2 text-xl items-center border min-w-24 px-3 h-12 rounded-full"> 
                        <i class="bi bi-play-circle-fill"></i>
                        <span>watch movie</span>
                    </a>
                </div>

            </div>`
            );
            moviesWrapper.appendChild(card) 
        })
    }
}

renderAllMovies(allMovies)


// ------------- Search movies function -------------------

inputSearch.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        moviesWrapper.innerHTML = "<h1 class='mx-auto mt-[230px] font-bold text-red-600 text-[24px]'>LOADING...</h1>"
        setTimeout(() => {
            searchProduct(e.target.value)
        },1700)
    }
})
function searchProduct(searchTerm) {
    const searchReslut = allMovies.filter((el) => el.title.toLowerCase().includes(searchTerm.toLowerCase()))
    if (searchReslut.length) {
        moviesWrapper.innerHTML = ""
        resultCount.textContent = `${searchReslut.length} movies found`;
        renderAllMovies(searchReslut)
    } else {
        resultCount.innerHTML = ""
        moviesWrapper.innerHTML = "<h1 class='mx-auto mt-[230px] font-bold text-red-600 text-[24px]'>NOT FOUND</h1>"
    }
}



// -------------- Dark mode function-------------------

darkMode.addEventListener('click', () => {
    dark()
})

function dark() {
    darkBtn.classList.toggle("bi-sun-fill")
    body.classList.toggle('dark-mode')

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', true)
    } else {
        localStorage.setItem('dark-mode', false)
    }
}


function localDarkMode() {
    let isDark = localStorage.getItem('dark-mode');

    if (isDark == 'true') {
        darkBtn.classList.add("bi-sun-fill");
        body.classList.add('dark-mode');
    } else {
        darkBtn.classList.remove("bi-sun-fill");
        body.classList.remove('dark-mode');
    }
}

localDarkMode()


// --------------- Multi search function -----------------

function multiSearch() {
    let name = searchName.value;
    let rating = filmRating.value
    let category = categoryOption.value
    console.log(name, rating, category);

    const searchReslut = allMovies.filter((el) => {
        return el.title.toLowerCase().includes(name.toLowerCase()) && el.category.includes(category) && el.rating >= rating
    });

    if (searchReslut.length) {
        moviesWrapper.innerHTML = ""
        resultCount.textContent = `${searchReslut.length} movies found`;
        renderAllMovies(searchReslut)
    } else {
        resultCount.innerHTML = ""
        moviesWrapper.innerHTML = "<h1 class='mx-auto mt-[230px] font-bold text-red-600 text-[24px]'>NOT FOUND</h1>"
    }
}

formFilter.addEventListener('submit', (e) => {
    e.preventDefault();
    moviesWrapper.innerHTML = "<h1 class='mx-auto mt-[230px] font-bold text-red-600 text-[24px]'>LOADING...</h1>"
    setTimeout(() => {
        multiSearch()
    },1500)
})


moviesWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('like')) {
        let id = e.target.getAttribute('data-like')
        let titleFilm = allMovies.filter(movie => movie.id === id)[0].title;
        toast('success', `${titleFilm.length > 6 ? titleFilm.substring(0,16) + "..." : titleFilm} film addad`, 3000)
        saveToLocalStorage(id)
    }
})

function toast(type, massage, timeout) {
    toastElement.innerHTML = massage;
    if (type === 'success') {
        toastElement.classList.remove('hide');
        toastElement.classList.add('show');
        setTimeout(() => {
            toastElement.classList.remove('show')
            toastElement.classList.add('hide')
        }, timeout)
    } else if (type === 'error') {
        toastElement.classList.remove('hide');
        toastElement.classList.add('show-error');
        setTimeout(() => {
            toastElement.classList.remove('show-error')
            toastElement.classList.add('hide')
        }, timeout)
    }
}

let wishlist = JSON.parse(localStorage.getItem('movies')) || []

function saveToLocalStorage(moveId) {
    if (moveId) {
        if (!wishlist.includes(moveId)) {
            wishlist.push(moveId)
            localStorage.setItem('movies', JSON.stringify(wishlist))
        } else {
            toast('error', 'This movie already added', 2000)
        }
    }
}
