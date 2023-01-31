// store elements in variables
const testing = document.querySelector('.testing');
const titleEl = document.querySelector('.detailed-title');
const descriptionEl = document.querySelector('.description');
const slideShowEl = document.querySelector('.slideShowContent');
const thingsListEl = document.querySelector('.thingsList');
const thingsTitleEl = document.querySelector('.thinsTitle');
const embedMapEl = document.querySelector('.locationMap');
const foreCastEl = document.querySelector('.forecast');
const infoEl = document.querySelector('.info-content');
const basicInfoEl = document.querySelector('.basicInfo');
const weatherTitleEl = document.querySelector('.weatherTitle');
const mapTitleEl = document.querySelector('.mapTitle');

let specificPark = {};
let thingsToDo = {};
let queryCode = '';

// swiper for banner images and weather
let swiper;
let weatherSwiper;

// get favorite records from local storage
let favoriteData = JSON.parse(localStorage.getItem('favorite')) || [];

// initial function
function init() {
    // get the park code from window location
    let resultCode = (window.location.hash.substring(1));
    queryCode = resultCode.split('=')[1];
    getSpecificPark(queryCode);
}

// getting Specific park from API
function getSpecificPark(queryCode) {
    // chaining API Url
    const parkApiBase = 'https://developer.nps.gov/api/v1/parks';
    const partApiParameters = '?parkCode=' + queryCode + '&api_key=';
    const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
    const parkApiUrl = parkApiBase + partApiParameters + parkApiKey;

    fetch(parkApiUrl, { method: 'get' })
        .then(response => {
            return response.json();
        }).then(data => {
            specificPark = data.data[0];
            getThingsToDo(queryCode);
        })

}

// getting things to do from API
function getThingsToDo(code) {
    // chaining API Url
    const toDoParkApiBase = 'https://developer.nps.gov/api/v1/thingstodo';
    const toDoPartApiParameters = '?parkCode=' + code + '&api_key=';
    const parkApiKey = 'UeqePRwoByT73mJd2am1zFxWuD5EzcIiSw3aAMz4';
    const toDoParkApiUrl = toDoParkApiBase + toDoPartApiParameters + parkApiKey;

    fetch(toDoParkApiUrl, { method: 'get' })
        .then(response => {
            return response.json();
        }).then(data => {
            thingsToDo = data;
            renderParkInfo();
        })
}

// rendering data to the browser
function renderParkInfo() {
    // initialize the swiper first
    initSwiper();
    initWeatherSwiper();
    // render all of the info
    renderTitle();
    renderBanner();
    renderInfo();
    renderThingsToDo();
    renderMap();
    getWeatherInfo();
}

// rendering title
function renderTitle() {
    console.log(favoriteData)
    let iconStr = ``

    if(favoriteData.length === 0){
        iconStr = `<i class="fa-regular fa-heart favorite-icon red-text hoverNo"></i>`
    }

    for (let i = 0; i < favoriteData.length; i++){
        if (favoriteData[i].code === queryCode){
            iconStr = `<i class="fa-solid fa-heart favorite-icon red-text text-accent-3 hoverHas"></i>`
        }else{
            iconStr = `<i class="fa-regular fa-heart favorite-icon red-text hoverNo"></i>`
        }
    }

    titleEl.innerHTML = specificPark.fullName + `<a class="favorite-link" href="#" data-code="` + specificPark.parkCode + `">`+ iconStr +`</a>`;
}

// rendering banner
function renderBanner() {
    // description area
    descriptionEl.innerHTML = `<p>` + specificPark.description + `</p>`;

    // images slider
    let slideImagesStr = '';
    for (let i = 0; i < specificPark.images.length; i++) {
        slideImagesStr +=
        `<div class="swiper-slide slide-bg"
        style="background: url(`+ specificPark.images[i].url + `) center no-repeat;">
        </div>`
    }
    slideShowEl.innerHTML = slideImagesStr;
    
    // prevent display error by destroying old swiper then re-initial
    swiper.destroy(true, true);
    initSwiper()
}

// rendering basic info
function renderInfo() {
    // print title
    basicInfoEl.textContent = 'Basic Information';

    let feesStr = '';
    // entrance passes fees won't print on the browser if it's empty or $0
    if (specificPark.entrancePasses.length !== 0 && specificPark.entrancePasses[0].cost !== '0.00') {
        feesStr = `$` + specificPark.entrancePasses[0].cost + `<br>
        ` + specificPark.entrancePasses[0].description + `<br>`;
    }
    // render regular entrance fees
    for (let i = 0; i < specificPark.entranceFees.length; i++) {
        feesStr += `$` + specificPark.entranceFees[i].cost + `<br>
        `+ specificPark.entranceFees[i].description + `<br>`;
    }

    // render weather info, shows N/A if it is a link
    let weatherStr = ''
    if (specificPark.weatherInfo.includes('http')) {
        weatherStr = 'N/A';
    } else {
        weatherStr = specificPark.weatherInfo;
    }

    // rendering basic info
    infoEl.innerHTML =
        `<li><a class="info-slide" href="#">Weather ></a>
            <p>`+ weatherStr + `</p>
        </li>
        <li><a class="info-slide" href="#">Fees & Passes ></a>
            <p>`+ feesStr + `</p>
        </li>
        <li><a class="info-slide" href="#">Website For More Info ></a>
            <p><a class="webUrl" target href="_blank"`+ specificPark.url + `">Park Website</a></p>
        </li>`
}

// rendering things to do
function renderThingsToDo() {
    let thingsListStr = '';
    // only print title when there's a list
    if (thingsToDo.data.length !== 0) {
        thingsTitleEl.textContent = 'Things To Do';
    } else {
        thingsTitleEl.textContent = '';
    }

    // rendering list
    for (let i = 0; i < thingsToDo.data.length; i++) {
        thingsListStr +=
            `<li class="hoverable thingsItem row col s12 m5 l12">
                <div class="thingsDescription col s12 l6">
                    <h4>`+ thingsToDo.data[i].title + `</h4>
                    <p>`+ thingsToDo.data[i].shortDescription + `</p>
                </div>
                <div class="thingsImage col s12 l6">
                    <img src="`+ thingsToDo.data[i].images[0].url + `" alt="` + thingsToDo.data[i].images[0].altText + `">
                </div>
            </li>`
        }
    thingsListEl.innerHTML = thingsListStr;
}

// rendering Google map
function renderMap() {
    // print title
    mapTitleEl.textContent = 'Location';
    // convert park name to google map parameter format
    let locationName = specificPark.fullName.replaceAll(' ', '+');
    let stateCode = specificPark.states;
    // rendering map
    embedMapEl.innerHTML =
        `<iframe width="100%" height="400" frameborder="0" style="border:0"
    referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBM3jKPwwg5VHvuiDu4hi1H-4U2jh7CmiY&q=`+ locationName + `,` + stateCode + `&language=en"
        allowfullscreen>
        </iframe>`
}

// get weather info from OpenWeather API
function getWeatherInfo() {
    // chaining API Url
    let lat = specificPark.latitude;
    let lon = specificPark.longitude;
    let weatherApiKey = 'ec7477b8bf25c30e53208ecbb6569748';
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
            currentData = data;
            // fetching data from forecast weather API
            fetch(forecastAPIurl, { method: 'get' })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data => {
                    forecastData = data;
                    renderWeather(currentData, forecastData);
                }))
        }))
}

// rendering current weather and forecast weather
function renderWeather(currentData, forecastData) {
    let currentDateString = getDateByUNIXtimestamp(currentData.dt);
    let currentWeatherDetail = getWeatherDetail(currentData);
    // print title
    weatherTitleEl.textContent = 'Weather Forecast';

    // generate current weather info
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

    // chaining the forecast weather info
    for (let i = 0; i < fiveDaysForecast.length; i++) {
        let forecastDateString = getDateByUNIXtimestamp(fiveDaysForecast[i].dt);
        let forecastWeatherDetail = getWeatherDetail(fiveDaysForecast[i])

        // generate the forecast weather info
        forecastList +=
            `<div class="foreCastItem swiper-slide">
                <h3>`+ forecastDateString + `</h3>
                <div class="weather-icon"><img src="`+ forecastWeatherDetail.weatherIconUrl + `" alt="weather-icon"></div>
                <p>Temp: `+ forecastWeatherDetail.fahrenheit + ` &#8457</p>
                <p>Wind: `+ forecastWeatherDetail.windSpeed + ` MPH</p>
                <p>Humidity: `+ forecastWeatherDetail.humidity + ` %</p>
            </div>`

        // rendering weather info
        foreCastEl.innerHTML = currentWeatherStr + forecastList;
    }
    // prevent display error by destroying old swiper then re-initial
    weatherSwiper.destroy(true, true);
    initWeatherSwiper();
}

// calculate the time by UNIX timestamp then return
function getDateByUNIXtimestamp(UNIXtimestamp) {
    let time = new Date(UNIXtimestamp * 1000);
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let year = time.getFullYear().toString().slice(-2);

    // return a date
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

// weather swiper setting
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
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// banner images swiper setting
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
    });
}

// add a park to favorite list 
function addToFavorite(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
        return;
    }

    // save info to empty object then push to data base
    let recordObj = {};
    recordObj.name = specificPark.fullName;
    recordObj.img = specificPark.images[0].url;
    recordObj.code = specificPark.parkCode;

    favoriteData.push(recordObj);
    saveToLocal();
}

// save favorite park to the local storage
function saveToLocal() {
    localStorage.setItem('favorite', JSON.stringify(favoriteData));
}

// function for basic info slide effect
$('.info-content').click(function (e) {
    e.preventDefault();

    if (e.target.nodeName !== 'A') {
        return;
    }

    $(e.target).toggleClass('active').parent().siblings().find('a').removeClass('active');
    $(e.target).siblings('p').stop().slideToggle();
    $(e.target).parent().siblings().find('p').slideUp();
});

// event listener
titleEl.addEventListener('click', addToFavorite);

// fire initial function
init()
