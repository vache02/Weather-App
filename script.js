const temp = document.getElementById('temp'),
date = document.getElementById('date-time'),
currentLocation = document.getElementById('location'),
condition = document.getElementById("condition"),
rain = document.getElementById('rain'),
mainIcon = document.getElementById('icon'),
uvIndex = document.querySelector(".uv-index"),
uvText = document.querySelector(".uv-text"),
windSpeed = document.querySelector(".wind-speed"),
sunRise = document.querySelector(".sun-rise"),
sunSet= document.querySelector(".sun-set"),
humidity = document.querySelector(".humidity"),
visibility = document.querySelector(".visibility"),
humidityStatus = document.querySelector(".humidity-status"),
airQuality = document.querySelector(".air-quality"),
airQualityStatus = document.querySelector(".air-quality-status"),
visibilityStatus = document.querySelector(".visibility-status"),
weatherCards = document.querySelector('#weather-cards'),
celsiusBtn = document.querySelector(".celsius"),
fahrenheitBtn = document.querySelector(".fahrenheit"),
hourlyBtn = document.querySelector(".hourly"),
weekBtn = document.querySelector(".week"),
tempUnit = document.querySelectorAll(".temp-unit"),
searchForm = document.querySelector("#search"),
search = document.querySelector("#query");   

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//Update Date && Time

function getDateTime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();
//12 hour format
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednsday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
let dayString = days[now.getDay()];
return `${dayString},${hour}:${minute}`;

}
date.innerText = getDateTime();
setInterval(() =>{
    date.innerText = getDateTime();
},1000);

function getPublicIp(){
    fetch('https://geolocation-db.com/json/',
    {
        method: "GET",
        
    })
    .then((response) => response.json())
    .then((data) => {
       
        currentCity = data.city;
       getWeatherData(data.city, currentUnit,hourlyorWeek);
    });
}
getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek){
    const apiKey = "UWUMVM79EP6X68B3A9ZEVJZED"
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
        method: "GET",
    }
    )
    .then((res) => res.json())
    .then((data) => {
      let today = data.currentConditions;
      //console.log(today);
      if(unit === "c"){
        temp.innerText = today.temp;
      }else{
        temp.innerText = celsiusToFahrenheit(today.temp)
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureIndex(today.uvindex);
      updateHumidityStatus(today.humidity);
      updateVisibilityStatus(today.visibility);
      updateAirQualityStatus(today.winddir);
      sunRise.innerText = convert12Format(today.sunrise);
      sunSet.innerText = convert12Format(today.sunset);
      mainIcon.src = getIcon(today.icon);
      changeBackground(today.icon);
      if(hourlyorWeek === "hourly"){
        updateForecast(data.days[0].hours, unit, "day")
      }else{
        updateForecast(data.days, unit, "week")
      }
    })
    .catch((err) => {
        console.error(err)
    });
}

//convert celsius to fahrenheit
function celsiusToFahrenheit(temp){
    return ((temp * 9)/5 + 32).toFixed(1);
}

//function to get uv index status
function measureIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "Low";
    }else if(uvIndex <= 5){
        uvText.innerText = "Moderate";
    }else if(uvIndex <= 7){
        uvText.innerText = "High";
    }else if(uvIndex <= 10){
        uvText.innerText = "Very High";
    }else{
        uvText.innerText = "Extreme";
    }
}

//updating humididty status
function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidityStatus.innerText = "Low"
    }else if(humidity <= 60){
        humidityStatus.innerText = "Moderate"
    }else{
        humidityStatus.innerText = "High"
    }
}

//updating visibility status
function updateVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog";
    }else if(visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog";
    }else if(visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog";
    }else if(visibility <= 1.13){
        visibilityStatus.innerText = "=Very Light Fog";
    }else if(visibility <= 2.16){
        visibilityStatus.innerText = "Light Mist";
    }else if(visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist";
    }else if(visibility <= 10.8){
        visibilityStatus.innerText = "Clear Air";
    }else{
        visibilityStatus.innerText = "Very Clear Air";
    }
}
//updating air quality status
function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good";
    }else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate";
    }else if(airQuality <= 150){
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    }else if(airQuality <= 200){
        airQualityStatus.innerText = "Unhealthy";
    }else if(airQuality <= 250){
        airQualityStatus.innerText = "Very Unhealthy";
    }else{
        airQualityStatus.innerText = "Hazardous";
    }
}

//converting  12 hour format for Sunset/Sunrise
function convert12Format(time){
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "am" : "pm";
    hour = hour & 12;
    hour = hour ? hour : 12; //zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour; //add prefix zero if less than 10
    minute = minute < 10 ? minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}
//Changing icons depend on weather
function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
      return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
      return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
      return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
      return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
      return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
      return "https://i.ibb.co/rb4rrJL/26.png";
    }
  }
  

//gettigng day names
function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednsday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12 ){
        hour = hour -12;
        return `${hour}:${min} PM`
    }else if(hour == 00){
        return `12:${min} Noon`
    }else{
        return `${hour}:${min} AM`
    }
}
//forecast Week || Today
function updateForecast(data,unit,type){
    weatherCards.innerText = "";

    let day = 0;
    let numCards = 0;
    if(type === "day"){
        numCards = 24;
    }else{
        numCards = 7;
    }
    for(let i = 0; i < numCards; i++){
        let card = document.createElement('div');
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if(type === "week"){
        dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if(unit === "f"){
            dayTemp = celsiusToFahrenheit(data[day].temp)
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F"
        }
        card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
         <img src="${iconSrc}" alt="" >
    
        </div>
         <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
             <span class="temp-unit">${tempUnit}</span>
        </div>    
        
        
        `;
        weatherCards.appendChild(card);
        day++;
    }
}

function changeBackground(condition){
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "./images/partcloudy.jpg";
      } else if (condition === "partly-cloudy-night") {
        bg= "./images/partcloudynight.jpg";
      } else if (condition === "rain") {
        bg= "./images/rain.jpg";
      } else if (condition === "clear-day") {
        bg= "./images/clearday.jpg";
      } else if (condition === "clear-night") {
        bg= "./images/clearnight.jpg";
      } else {
        bg= "./images/sun.jpg";
      }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${bg})`
    
}

fahrenheitBtn.addEventListener("click", () =>{
    changeUnit("f");
});
celsiusBtn.addEventListener("click", () =>{
    changeUnit("c");
});

function changeUnit(unit){
    if(currentUnit !== unit){
        currentUnit = unit;
    {
    tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;

    });
    if(unit === "c"){
        celsiusBtn.classList.add("active")
        fahrenheitBtn.classList.remove("active");
    }else{
        celsiusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit,hourlyorWeek);
}
}
}

hourlyBtn.addEventListener("click", () =>{
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () =>{
    changeTimeSpan("week");
});

function changeTimeSpan(unit){
    if(hourlyorWeek !== unit){
        hourlyorWeek = unit;
        if(unit !== "hourly"){
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        }else{
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit,hourlyorWeek);
    }
}


searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let location = search.value;
    if(location){
        currentCity = location;
        getWeatherData(currentCity, currentUnit,hourlyorWeek);
    }
})

cities = [
    "Tbilisi",
    "Kutaisi",
    "Batumi",
    "London",
    "New Yourk",
    "Berlin",
    "Paris",
    "Moscow"
];

var currentFocus;

search.addEventListener("input", function (e){
    removePreSuggestion();
    var a,
    b,
    i,
    val = this.value;
    if(!val){
        return false;
    }
    currentFocus = -1;
    a=document.createElement("ul");
    a.setAttribute("id", "suggestions");
    this.parentNode.appendChild(a);

    for(i=0; i < cities.length; i++){
        if(cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
            b = document.createElement("li");
            //Make matching letters bold
            b.innerHTML = "<strong>" + cities[i].substr(0,val.length) + "</strong>";
            //remaining part of letters
            b.innerHTML += cities[i].substr(val.length);
            //input field to hold suggestion value
            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";
            //set clicked suggested city in input
            b.addEventListener("click", function(e){
                search.value = this.getElementsByTagName("input")[0].value;
                removePreSuggestion();
            });
            a.appendChild(b);
        }
    }
});

//removing previous sugestion
function removePreSuggestion(){
    var x = document.getElementById("suggestions");
    if(x) x.parentNode.removeChild(x);
}

//add up && down key functionality
search.addEventListener("keydown", function (e){
    var x = document.getElementById("suggestions");
    if(x) x = x.getElementsByTagName("li");

    if(e.keyCode == 40){
        currentFocus++;
        addActive(x);
    }else if(keyCode == 38){
        currentFocus --;
        addActive(x);
    }
    if(e.keyCode == 13){
        //if enter pressed add selected suggestion in input field
        e.preventDefault();
        if(currentFocus > -1){
            if(x) x[currentFocus].click();
        }
    }
});

function addActive(x){
     //if no suggestion return as it is

     if(!x) return false;
     removePreActive(x);
//if current focus is more than the length of suggestion arrays make it 0
     if(currentFocus >= x.length) currentFocus = 0;
//if it's less than 0 make it last suggestion  equal 
     if(currentFocus < 0) currentFocus = x.length - 1;
     //adding active class on selected li
     x[currentFocus].classList.add("active");
}

function removePreActive(x){
    for(var i = 0; i < x.length; i++){
        x[i].classList.remove("active");
    }
}