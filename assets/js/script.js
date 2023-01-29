const searchBtnEl = document.querySelector('.search-btn');
const searchInputEl = document.querySelector('.search-input');



// trigger the fetch function when the button got clicked
function search() {
// you have to get the value of the input first, then navigate to another page then render the result on the browser
var query = searchInputEl.value
 window.location.href = 'results.html' + '#' + query

}





searchBtnEl.addEventListener('click', search);
