// store elements in variables
const stateNameEl = document.querySelector('.state-title');
const pageEl = document.querySelector('.page');
const resultListEl = document.querySelector('.resultsList');
// states array
let stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
let stateParksArr = [];

// 6 data per page
const contentLen = 6;

// get the state code from window location
function init() {
    let stateCode = window.location.hash.substring(1);
    getCoordinates(stateCode);
}

// using google map API to get the address
function getCoordinates(stateCode) {
    // get city's name
    let city = stateCode.replaceAll('%20', '+');

    // chaining the parameters with API url
    let googleMapKey = 'AIzaSyB-QQrxaDEz45HXnkR8cfVkwMfc07tC7-c';
    let geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let geocodingParameters = '?address=' + city + '&components=country:US&language=en' + '&key=';
    let geocodingAPIurl = geocodingBaseUrl + geocodingParameters + googleMapKey;

    // fetching data from the API
    fetch(geocodingAPIurl, { method: 'get' })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
            getStateCode(data.results[0].address_components);
        })
}

// getting the state code and name by the address
function getStateCode(address) {
    //stop the function when the state not found 
    if (address.length === 1){
        stateNameEl.textContent="State Not Found!"
        return;
    }

    //use filter to traverse array to get the state short code 
    let stateCode = address.filter((element) => {
        return stateCodes.indexOf(element.short_name) > -1;
    })[0].short_name;
    //use filter to traverse array to get the state full name 
    let stateName = address.filter((element) => {
        return stateCodes.indexOf(element.short_name) > -1;
    })[0].long_name;

    stateNameEl.textContent = stateName;
    getParksList(stateCode);
}

// get data from national park API
function getParksList(stateCode) {
    var apiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4'
    var url = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateCode + "&api_key=" + apiKey
    // fetching data from national park API
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                stateParksArr = data.data;
                renderParkList(1);
                pagination(1);
            })
        }
    })
}

// render the list on the browser
function renderParkList(page) {
    // the numbers of total data
    let len = stateParksArr.length;
    // the minimum index of the data in one page
    let minIndex = (page - 1) * contentLen; 
    // the maximum index of the data in one page
    let maxIndex = page * contentLen;
    // prevent rendering the data which doesn't exist on the last page
    if (maxIndex > len) {
        maxIndex = len;
    }
    
    let output = '';
    // rendering data on the browser
    for (let i = minIndex; i < maxIndex; i++) {
        // image url
        src = (stateParksArr[i].images[0].url)
        output +=
            `<li><a class="description hoverable" href="detailPage.html#parkcode=` + stateParksArr[i].parkCode + `" style="background: url(` + src + `) center no-repeat">
            <div class="description-info">
                <h3 class="parkName">`+ stateParksArr[i].fullName + `</h3>
                <div class="parkDescription">
                    <p>`+ stateParksArr[i].description + `</p>
                </div>
            </div>
        </a></li>`;
    }
    resultListEl.innerHTML = output;
    AOS.init();
}

// pagination function
function pagination(currentPage) {
    // calculate how many total pages we need
    let totalPages = Math.ceil(stateParksArr.length / contentLen);
    
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
    let totalPages = Math.ceil(stateParksArr.length / contentLen);

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
    let totalPages = Math.ceil(stateParksArr.length / contentLen);

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

// fire initial function
init();
