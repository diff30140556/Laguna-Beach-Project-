// fetch ParksList function
function init() {
    // use fetch to get the parks list from the national park API
    var text = window.location.hash.substring(1);
    console.log(text);

    getParksList();
    }
    
    
    // 
    function getParksList() {
    // using the search input value to find the qualified parks data
    
    
    renderParkList();
    }
    
    
    function renderParkList() {
    // render the qualified parks data on the browser
    
    }



    init();