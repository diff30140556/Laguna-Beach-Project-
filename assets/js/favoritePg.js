// store elements in variables
const favoriteEl = document.querySelector('.favoriteList');
const pageEl = document.querySelector('.page');
let favoriteData = JSON.parse(localStorage.getItem('favorite')) || [];

// 6 data per page
const contentLen = 6;

// render the qualified parks data on the browser
function renderParkList(page) {
  // the numbers of total data
  let len = favoriteData.length;
  // the minimum index of the data in one page
  let minIndex = (page - 1) * contentLen; 
  // the maximum index of the data in one page
  let maxIndex = page * contentLen;
  // prevent rendering the data which doesn't exist on the last page
  if (maxIndex > len) {
      maxIndex = len;
  }

  let output = ''
  for (let index = minIndex; index < maxIndex; index++) {
    src = (favoriteData[index].img)
    
    output += 
    `<li class="col s12 m6 favorite-item"><a class="hoverable description" href="detailPage.html#parkcode=` + favoriteData[index].code + `" style="background: url(` + src + `) center no-repeat">
    <div class="description-info">
        <h3 class="parkName">`+ favoriteData[index].name + `</h3>
    </div>
    </a></li>`
  }
  favoriteEl.innerHTML = output;

  if(len !== 0){
    pagination(1);
  }
}

// pagination function
function pagination(currentPage) {
  // calculate how many total pages we need
  let totalPages = Math.ceil(favoriteData.length / contentLen);
  
  // rendering the page buttons we need, use data number to store the real page number
  let str = '';
  for (let i = 0; i < totalPages; i++) {
      str +=
      `<li class="hoverBtn">
          <a href="#" class="waves-effect" data-number="${(i + 1)}">${(i + 1)}</a>
      </li>`;
  }
  // rendering buttons on the browser
  pageEl.innerHTML =
  `<li class="waves-effect">
      <a href="#" data-number="${(currentPage - 1)}"><i class="material-icons">chevron_left</i></a>
  </li> 
  ${str} 
  <li class="waves-effect">
      <a href="#" data-number="${(currentPage + 1)}"><i class="material-icons">chevron_right</i></a>
  </li>`;

  pageStyling(currentPage);
}

// styling the page buttons
function pageStyling(e) {
  let totalPages = Math.ceil(favoriteData.length / contentLen);

  // styling the current button
  pageEl.childNodes[e+1].classList.add('active');
  pageEl.childNodes[e+1].classList.remove('hoverBtn');

  switch (true) {
      case e === 1 && e < totalPages:
        pageEl.childNodes[e - 1].classList.add('disabled');
        break;
        
        case e === totalPages && e > 1:
          pageEl.childNodes[e + 3].classList.add('disabled');
          break;
          
        case e===1:
          pageEl.childNodes[e - 1].classList.add('disabled');
          pageEl.childNodes[e + 3].classList.add('disabled');
          break;
  }
}

// switch the page when the button got clicked
function switchPage(e) {
  e.preventDefault();

  // get the page number
  currentPage = parseInt(e.target.dataset.number);
  let element = e.target.nodeName;
  let totalPages = Math.ceil(favoriteData.length / contentLen);

  // trigger the function when A element got clicked only 
  if (element !== 'A' || currentPage < 1 || currentPage > totalPages) {
      return;
  }
  // fire all functions to re-render the specific data on certain page and also the page buttons
  renderParkList(currentPage);
  pagination(currentPage);
  pageStyling(currentPage);
}

// event listener
pageEl.addEventListener('click', switchPage);


// initial function
function init(){
  renderParkList(1);
}

// fire initial function
init();
