    const apiKey = "4f2a6d6244349d83794a4c7d94386573";
    const apiAqi = "https://api.openweathermap.org/data/2.5/air_pollution?";
    const apiForecast = "http://api.openweathermap.org/data/2.5/air_pollution/forecast?"
    const apiCity = "https://api.openweathermap.org/geo/1.0/direct?q="
    const apiCityName = "http://api.openweathermap.org/geo/1.0/reverse?"

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const lokasiBtn = document.querySelector("#lokasi");
    const prediksiBtn = document.querySelector("#prediksi");
    const weatherIcon = document.querySelector(".weather-icon")

    let latitud = 1;
    let longitud = 1;
    let city = "";

    // mengambil latitud dan longtiud kota
    async function getLatCity(){
        const search = searchBox.value;
        const getCity = await fetch(apiCity + search + `&appid=${apiKey}`)
        var dataCity = await getCity.json()

        latitud = dataCity[0].lat
        longitud = dataCity[0].lon
        city = dataCity[0].name
    }

    // mengambil nama kota dari lat dan lon device
    async function getNameCity(lat, lon){
        const getCityName = await fetch(`${apiCityName}lat=${lat}&lon=${lon}&appid=${apiKey}`)
        const cityName = await getCityName.json()
        city = cityName[0].name;
        console.log(cityName[0].name);
    }

    // mengambil latitud dan longtiud dari lokasi device
    function getDeviceLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                latitud = position.coords.latitude;
                longitud = position.coords.longitude;

                getNameCity(position.coords.latitude, position.coords.longitude)

            }, function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("Izin untuk mengakses lokasi ditolak.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Informasi lokasi tidak tersedia.");
                        break;
                    case error.TIMEOUT:
                        console.error("Waktu permintaan lokasi habis.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.error("Terjadi kesalahan yang tidak diketahui.");
                        break;
                }
            });
        } else {
            console.error("Geolocation tidak didukung di peramban ini.");
        }

    }
    
    // cek aqi
    async function ceckAqi(api, lat, lon, index = 0) {
        const aqi = await fetch(api + `lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
        var data = await aqi.json();

        document.querySelector("#aqi").innerHTML = data.list[index].main.aqi;
        document.querySelector(".city").innerHTML = city;
        document.querySelector("#so2").innerHTML = data.list[index].components.so2;
        document.querySelector("#no2").innerHTML = data.list[index].components.no2;
        document.querySelector("#pm10").innerHTML = data.list[index].components.pm10;
        document.querySelector("#pm2_5").innerHTML = data.list[index].components.pm2_5;
        document.querySelector("#o3").innerHTML = data.list[index].components.o3;
        document.querySelector("#co").innerHTML = data.list[index].components.co;


        if (data.list[index].main.aqi == 1) {
            weatherIcon.src = "images/good.png";
        } else if (data.list[index].main.aqi == 2) {
            weatherIcon.src = "images/moderate.png";
        } else if (data.list[index].main.aqi == 3) {
            weatherIcon.src = "images/unhealthy1.png";
        } else if (data.list[index].main.aqi == 4) {
            weatherIcon.src = "images/unhealthy.png";
        } else if (data.list[index].main.aqi == 5) {
            weatherIcon.src = "images/very-unhealty.png";
        }

        document.querySelector("#lokasi").style.display = "none";
        document.querySelector(".weather").style.display = "block";
    }


      
    lokasiBtn.addEventListener("click", () => { 
        getDeviceLocation();
        ceckAqi(apiAqi, latitud, longitud);
     })

    searchBtn.addEventListener("click", async () => { 
        document.querySelector(".hasil-prediksi").style.display = "none";
        await getLatCity();
        ceckAqi(apiAqi, latitud, longitud);
    })
    
    prediksiBtn.addEventListener("click", async () => { 
        document.querySelector(".hasil-prediksi").style.display = "block";
        ceckAqi(apiForecast, latitud, longitud, 24); 
    })
    