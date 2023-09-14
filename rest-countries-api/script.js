console.clear()

const searchIcon = document.querySelector(".searchIcon")
const searchBar = document.querySelector("#searchBar")
searchBar.addEventListener("focus", () => {
	searchIcon.classList.add("fa-bounce")
})
searchBar.addEventListener("focusout", () => {
	searchIcon.classList.remove("fa-bounce")
})

let limit = 11

const container = document.querySelector(".container")

const errorToFetch = (err) => {
	const containerSection = document.querySelector(".containerSection")

	const errorImage = document.createElement("img")
	errorImage.src = "./img/error404.png"
	errorImage.style = `
        width: 90%;
        background-color: #ffffff20;
        border-radius: 50px;
    `

    containerSection.removeChild(container)
	containerSection.appendChild(errorImage)

    console.table(err)
}

const handleFetch = async () => {
	const apiJson = await fetch("https://restcountries.com/v3.1/all")
		.then((res) => res.json())
		.catch((err) => err)

	if (apiJson.name == "TypeError") {
		errorToFetch(apiJson)
	} else {
		handleFilter(apiJson)
	}

	return apiJson
}

const handleFilter = (resp) => {
	const filtered = resp

	for (let i = 0; i < limit; i++) {
		handleDrawBox(filtered[i])
	}
}

const handleDrawBox = (country) => {
	console.log(country)

	const mainDiv = document.createElement("div")
	mainDiv.classList.add("box")

	const flag = document.createElement("img")
	flag.src = country.flags.png
	mainDiv.appendChild(flag)

	const textArea = document.createElement("div")
	textArea.innerHTML += `
        <h3>${country.name.common}</h3>
        <p><strong>Population: </strong>${country.population}</p>
        <p><strong>Region: </strong>${country.region}</p>
        <p><strong>Capital: </strong>${country.capital}</p>
    `
	mainDiv.appendChild(textArea)

	container.appendChild(mainDiv)
}

const apiResponse = handleFetch()
