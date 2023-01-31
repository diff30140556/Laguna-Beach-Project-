// var states = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhoade island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'];
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const stateNameEl = document.querySelector('.state-title');
const pageEl = document.querySelector('.page');
let stateParksArr = [];
const contentLen = 6;

// fetch ParksList function
function init() {
    // use fetch to get the parks list from the national park API
    var text = window.location.hash.substring(1);
    console.log(text);

    getCoordinates(text);
    // getParksList(text);
}

function getCoordinates(text) {
    // expand the result area
    let city = text.replaceAll('%20', '+');
    console.log(city)
    // chaining the parameters with API url
    let googleMapKey = 'AIzaSyB-QQrxaDEz45HXnkR8cfVkwMfc07tC7-c';

    let geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let geocodingParameters = '?address=' + city + '&components=country:US&language=en' + '&key=';
    console.log(geocodingParameters)
    let geocodingAPIurl = geocodingBaseUrl + geocodingParameters + googleMapKey;

    // fetching data from the API
    fetch(geocodingAPIurl, { method: 'get' })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
            // if there's no data, user entered the nonexistent city
            console.log(data)
            getStateCode(data.results[0].address_components);
        })
}

function getStateCode(address) {
    console.log(address);

    let stateCode = address.filter((element) => {
        return stateCodes.indexOf(element.short_name) > -1;
    })[0].short_name;

    let stateName = address.filter((element) => {
        return stateCodes.indexOf(element.short_name) > -1;
    })[0].long_name;

    stateNameEl.textContent = stateName;
    console.log(stateCode)
    getParksList(stateCode);
}

// 
function getParksList(stateCode) {
    // using the search input value to find the qualified parks data

    // var index = states.indexOf(text);
    // var stateCode = stateCodes[index];
    console.log(stateCode);
    var apiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4'
    var url = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateCode + "&api_key=" + apiKey
    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                stateParksArr = data.data;
                console.log(stateParksArr)
                renderParkList(1);
                pagination(1);
                pageColor(1);
            })
        }
    })


}

let defaultImage = 'https://i.imgur.com/I2hSMJP.jpg';
let srcStr = '';

function getUrl(url) {
    var img = new Image();
    img.onload = function () {
        if (this.complete == true) {
            console.log('pass')

        }
    }
    img.onerror = function () {
        console.log('no')
        src = defaultImage;
        return 'paocode2.png';
    }
    img.src = url;
}

function renderParkList(num1) {
    console.log(stateParksArr);
    // render the qualified parks data on the browser
    var output = '';
    let len = stateParksArr.length;
    let num2 = (num1 - 1) * contentLen; //分業的第一筆資料
    let num3 = num1 * contentLen; //分業的最後一筆資料

    if (num3 > len) {
        num3 = len;
    }

    // i = num2; i < num3; i++

    for (let i = num2; i < num3; i++) {
        //console.log(data.data[index]);
        //output += '<li>';
        src = (stateParksArr[i].images[0].url)
        console.log(src)

        // getUrl(src, data)
        output +=
            `<div class="description hoverable" style="background: url(` + src + `) center no-repeat">
            <a class="description-info" href="detailPage.html#parkcode=` + stateParksArr[i].parkCode + `">
                <h3 class="parkName">`+ stateParksArr[i].fullName + `</h3>
                <div class="parkDescription">
                    <p>`+ stateParksArr[i].description + `</p>
                </div>
            </a>
        </div>`;


        // output += '<div class="description hoverable" style="background: url(' + src + ') center no-repeat">';
        // output += '<a class="description-info" href="detailPage.html#parkcode=' + data.data[index].parkCode + '">';
        // output += '<h3 class="parkName">';
        // output += data.data[index].fullName;
        // output += '</h3>';
        // //output += '<div class="parkImage">'
        // //output += '<img src="'+data.data[index].images[0].url+ '" width="300">';
        // //output += '</div>';
        // output += '<div class="parkDescription"><p>';
        // output += data.data[index].description;
        // output += '</p></div>';
        // output += '</a>';
        // output += '</div>';

        // output += '<div class="description hoverable" style="background: url(' + src + ') center no-repeat">';
        // output += '<a class="description-info" href="detailPage.html#parkcode=' + data.data[index].parkCode + '">';
        // output += '<h3 class="parkName">';
        // output += data.data[index].fullName;
        // output += '</h3>';
        // //output += '<div class="parkImage">'
        // //output += '<img src="'+data.data[index].images[0].url+ '" width="300">';
        // //output += '</div>';
        // output += '<div class="parkDescription"><p>';
        // output += data.data[index].description;
        // output += '</p></div>';
        // output += '</a>';
        // output += '</div>';

    }
    console.log(output);
    document.querySelector('.resultsList').innerHTML = output;

}

function showDetails(park) {
    console.log('show details');
    // window.location.href = 'detailPage.html' 
    // var text = window.location.hash.substring(1);
    // text = JSON.parse(text);
    console.log(park);

    getSpecificPark(park);
}

init();

// pagination


pageEl.addEventListener('click', switchPage);

function pagination(currentPage) {

    let totalPages = Math.ceil(stateParksArr.length / contentLen);
    let str = '';
    pageEl.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        str +=
            `<li>
            <a href="#" class="waves-effect" data-number="${(i + 1)}">${(i + 1)}</a>
        </li>`;
    }

    pageEl.innerHTML =
        `<li class="waves-effect">
        <a href="#" data-number="${(currentPage - 1)}"><i class="material-icons">chevron_left</i></a>
    </li> 
    ${str} 
    <li class="waves-effect">
        <a href="#" data-number="${(currentPage + 1)}"><i class="material-icons">chevron_right</i></a>
    </li>`;

}

function switchPage(e) {
    e.preventDefault();
    currentPage = parseInt(e.target.dataset.number);
    let element = e.target.nodeName;
    let totalPages = Math.ceil(stateParksArr.length / contentLen);
    console.log(element)
    if (element !== 'A' || currentPage < 1 || currentPage > totalPages) {
        return;
    }
    renderParkList(currentPage);
    pagination(currentPage);
    pageColor(currentPage);
}

function pageColor(e) {
    let totalPages = Math.ceil(stateParksArr.length / contentLen);
    console.log(pageEl.childNodes)

    pageEl.childNodes[e+1].classList.add('active');

    switch (true) {
        case e === 1 && e < totalPages:
            pageEl.childNodes[e - 1].classList.add('disabled');
            break;

        case e === totalPages && e > 1:
            pageEl.childNodes[e + 3].classList.add('disabled');
            break;

        case e === 1:
            pageEl.childNodes[e - 1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
            pageEl.childNodes[e + 1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
            pageEl.childNodes[e + 1].childNodes[0].style.textDecoration = 'unset';
            pageEl.childNodes[e - 1].childNodes[0].style.textDecoration = 'unset';
            break;
    }
}