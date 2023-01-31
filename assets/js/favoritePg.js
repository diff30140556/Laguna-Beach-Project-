let favoriteData = JSON.parse(localStorage.getItem('favorite')) || [];
let favoriteEl = document.querySelector('.favoriteList');

console.log(favoriteData);

renderParkList(favoriteData);

function renderParkList(data) {
    console.log(data);
    // render the qualified parks data on the browser
    var output = ''
   for (let index = 0; index < data.length; index++) {
    //console.log(data.data[index]);
    //output += '<li>';
   src = (data[index].img)
   console.log(src)

    
    output += '<li class="description hoverable col s12 m5" style="background: url('+src+') center no-repeat">';
    output += '<a class="description-info" href="detailPage.html#parkcode='+ data[index].code +'">';
    output += '<h3 class="parkName">';
    output += data[index].name;
    output += '</h3>';
    //output += '<div class="parkImage">'
    //output += '<img src="'+data.data[index].images[0].url+ '" width="300">';
    //output += '</div>';
    
    output += '</a>';
    output += '</li>';
    //output += '</li>';
   }
     console.log(output); 
   favoriteEl.innerHTML = output;
}