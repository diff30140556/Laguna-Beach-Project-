
const testing = document.querySelector('.testing');
const testEl = document.querySelector('.testEl');

let APIkey = 'ec7477b8bf25c30e53208ecbb6569748';
let googleMapKey = 'AIzaSyB-QQrxaDEz45HXnkR8cfVkwMfc07tC7-c';

let stateCodeArray = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
let specificPark = {};
let thingsToDo = {};


function getCoordinates() {
    // expand the result area
    let city = testEl.value;
    // chaining the parameters with API url
    let geocodingBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let geocodingParameters = '?address=' + city + '&components=country:US' + '&key=';
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

    // let geocodingBaseUrl = 'https://api.openweathermap.org/geo/1.0/direct';
    // let geocodingParameters = '?q='+ city + ',US&limit=10&appid=';
    // let geocodingAPIurl = geocodingBaseUrl + geocodingParameters + APIkey;

    // // fetching data from the API
    // fetch( geocodingAPIurl, {method: 'get'} )
    //     .then((response => {
    //         if (response.ok){
    //             return response.json();
    //         }
    //     })).then((data => {
    //         // if there's no data, user entered the nonexistent city
    //         console.log(data)
    //     }))
}

function getStateCode(address) {
    console.log(address);

    let stateCode = address.filter((element) => {
        return stateCodeArray.indexOf(element.short_name) > -1;
    })[0].short_name;

    console.log(stateCode)
    getParksList(stateCode);
}

function getParksList(state) {
    const parkApiBase = 'https://developer.nps.gov/api/v1/parks';
    const partApiParameters = '?stateCode=' + state + '&api_key=';
    const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
    const parkApiUrl = parkApiBase + partApiParameters + parkApiKey;

    fetch(parkApiUrl, { method: 'get' })
        .then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            getSpecificPark(data.data[0]);
        })

}

function getSpecificPark(park) {
    console.log(park);
    specificPark = park;
    let code = park.parkCode;

    const toDoParkApiBase = 'https://developer.nps.gov/api/v1/thingstodo';
    const toDoPartApiParameters = '?parkCode=' + code + '&api_key=';
    const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
    const toDoParkApiUrl = toDoParkApiBase + toDoPartApiParameters + parkApiKey;

    fetch(toDoParkApiUrl, { method: 'get' })
        .then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            thingsToDo = data;
            renderParkInfo();
        })
}
const titleEl = document.querySelector('.detailed-title');
const descriptionEl = document.querySelector('.description');
const slideShowEl = document.querySelector('.slideShowContent');
const thingsListEl = document.querySelector('.thingsList');


let swiper;
function initSwiper() {
    swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        speed: 800,
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        }
        // // Navigation arrows
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // },
    });

}

initSwiper();

function renderParkInfo() {


    titleEl.innerHTML = specificPark.fullName + `<a href="#" data-code="` + specificPark.parkCode + `">icon</a>`;
    descriptionEl.innerHTML = `<p>` + specificPark.description + `</p>`;

    let slideImagesStr = '';
    for (let i = 0; i < specificPark.images.length; i++) {
        slideImagesStr +=
            `<div class="swiper-slide slide-bg"
        style="background: url(`+ specificPark.images[i].url + `) center no-repeat;">
        </div>`
    }
    slideShowEl.innerHTML = slideImagesStr;
    // swiper
    swiper.destroy(true , true);
    initSwiper()
    
    let thingsListStr = '';
    for (let i = 0; i < thingsToDo.data.length; i++) {
        thingsListStr +=
            `<li class="hoverable thingsItem row">
        <div class="thingsDescription col s6">
            <h4>`+ thingsToDo.data[i].title + `</h4>
            <p>`+ thingsToDo.data[i].shortDescription + `</p>
        </div>
        <div class="thingsImage col s6">
            <img src="`+ thingsToDo.data[i].images[0].url + `" alt="` + thingsToDo.data[i].images[0].altText + `">
        </div>
    </li>`
    }
    thingsListEl.innerHTML = thingsListStr;



}


testing.addEventListener('click', function () {
    getCoordinates();
});