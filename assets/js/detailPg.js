
const testing = document.querySelector('.testing');
const testEl = document.querySelector('.testEl');
let resultCode = (window.location.hash.substring(1));
let queryCode = resultCode.split('=')[1];
console.log(queryCode);

let APIkey = 'ec7477b8bf25c30e53208ecbb6569748';
let googleMapKey = 'AIzaSyB-QQrxaDEz45HXnkR8cfVkwMfc07tC7-c';

let stateCodeArray = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
let specificPark = {};
let thingsToDo = {};


function getCoordinates() {
    // expand the result area
    let city = testEl.value.replaceAll(' ','+');
    // chaining the parameters with API url
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

getSpecificPark();

function getSpecificPark(park) {
    // console.log(park);
    // specificPark = park;
    // let code = park.parkCode;
    let code = queryCode;

    const parkApiBase = 'https://developer.nps.gov/api/v1/parks';
    const partApiParameters = '?parkCode=' + code + '&api_key=';
    const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
    const parkApiUrl = parkApiBase + partApiParameters + parkApiKey;

    fetch(parkApiUrl, { method: 'get' })
        .then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            specificPark = data.data[0];
            getThingsToDo(code);
        })

    }
    
    function getThingsToDo(code) {
    const toDoParkApiBase = 'https://developer.nps.gov/api/v1/thingstodo';
    const toDoPartApiParameters = '?parkCode=' + code + '&api_key=';
    // const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
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
const thingsTitleEl = document.querySelector('.thinsTitle');
const embedMapEl = document.querySelector('.locationMap');
const foreCastEl = document.querySelector('.forecast');
const addressEl = document.querySelector('.addressInfo');
const infoEl = document.querySelector('.info-content');


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

$('.info-content').click(function (e) {
    e.preventDefault();
    console.log($(e.target))
    console.log($(this))
    if (e.target.nodeName !== 'A'){
        return;
    }
    $(e.target).toggleClass('active').parent().siblings().find('a').removeClass('active');

    $(e.target).siblings('p').stop().slideToggle();

    $(e.target).parent().siblings().find('p').slideUp();
});

initSwiper();

function renderParkInfo() {

    console.log(specificPark);
    titleEl.innerHTML = specificPark.fullName + `<a class="favorite-link" href="#" data-code="` + specificPark.parkCode + `"><i class="favorite-icon material-icons red-text text-accent-1">favorite</i></a>`;
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
    swiper.destroy(true, true);
    initSwiper()

    // info
    let feesStr = '';
    if (specificPark.entrancePasses.length !== 0 && specificPark.entrancePasses[0].cost !== '0.00'){
        feesStr = `$` + specificPark.entrancePasses[0].cost + `<br>
        ` + specificPark.entrancePasses[0].description +`<br>`;
    }
    for ( let i = 0; i < specificPark.entranceFees.length; i++){
        feesStr += `$`+ specificPark.entranceFees[i].cost +`<br>
        `+ specificPark.entranceFees[i].description +`<br>`; 
    }

    let weatherStr = ''
    if (specificPark.weatherInfo.includes('http')) {
        weatherStr = 'N/A';
    }else{
        weatherStr = specificPark.weatherInfo;
    }
    infoEl.innerHTML = 
    `<li><a class="info-slide" href="#">Weather ></a>
        <p>`+ weatherStr +`</p>
    </li>
    <li><a class="info-slide" href="#">Fees & Passes ></a>
        <p>`+ feesStr +`</p>
    </li>
    <li><a class="info-slide" href="#">Website For More Info ></a>
        <p><a class="webUrl" target href="_blank"`+ specificPark.url +`">Park Website</a></p>
    </li>`


    let thingsListStr = '';
    if (thingsToDo.data.length !== 0) {
        thingsTitleEl.textContent = 'Things To Do';
    } else {
        thingsTitleEl.textContent = '';
    }

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

    let locationName = specificPark.fullName.replaceAll(' ', '+');
    let stateCode = specificPark.states;
    embedMapEl.innerHTML =
        `<iframe width="100%" height="400" frameborder="0" style="border:0"
    referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBM3jKPwwg5VHvuiDu4hi1H-4U2jh7CmiY&q=`+ locationName + `,` + stateCode + `&language=en"
        allowfullscreen>
    </iframe>`

    getWeatherInfo();
}

// calculate the time by UNIX timestamp then return
function getDateByUNIXtimestamp(UNIXtimestamp) {
    let time = new Date(UNIXtimestamp * 1000);
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let year = time.getFullYear().toString().slice(-2);

    return month + '/' + date + '/' + year;
}

// function to return the weather's detail information
function getWeatherDetail(data) {
    let tempKelvin = data.main.temp;
    let weatherIconCode = data.weather[0].icon;

    return {
        tempKelvin: data.main.temp,
        fahrenheit: ((tempKelvin - 273) * 1.8 + 32).toFixed(1),
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        weatherIconUrl: 'https://openweathermap.org/img/wn/' + weatherIconCode + '@2x.png'
    }
}

function getWeatherInfo() {
    let weatherApiKey = 'ec7477b8bf25c30e53208ecbb6569748';
    let lat = specificPark.latitude;
    let lon = specificPark.longitude;
    let parameters = '?lat=' + lat + '&lon=' + lon + '&appid=';
    // forecast weather API url
    let forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    let forecastAPIurl = forecastBaseUrl + parameters + weatherApiKey;
    // current weather API url
    let weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    let weatherAPIurl = weatherBaseUrl + parameters + weatherApiKey;

    let currentData = {};
    let forecastData = {};
    // fetching data from current weather API
    fetch(weatherAPIurl, { method: 'get' })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data => {
            console.log(data);
            currentData = data;
            // fetching data from forecast weather API
            fetch(forecastAPIurl, { method: 'get' })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data => {
                    console.log(data);
                    forecastData = data;
                    renderWeather(currentData, forecastData);
                }))

        }))
}

function renderWeather(currentData, forecastData) {
    let currentDateString = getDateByUNIXtimestamp(currentData.dt);
    let currentWeatherDetail = getWeatherDetail(currentData);
    let currentWeatherStr =
        `<div class="foreCastItem swiper-slide">
        <h3>`+ currentDateString + `</h3>
        <div class="weather-icon"><img src="`+ currentWeatherDetail.weatherIconUrl + `" alt="weather-icon"></div>
        <p>Temp: `+ currentWeatherDetail.fahrenheit + ` &#8457</p>
        <p>Wind: `+ currentWeatherDetail.windSpeed + ` MPH</p>
        <p>Humidity: `+ currentWeatherDetail.humidity + ` %</p>
    </div>`;

    let forecastList = '';
    // return a new array of each day's forecast
    let fiveDaysForecast = forecastData.list.filter(element => {
        return element.dt_txt.includes('00:00:00');
    });

    // chaining the forecast list
    for (let i = 0; i < fiveDaysForecast.length; i++) {
        let forecastDateString = getDateByUNIXtimestamp(fiveDaysForecast[i].dt);
        let forecastWeatherDetail = getWeatherDetail(fiveDaysForecast[i])

        forecastList +=
            `<div class="foreCastItem swiper-slide">
            <h3>`+ forecastDateString + `</h3>
            <div class="weather-icon"><img src="`+ forecastWeatherDetail.weatherIconUrl + `" alt="weather-icon"></div>
            <p>Temp: `+ forecastWeatherDetail.fahrenheit + ` &#8457</p>
            <p>Wind: `+ forecastWeatherDetail.windSpeed + ` MPH</p>
            <p>Humidity: `+ forecastWeatherDetail.humidity + ` %</p>
        </div>`

        foreCastEl.innerHTML = currentWeatherStr + forecastList;
    }
    weatherSwiper.destroy(true, true);
    initWeatherSwiper();
}

let weatherSwiper;
function initWeatherSwiper() {
    weatherSwiper = new Swiper('.weatherSwiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        speed: 400,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 30,
            slideShadows: true,
            depth: 200,
            stretch: -30,
        },
        loopFillGroupWithBlank: true,
        loopedSlides: 3,
        slideToClickedSlide: true,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}
initWeatherSwiper();

testing.addEventListener('click', function () {
    getCoordinates();
});