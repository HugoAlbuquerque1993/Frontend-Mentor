let limit = 12
let region = "null"
let apiResponse = []
let regionList = []
const apiUrl = "https://restcountries.com/v3.1/all"

const container = document.querySelector(".container")

const handleFetch = async () => {
	const apiJson = await fetch()
		.then((res) => res.json())
		.catch((err) => err)

	if (apiJson.name == "TypeError") {
		errorToFetch(apiJson)
	} else {
		handleFilter(apiJson)
	}

	return (apiResponse = apiJson)
}

const errorToFetch = (err) => {
	const containerSection = document.querySelector(".containerSection")

	const errorImage = document.createElement("img")
	errorImage.classList.add("errorImage")
	errorImage.src = "./img/error404.png"

	containerSection.removeChild(container)
	containerSection.appendChild(errorImage)

	console.table(err)
}

const handleFilter = (resp) => {
	const filtered = resp
	console.log(resp.length)

	for (let i = 0; i < resp.length; i++) {
		handleDrawBox(filtered[i])
	}
}

const handleDrawBox = (country) => {
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

handleFetch()

//Animation Search Icon & Inputs Functions
const searchIcon = document.querySelector("#searchIcon")
const searchBar = document.querySelector("#searchBar")
searchBar.addEventListener("focus", () => {
	searchIcon.classList.add("fa-bounce")
})
searchBar.addEventListener("focusout", () => {
	searchIcon.classList.remove("fa-bounce")
})

const handleTextFilter = (e) => {
	let text = e.target.value.toLowerCase()
	container.innerHTML = ""

	if (text == "") return handleFilter(apiResponse)

	if (region == "null") {
		apiResponse.forEach((el) => {
			let name = String(el.name.common).toLowerCase()
			if (name.includes(text)) {
				console.log(el)
				handleDrawBox(el)
			}
		})
	} else {
		regionList.forEach((el) => {
			let name = String(el.name.common).toLowerCase()
			if (name.includes(text)) {
				handleDrawBox(el)
			}
		})
	}
}
searchBar.addEventListener("input", handleTextFilter)

const filterByRegion = document.querySelector("#filterByRegion")
const handleRegionFilter = (e) => {
	searchBar.value = ""
	region = e.target.value
	container.innerHTML = ""

	if (region == "null") {
		handleFilter(apiResponse)
	} else {
		regionList = []

		apiResponse.forEach((el) => {
			if (el.region == region) {
				regionList.push(el)
				handleDrawBox(el)
			}
		})
	}
}
filterByRegion.addEventListener("change", handleRegionFilter)
