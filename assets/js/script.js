const searchBtnEl = document.querySelector('.search-btn');
const searchInputEl = document.querySelector('.search-input');




function search() {

var query = searchInputEl.value
    if(query === ''){
        return;
    }
    window.location.href = 'results.html' + '#' + query

}





searchBtnEl.addEventListener('click', search);
