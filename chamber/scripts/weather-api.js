// select HTML elements in the document
const weatherIcon = document.querySelector('#weather-icon');
const currentTemp = document.querySelector('#current-temp');
const weatherDesc = document.querySelector('#weather-desc');
const highTemp = document.querySelector('#high-temp');
const lowTemp = document.querySelector('#low-temp');
const humidity = document.querySelector('#humidity');
const sunriseTime = document.querySelector("#sunrise-time");
const sunsetTime = document.querySelector("#sunset-time");

const threeDayForecast = document.querySelector('#three-day-weather');

const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=53.26&lon=-113.55&units=metric&appid=295597fd303b1837d9546858b82c9006';
const threeDayForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=53.26&lon=-113.55&units=metric&appid=295597fd303b1837d9546858b82c9006';

async function currentWeatherApiFetch() {
    /*
    Fetches Data for the Current Weather Forecast 
    */
    try {
        const response = await fetch(currentWeatherUrl);
        if (response.ok) {
            const data = await response.json();
            //console.log(data); // for testing and seeing output
            displayCurrentWeatherResults(data); //uncomment the call to the function when output is good
        } else {
            throw Error(await response.text());
            
        }
    } catch (error) {
        console.log(error); //print error to console
    }
}

async function threeDayForecastApiFetch() {
    /*
    Fetches Data for the Three Day Forecast 
    */
    try {
        const response = await fetch(threeDayForecastUrl);
        if (response.ok) {
            const data = await response.json();
            //console.log(data); // for testing and seeing output
            displayThreeDayForecast(data); //uncomment the call to the function when output is good
        } else {
            throw Error(await response.text());

        }
    } catch (error) {
        console.log(error); //print error to console
    }
}

function displayThreeDayForecast(data) {
    /*
    Populates the container where Three Day Forecast Data is displayed
    */
    const dailyForecast = []; //array for the 3-day Forecast
    const dateToday = new Date(); //stores the full date today
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday"]; // stores strings for days of the week

    for (let i = 0; i <= 3; i++) {
        //Store each data gathered in a day in an object:
        const forecastDay = {
            //set datatype to null to avoid errors, unsure of the type of data being passed to it
            dayOfWeek: null,     
            temp: null, 
        };

        //Filter the list to find a common day 
        const dataInDay = data.list.filter(value => {
            const date = new Date(value.dt * 1000); // convert the timestamp to a Date
            //check if the day of the month is the same as today's date as a filter for the list
            return date.getDate() === dateToday.getDate() + i; 
        })

        //Find a common time in the day => pick 12 noon
        const noonTime = dataInDay.find(value => new Date(value.dt * 1000).getHours() === 2);
        //if it is found append data to forecastDay object
        if (noonTime) {
            const forecastDate = new Date(noonTime.dt * 1000).getDay();
            forecastDay.dayOfWeek = weekday[forecastDate]; //store as a string for day of the week
            forecastDay.temp = noonTime.main.temp; //store temp at said hour
            dailyForecast.push(forecastDay); // push to main array
        }
    }

    //Populate the p tag 
    dailyForecast.forEach(day => {
        threeDayForecast.innerHTML += `<span>${day.dayOfWeek}: ${day.temp}&deg;C</span><br>`;
    });
}

function displayCurrentWeatherResults(data) {
    /*
     Populates the container where Current Weather Data is displayed
     */
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    //Set weather icon attributes
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', `${data.weather[0].main} Weather Icon`);

    //Change content of Current Temp
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;

    //Change content of Weather description
    weatherDesc.textContent = `${data.weather[0].description}`;

    //Change content of High Temp
    highTemp.innerHTML = `${data.main.temp_max}&deg;`;

    //Change content of Low Temp
    lowTemp.innerHTML = `${data.main.temp_min}&deg;`;

    //Change content of Humidity
    humidity.textContent = `${data.main.humidity}%`;

    //Change content of Sunrise Time
    sunriseTime.textContent = `${getSunriseLocalTime(data)}`;

    //Change content of Sunset Time
    sunsetTime.textContent = `${getSunsetLocalTime(data)}`;
}

function getSunsetLocalTime(dataObj) {
    /*
    Returns the Sunset Local Time as a string in the format: 'hh:mm (AM/PM)'
     */
    const timeUTC = dataObj.sys.sunset; //sunset time in UTC
    const timezoneOffset = dataObj.timezone; //timezone offset

    //convert in milliseconds
    const sunsetTimeMs = (timeUTC + timezoneOffset) * 1000;
    const currentSunsetTime = new Date(sunsetTimeMs);
    const currentSunsetTimeStr = currentSunsetTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: true
    });
    return currentSunsetTimeStr
}

function getSunriseLocalTime(dataObj) {
    /*
    Returns the Sunrise Local Time as a string in the format: 'hh:mm (AM/PM)'
     */
    const timeUTC = dataObj.sys.sunrise; //sunset time in UTC
    const timezoneOffset = dataObj.timezone; //timezone offset

    //convert in milliseconds
    const sunriseTimeMs = (timeUTC + timezoneOffset) * 1000;
    const currentSunriseTime = new Date(sunriseTimeMs);
    const currentSunriseTimeStr = currentSunriseTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: true
    });
    return currentSunriseTimeStr
}

currentWeatherApiFetch();
threeDayForecastApiFetch();

//Add button even listener to become a member
const joinBtn = document.querySelector("#joinBtn");

joinBtn.addEventListener("click", () => {
    window.location.href = 'join.html';
});