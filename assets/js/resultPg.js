// var states = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhoade island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'];
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const stateNameEl = document.querySelector('.state-title');

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
                renderParkList(data);
            })
        }
    })


}

let defaultImage = 'https://i.imgur.com/I2hSMJP.jpg';
let srcStr = '';

function getUrl(url) {
    var img = new Image();
    img.onload = function () {
        if (this.complete == true){
            
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

function renderParkList(data) {
    console.log(data);
    // render the qualified parks data on the browser
    var output = ''
   for (let index = 0; index < data.data.length; index++) {
    //console.log(data.data[index]);
    //output += '<li>';
   src = (data.data[index].images[0].url)
   console.log(src)

    getUrl(src, data)
    
    output += '<div class="description" style="background: url('+src+') center no-repeat">';
    output += '<a href="detailPage.html#parkcode='+ data.data[index].parkCode +'">';
    output += '<h3 class="parkName">';
    output += data.data[index].fullName;
    output += '</h3>';
    //output += '<div class="parkImage">'
    //output += '<img src="'+data.data[index].images[0].url+ '" width="300">';
    //output += '</div>';
    output += '<div class="parkDescription"><p>';
    output += data.data[index].description;
    output += '</p></div>';
    output += '</a>';
    output += '</div>';
    //output += '</li>';
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