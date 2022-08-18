//map svg
const mapContainer = document.querySelector("#interactive-map-final-version");
const therapistElements = document.querySelectorAll(".therapists-search-result");
const bruhText = document.querySelector("#bruhtext");
const locationsDropdown = document.querySelector("#map-locations-dropdown");
const selectedLocationOption = document.querySelector("#map-location-selected");
const locationOptions = document.querySelector("#map-location-options");
//map data
const districtsArray = [
    {
        district: "Celá ČR",
        elementID: "#part-cela-cr",
        signID: "#sign-cela-cr"
    },
    {
        district: "Vsetín",
        elementID: "#part-vsetin",
        signID: "#sign-vsetin",
    },
    {
        district: "Karviná",
        elementID: "#part-karvina",
        signID: "#sign-karvina",
    },
    {
        district: "Ostrava-město",
        elementID: "#part-ostrava-mesto",
        signID: "#sign-ostrava-mesto",
    },
    {
        district: "Frýdek-Místek",
        elementID: "#part-frydek-mistek",
        signID: "#sign-frydek-mistek",
    },
    {
        district: "Jeseník",
        elementID: "#part-jesenik",
        signID: "#sign-jesenik",
    },
    {
        district: "Šumperk",
        elementID: "#part-sumperk",
        signID: "#sign-sumperk",
    },
    {
        district: "Nový Jičín",
        elementID: "#part-novy-jicin",
        signID: "#sign-novy-jicin",
    },
    {
        district: "Prostějov",
        elementID: "#part-prostejov",
        signID: "#sign-prostejov",
    },
    {
        district: "Přerov",
        elementID: "#part-prerov",
        signID: "#sign-prerov",
    },
    {
        district: "Olomouc",
        elementID: "#part-olomouc",
        signID: "#sign-olomouc",
    },
    {
        district: "Opava",
        elementID: "#part-opava",
        signID: "#sign-opava",
    },
    {
        district: "Bruntál",
        elementID: "#part-bruntal",
        signID: "#sign-bruntal",
    }
]

const citiesArray = [
    {
        city: "Opava",
        district: "Opava",
        therapists: ["#search-result-snejdarova"]
    },
    {
        city: "Havířov",
        district: "Karviná",
        therapists: ["#search-result-ohralova"]
    },
    {
        city: "Přerov",
        district: "Přerov",
        therapists: ["#search-result-kadlecova"]
    },
    {
        city: "Hukvaldy",
        district: "Frýdek-Místek",
        therapists: ["#search-result-gustinova"]
    },
    {
        city: "Polanka nad Odrou",
        district: "Ostrava-město",
        therapists: []
    },
    {
        city: "Ostrava-Polanka",
        district: "Ostrava-město",
        therapists: ["#search-result-gadulova"]
    },
    {
        city: "Frýdlant nad Ostravicí",
        district: "Frýdek-Místek",
        therapists: ["#search-result-pribylova"]
    },
    {
        city: "Frýdek-Místek",
        district: "Frýdek-Místek",
        therapists: ["#search-result-pribylova", "#search-result-furstova"]
    },
    {
        city: "Valašské Meziříčí",
        district: "Vsetín",
        therapists: ["#search-result-pribylova"]
    },
    {
        city: "Ostrava",
        district: "Ostrava-město",
        therapists: ["#search-result-gustinova", "#search-result-fukalova"]
    },
    {
        city: "Kopřivnice",
        district: "Nový Jičín",
        therapists: []
    },
    {
        city: "Celá ČR",
        district: "Celá ČR",
        therapists: ["#search-result-gadulova", "#search-result-snejdarova"]
    }
];

citiesArray.sort((a,b) => (a.city > b.city) ? 1 : ((b.city > a.city) ? -1 : 0));

function triggerEvent(el, type) {
    if ('createEvent' in document) {
        let e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        let e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

function filterTherapistsByDistrict(districtName) {
    let results = new Set();

    citiesArray.forEach(city => {
        if (city.district === districtName || districtName === "") {
            city.therapists.forEach(_therapist => results.add(_therapist));
        }
    });

    return [...results];
}
//nastaví vybranou položku dropdownu
function setSelectedOption(city) {
    let cityObject = citiesArray.filter(_cityObject => _cityObject.city === city)[0];
    let allTherapists = filterTherapistsByDistrict("");
    let filteredTherapists = [...cityObject.therapists, ...filterTherapistsByDistrict("Celá ČR")];
    locationOptions.style.display = (locationOptions.style.display === "block" ? "none" : "block");
    selectedLocationOption.innerHTML = city; //=== "Celá ČR" ? "Online" : city;

    allTherapists.forEach(_therapist => document.querySelector(_therapist).style.display = "none");
    filteredTherapists.forEach(_therapist => document.querySelector(_therapist).style.display = "flex");

    window.scrollTo({ top: document.querySelector("#filtered-therapists").offsetTop, left: 0, behavior: 'smooth' });
}
//načita do dropdownu města
function loadLocationOptions(citiesArr) {
    let dropdownOption = '';
    for (let i = 0; i < citiesArr.length; i++) {
        dropdownOption = `<li class="map-location-option" onclick="setSelectedOption('${citiesArr[i].city}')"><p>${citiesArr[i].city/*=== "Celá ČR" ? "Online" : citiesArr[i].city*/}</p></li>`;

        locationOptions.innerHTML += dropdownOption;
    }
}

if (mapContainer !== null) {
    mapContainer.addEventListener("mousemove", (e) => {
        let cursorX = e.pageX;
        let cursorY = e.pageY;

        bruhText.style.display = "block";
        bruhText.style.position = "absolute";
        bruhText.style.left = (cursorX + 10) + "px";
        bruhText.style.top = (cursorY + 20) + "px";
    });

    mapContainer.addEventListener("mouseleave", () => {
        bruhText.style.display = "none";
        bruhText.innerHTML = "";
    });
    mapContainer.addEventListener("click", () => {
        selectedLocationOption.innerHTML = "Vyberte město...";
    });

    districtsArray.forEach(_item => {
        if (document.querySelector(_item.elementID) !== null) {
            let filteredTherapistsList = filterTherapistsByDistrict(_item.district);
            let therapistsList = filterTherapistsByDistrict("");
            if (filteredTherapistsList.length <= 0) {
                document.querySelector(_item.signID).style.display = "none";
            }
            filteredTherapistsList = new Set(filteredTherapistsList.concat(filterTherapistsByDistrict("Celá ČR")));
            filteredTherapistsList = [...filteredTherapistsList];

            document.querySelector(_item.elementID).addEventListener("click", () => {
                therapistsList.forEach(_therapist => {
                    document.querySelector(_therapist).style.display = "none";
                });
                filteredTherapistsList.forEach(_therapist => {
                    document.querySelector(_therapist).style.display = "flex";
                });
                districtsArray.forEach(_district => {
                    if (_item.elementID === "#part-cela-cr") {
                        document.querySelector(_district.elementID).classList.add("active");
                    } else {
                        if (_item.elementID === _district.elementID) {
                            document.querySelector(_district.elementID).classList.add("active");
                        } else {
                            document.querySelector(_district.elementID).classList.remove("active");
                        }
                    }
                });
                window.scrollTo({ top: document.querySelector("#filtered-therapists").offsetTop, left: 0, behavior: 'smooth' });
            });
            document.querySelector(_item.signID).addEventListener("click", () => {
                triggerEvent(document.querySelector(_item.elementID), "click");
            });
            document.querySelector(_item.signID).addEventListener("mouseover", () => {
                bruhText.innerHTML = _item.district;
            });
            document.querySelector(_item.elementID).addEventListener("mouseover", () => {
                bruhText.innerHTML = _item.district;
            });
        }
    });

    loadLocationOptions(citiesArray);

    selectedLocationOption.addEventListener("click", () => {
        locationOptions.style.display = (locationOptions.style.display === "block" ? "none" : "block");
        districtsArray.forEach(_district => {
            document.querySelector(_district.elementID).classList.remove("active");
        });
    });

}