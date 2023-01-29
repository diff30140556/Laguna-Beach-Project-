var states = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhoade island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'];
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];


// fetch ParksList function
function init() {
    // use fetch to get the parks list from the national park API
    var text = window.location.hash.substring(1);
    console.log(text);

    getParksList(text);
}


// 
function getParksList(text) {
    // using the search input value to find the qualified parks data
    var index = states.indexOf(text);
    var stateCode = stateCodes[index];
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


function renderParkList(data) {
    console.log(data);
    // render the qualified parks data on the browser
    var output = ''
   for (let index = 0; index < data.data.length; index++) {
    console.log(data.data[index]);
    //output += '<li>';
    output += '<div class="description" style="background: url('+data.data[index].images[0].url+') center no-repeat">';
    output += '<a href="detailPage.html">';
    output += '<h3 class="parkName">';
    output += data.data[index].fullName;
    output += '</h3>';
    //output += '<div class="parkImage">'
    //output += '<img src="'+data.data[index].images[0].url+ '" width="300">';
    //output += '</div>';
    output += '<div class="parkDescription">';
    output += data.data[index].description;
    output += '</div>';
    output += '</a>';
    output += '</div>';
    //output += '</li>';
   }
   console.log(output); 
   document.querySelector('.resultsList').innerHTML = output;

}



init();