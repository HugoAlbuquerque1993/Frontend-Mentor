const config = {
	apiUrl: "https://restcountries.com/v3.1/all",
	loadLimit: 12,
	loadedValue: 0,
	apiResponse: [],
	regList: [],
	selectedRegion: "null",
	selectedIdiom: "eng",

	idiom: {
		eng: {
			display: "Loaded Countries",
			pop: "Population",
			reg: "Region",
			cap: "Capital",
		},
		por: {
			display: "Países Carregados",
			pop: "População",
			reg: "Região",
			cap: "Capital",
		},
	},
}

const container = document.querySelector(".container")

const handleFetch = async () => {
	const apiJson = await fetch(config.apiUrl)
		.then((res) => res.json())
		.catch((err) => err)

	if (apiJson.name == "TypeError") {
		errorToFetch(apiJson)
	} else {
		handleFilter(apiJson)
	}

	return (config.apiResponse = apiJson)
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
	config.loadedValue = 0

	for (let i = 0; i < config.loadLimit; i++) {
		handleDrawBox(filtered[i])
	}
}

const handleDrawBox = (country) => {
	const infoList = config.idiom[`${config.selectedIdiom}`]
	const name = idiomName(country)

	const mainDiv = document.createElement("div")
	mainDiv.classList.add("box")

	const flag = document.createElement("img")
	flag.src = country.flags.png
	mainDiv.appendChild(flag)

	const textArea = document.createElement("div")
	textArea.innerHTML = `
	<h3>${name}</h3>
	<p><strong>${infoList.pop}: </strong>${country.population}</p>
	<p><strong>${infoList.reg}: </strong>${country.region}</p>
	<p><strong>${infoList.cap}: </strong>${country.capital}</p>
    `
	mainDiv.appendChild(textArea)
	mainDiv.addEventListener("click", () => boxInfo(country))

	container.appendChild(mainDiv)
	config.loadedValue++
	loadedCountries[1].innerHTML = config.loadedValue

	setTimeout(() => {
		mainDiv.style.opacity = 1
	}, 250 * config.loadedValue)
}

const boxInfo = (obj) => {
	changeInputs()
}

const changeInputs = () => {
	const filteringArea = [...document.querySelectorAll(".filteringArea > *")]

	filteringArea.forEach((el) => {
		el.classList.toggle("hidden")
	})
}

const idiomName = (obj) => {
	return config.selectedIdiom == "eng" ? obj.name.common : obj.translations[`${config.selectedIdiom}`].common
}

handleFetch()

//Animation Search Icon & Inputs Functions
const loadedCountries = [...document.querySelectorAll(".loadedCountries > *")]
document.querySelector("#backBtn").addEventListener("click", () => {
	changeInputs()
})
const searchIcon = document.querySelector("#searchIcon")
const searchBar = document.querySelector("#searchBar")
searchBar.addEventListener("focus", () => {
	searchIcon.classList.add("fa-bounce")
})
searchBar.addEventListener("focusout", () => {
	searchIcon.classList.remove("fa-bounce")
})

const handleTextFilter = (evt) => {
	let text = evt.target.value.toLowerCase()
	container.innerHTML = ""
	loadedCountries[1].innerHTML = 0
	config.loadedValue = 0

	if (text == "") return handleFilter(config.apiResponse)

	if (config.selectedRegion == "null") {
		config.apiResponse.forEach((el) => {
			let name = idiomName(el).toLowerCase()

			if (name.includes(text)) handleDrawBox(el)
		})
	} else {
		config.regList.forEach((el) => {
			let name = idiomName(el).toLowerCase()

			if (name.includes(text)) handleDrawBox(el)
		})
	}
}
searchBar.addEventListener("input", handleTextFilter)

const filterByRegion = document.querySelector("#filterByRegion")
const handleRegionFilter = (evt) => {
	config.selectedRegion = evt.target.value
	searchBar.value = ""
	container.innerHTML = ""
	config.loadedValue = 0

	if (config.selectedRegion == "null") {
		handleFilter(config.apiResponse)
	} else {
		config.regList = []

		config.apiResponse.forEach((el) => {
			if (el.region == config.selectedRegion) {
				config.regList.push(el)
				handleDrawBox(el)
			}
		})
	}
}
filterByRegion.addEventListener("change", handleRegionFilter)

//Choose Radio
const chooseRadio = [...document.querySelectorAll(".chooseRadio > label")]
const changeTranslate = (evt) => {
	if (evt.target.type == "radio") {
		let radioValue = evt.target.value
		config.selectedIdiom = radioValue
		loadedCountries[0].innerHTML = config.idiom[`${config.selectedIdiom}`].display
		container.innerHTML = ""
		searchBar.value = ""
		handleFilter(config.apiResponse)
	}
}
chooseRadio.forEach((el) => addEventListener("click", changeTranslate))
