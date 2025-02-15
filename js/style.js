// Function to format the date in "Day, Month Date, Year" format
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("cityInput");

    // Default location API
    const defaultLocationApi = "http://ip-api.com/json";

    // Fetch default location based on user's IP
    fetch(defaultLocationApi)
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                getWeather(data.city); // Fetch weather for the detected city
            } else {
                alert("Could not detect location. Please search manually.");
            }
        })
        .catch(error => {
            console.error("Error fetching default location:", error);
        });

    // Handle search button click
    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            getWeather(city); // Fetch weather based on city entered
        } else {
            alert("Please enter a city name.");
        }
    });

    // Fetch weather by city name
    function getWeather(city) {
        const apiKey = '50cf5bc168074b7dbec195719241112'; // Your API key
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("City not found. Please try again.");
                } else {
                    updateWeatherCards(data, city);
                }
            })
            .catch(error => {
                console.error("Error fetching weather data", error);
                alert("An error occurred while fetching weather data. Please try again.");
            });
    }

    // Update the weather cards with the fetched data
    function updateWeatherCards(data, city) {
        const forecast = data.forecast.forecastday;

        // Set current day, date, and city
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleDateString("en-US", { weekday: "long" });
        const currentDateString = formatDate(currentDate); // Call formatDate function

        // Update current weather data
        document.getElementById("currentDay").textContent = currentDay;
        document.getElementById("currentDate").textContent = currentDateString; // Set formatted date
        document.getElementById("currentCity").textContent = city;

        // Update the weather icon and details for the current weather
        const currentCondition = data.current.condition.text.toLowerCase();
        document.getElementById("icon1").className = `fas ${getIconClass(currentCondition)}`;
        document.getElementById("desc1").textContent = data.current.condition.text;
        document.getElementById("details1").innerHTML = `
            <span>${data.current.humidity}% <i class="fas fa-tint"></i></span>
            <span>${data.current.wind_kph} km/h <i class="fas fa-wind"></i></span>
            <span>${data.current.wind_dir} <i class="fas fa-compass"></i></span>
        `;

        // Update the rest of the cards with forecast data
        forecast.forEach((day, index) => {
            const dayElement = document.querySelectorAll('.card')[index].querySelector('h5');
            const tempElement = document.querySelectorAll('.card')[index].querySelector('h3');
            const iconElement = document.querySelectorAll('.card')[index].querySelector('i');
            const descElement = document.querySelectorAll('.card')[index].querySelector('p');
            const detailsElement = document.querySelectorAll('.card')[index].querySelector('.details');

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

            dayElement.textContent = dayName;
            tempElement.textContent = `${day.day.avgtemp_c}°C`;
            descElement.textContent = day.day.condition.text;
            iconElement.classList = `fas ${getIconClass(day.day.condition.text.toLowerCase())}`;
            detailsElement.innerHTML = `
                <span>${day.day.daily_chance_of_rain}% <i class="fas fa-tint"></i></span>
                <span>${day.day.maxwind_kph} km/h <i class="fas fa-wind"></i></span>
                <span>${day.day.wind_dir} <i class="fas fa-compass"></i></span>
            `;
        });
    }

    // Helper function to determine the icon class based on the weather condition
    function getIconClass(condition) {
        if (condition.includes("sunny")) {
            return "fa-sun";
        } else if (condition.includes("cloudy")) {
            return "fa-cloud-sun";
        } else if (condition.includes("rain")) {
            return "fa-cloud-rain";
        } else if (condition.includes("snow")) {
            return "fa-snowflake";
        } else if (condition.includes("wind")) {
            return "fa-wind";
        } else if (condition.includes("fog")) {
            return "fa-smog";
        }
        return "fa-cloud"; // Default icon for undefined conditions
    }
});
