var states = ['alabama', 'alaska', 'california', 'colorado'];
var stateCodes = ['al', 'ak', 'ca', 'co'];


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
    output += '<li>';
    output += '<div class="description">';
    output += '<div class="parkName">'
    output += data.data[index].fullName;
    output += '</div>';
    output += '<div class="parkDescription">';
    output += data.data[index].description;
    output += '</div>';
    output += '</div>';
    output += '</li>';
   }
   console.log(output); 
   document.querySelector('.resultsList').innerHTML = output;

}



init();