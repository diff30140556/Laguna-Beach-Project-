// store elements in variables
const searchBtnEl = document.querySelector('.search-btn');
const searchInputEl = document.querySelector('.search-input');

// search function
function search() {
    let query = searchInputEl.value
    if (query === '') {
        return;
    }
    window.location.href = 'results.html' + '#' + query
}

// Event listener
searchBtnEl.addEventListener('click', search);
