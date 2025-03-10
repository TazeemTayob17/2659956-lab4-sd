document.getElementById("submit-button").addEventListener("click", fetchCountryData);

function fetchCountryData() {
    const countryName = document.getElementById("country-name").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    const countryInfoSection = document.getElementById("country-info");
    const bordersSection = document.getElementById("bordering-countries");
    const borderList = document.getElementById("border-list");

    countryInfoSection.innerHTML = "Loading...";
    bordersSection.innerHTML = "";

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error("Country not found");
            return response.json();
        })
        .then(data => {
            const country = data[0];
            const { name, capital, population, region, flags, borders } = country;
            

            countryInfoSection.innerHTML = `
                <ul id="border-list">
                    <li>Capital: ${capital ? capital[0] : "N/A"}</li>
                    <li>Population: ${population.toLocaleString()}</li>
                    <li>Region: ${region}</li>
                    <li>Flag: <br> <img src="${flags.svg}" alt="Flag of ${name.common}"> </li>
                </ul>
            `;

            if (borders && borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
                    .then(response => response.json())
                    .then(borderCountries => {
                        bordersSection.innerHTML = "<li>Bordering Countries:</li> <br><br>";
                        borderCountries.forEach(borderCountry => {
                            bordersSection.innerHTML += `
                                <ul id="border-list">
                                    <li>${borderCountry.name.common}:</li>
                                    <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}">
                                </ul>
                            `;
                        });
                    });
            } else {
                bordersSection.innerHTML = "<p>No bordering countries.</p>";
            }
        })
        .catch(error => {
            countryInfoSection.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}
