const config = {
	apiUrl: "https://restcountries.com/v3.1/all",
	initLoad: 250,
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
			nat: "Native Name",
			sub: "Sub Region",
			TLD: "Top Level Domain",
			cur: "Currencies",
			lng: "Languages",
			bdc: "Border Countries",

			title: "Where's in the world?",
			moon: ["Dark Mode", "Light Mode"],
			back: "Back",
			search: "Search for a country...",
			filter: "Filter by Region",

			warn: "Impossible read information about: ",
		},
		por: {
			display: "Países Carregados",
			pop: "População",
			reg: "Região",
			cap: "Capital",
			nat: "Nome Nativo",
			sub: "Sub-Região",
			TLD: "Domínio de Nível Superior",
			cur: "Moedas",
			lng: "Línguas",
			bdc: "Paises Fronteiriços",

			title: "Onde está no mundo?",
			moon: ["Modo Escuro", "Modo Claro"],
			back: "Voltar",
			search: "Procure por um país...",
			filter: "Filtrar por Região",

			warn: "Impossível ler informações sobre: ",
		},
	},
}

const containerSection = document.querySelector(".containerSection")
const container = document.querySelector(".container")

const handleFetch = async () => {
	const apiJson = await fetch(config.apiUrl)
		.then((res) => res.json())
		.catch((err) => err)

	if (apiJson.name == "TypeError") {
		errorToFetch(apiJson)
	} else {
		mainLoad(apiJson)
	}

	config.apiResponse = apiJson
}
handleFetch()

const errorToFetch = (err) => {
	const errorImage = document.createElement("img")
	errorImage.classList.add("errorImage")
	errorImage.src = "./img/error404.png"

	containerSection.removeChild(container)
	containerSection.appendChild(errorImage)

	console.table(err)
}

const mainLoad = (resp) => {
	const filtered = resp
	config.loadedValue = 0
	container.innerHTML = ""
	searchBar.value = ""

	for (let i = 0; i < config.initLoad; i++) {
		handleDrawBox(filtered[i])
	}
}

const handleDrawBox = (country, className) => {
	if (typeof country == "string") {
		console.warn(country)
		return alert(config.idiom[`${config.selectedIdiom}`].warn + country)
	}

	let abbr = country.name.nativeName ? findNativeName(country.name.nativeName) : "There's no abreviation avaiable"
	let nat = abbr == "There's no abreviation avaiable" ? "There's no nat avaiable" : country.name.nativeName[abbr].official
	let subRegion = country.subregion
	let currencies = findCurrencies(country.currencies)
	let languages = findLanguages(country.languages)
	let bdcArray = findBdc(country.borders)
	let capital = country.capital || "Capital info is not avaiable."
	let tld = country.tld[0]
	let population = country.population
	let region = country.region

	const infoList = config.idiom[`${config.selectedIdiom}`]
	const name = idiomName(country)

	const mainDiv = document.createElement("div")
	mainDiv.classList.add("box")

	const flag = document.createElement("img")
	flag.src = country.flags.png
	flag.alt = name
	mainDiv.appendChild(flag)

	const textArea = document.createElement("div")
	textArea.classList.add("textArea")
	textArea.innerHTML = `
		<h3>${name}</h3>
		<p><strong>${infoList.pop}: </strong>${country.population}</p>
		<p><strong>${infoList.reg}: </strong>${country.region}</p>
		<p><strong>${infoList.cap}: </strong>${country.capital}</p>
    `
	mainDiv.appendChild(textArea)

	if (className) {
		mainDiv.classList.add(className)
		mainDiv.classList.remove("box")

		textArea.innerHTML = `
			<h3>${name}</h3>

			<div class="middleDiv">
				<div class="infoLeft">
					<p><strong> ${infoList.nat}: </strong> ${nat} </p>
					<p><strong> ${infoList.pop}: </strong> ${population} </p>
					<p><strong> ${infoList.reg}: </strong> ${region} </p>
					<p><strong> ${infoList.sub}: </strong> ${subRegion} </p>
					<p><strong> ${infoList.cap}: </strong> ${capital} </p>
				</div>
					
				<div class="infoRight">
					<p><strong> ${infoList.TLD}: </strong> ${tld} </p>
					<p><strong> ${infoList.lng}: </strong> ${languages} </p>
					<p><strong> ${infoList.cur}: </strong> ${currencies} </p>
				</div>
			</div>
		`

		const bdcDiv = document.createElement("div")
		bdcDiv.classList.add("bdcDiv")
		bdcDiv.innerHTML = `<p><strong> ${infoList.bdc}: </strong></p>`
		const bdcPar = document.createElement("p")

		bdcArray.forEach((el) => {
			const bdcSpan = document.createElement("span")
			bdcSpan.innerHTML = idiomName(el)
			bdcSpan.addEventListener("click", () => boxInfo(el, false))
			bdcPar.appendChild(bdcSpan)
		})
		bdcDiv.appendChild(bdcPar)
		textArea.appendChild(bdcDiv)

		if (containerSection.hasChildNodes()) {
			containerSection.removeChild(containerSection.lastElementChild)
		}
		containerSection.appendChild(mainDiv)
	} else {
		mainDiv.addEventListener("click", () => boxInfo(country, true))
		container.appendChild(mainDiv)
		config.loadedValue++
		loadedCountries[1].innerHTML = config.loadedValue
	}

	setTimeout(() => {
		mainDiv.style.opacity = 1
	}, 125 * config.loadedValue)
}

const findNativeName = (obj) => {
	return String(Object.keys(obj)[0])
}

const findCurrencies = (obj) => {
	if (obj == undefined) {
		return "Currencies info is not avaiable."
	}

	return Object.entries(obj)
		.map((el) => el[1].name)
		.join(", ")
}

const findLanguages = (obj) => {
	if (typeof obj == "undefined") {
		return ["Erro aqui"]
	}
	return Object.entries(obj)
		.map((el) => el[1])
		.join(", ")
}

const findBdc = (obj) => {
	let res = []

	if (obj) {
		Object.values(obj).map((myCca3) => {
			config.apiResponse.filter((el) => {
				if (el.cca3 == myCca3) {
					res.push(el)
				}
			})
		})
	} else {
		res = ["N/A"]
	}

	return res
}

const boxInfo = (obj, changeDisplaiedInputs) => {
	if (changeDisplaiedInputs == true) {
		changeInputs()
	}

	let className = "countryInfo"
	container.innerHTML = ""
	config.loadedValue = 1
	handleDrawBox(obj, className)
}

const changeInputs = () => {
	const filteringArea = [...document.querySelectorAll(".filteringArea > *")]

	filteringArea.forEach((el) => {
		el.classList.toggle("hidden")
	})
}

const idiomName = (obj) => {
	if (typeof obj == "string") {
		return obj
	} else {
		return String(config.selectedIdiom == "eng" ? obj.name.common : obj.translations[`${config.selectedIdiom}`].common)
	}
}

//Animation Search Icon & Inputs Functions
const loadedCountries = [...document.querySelectorAll(".loadedCountries > *")]
document.querySelector("#backBtn").addEventListener("click", () => {
	changeInputs()
	containerSection.innerHTML = ""
	containerSection.appendChild(container)
	mainLoad(config.apiResponse)
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

	if (text == "") return mainLoad(config.apiResponse)

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
		mainLoad(config.apiResponse)
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

// Translate existing tags
const mainTitle = document.querySelector("#mainTitle")
const changeMode = document.querySelector(".changeMode")
const backBtn = document.querySelector("#backBtn")
const filterDefault = document.querySelector("#filterDefault")
let sunMoon = "fa-moon"

const handleChangeTranslate = (evt) => {
	if (evt.target.type == "radio") {
		let radioValue = evt.target.value
		let selIdi = (config.selectedIdiom = radioValue)
		let phrase = config.idiom[`${selIdi}`]
		let sel = sunMoon == "fa-moon" ? 0 : 1

		mainTitle.innerHTML = phrase.title
		changeMode.innerHTML = `<i class="fa-regular ${sunMoon} fa-spin"></i>${phrase.moon[sel]}`
		backBtn.innerHTML = `<i class="fa-solid fa-backward fa-beat-fade"></i> ${phrase.back}`
		searchBar.setAttribute("placeholder", phrase.search)
		loadedCountries[0].innerHTML = phrase.display
		filterDefault.innerHTML = phrase.filter

		container.innerHTML = ""
		searchBar.value = ""

		mainLoad(config.apiResponse)
	}
}
chooseRadio.forEach((el) => addEventListener("click", handleChangeTranslate))

let switchPallete = true
const colorPallete = ["#ffffff", "#2b3945", "#314354", "#111517", "#fafafa", "#fafafa"]

const handleChangeMode = () => {
	sunMoon == "fa-moon" ? (sunMoon = "fa-sun") : (sunMoon = "fa-moon")
	let sel = sunMoon == "fa-moon" ? 0 : 1
	changeMode.innerHTML = '<i class="fa-regular ' + sunMoon + ' fa-spin"></i>' + config.idiom[`${config.selectedIdiom}`].moon[sel]

	const rules = document.styleSheets[0].cssRules[1].style
	const keys = []

	for (let i = 0; i < 6; i++) {
		keys.push(rules[i])
	}

	let k = 0
	for (let i = 0; i < keys.length; i++) {
		k = i

		switchPallete && (k = i + 3)
		k >= keys.length && (k -= 6)

		document.documentElement.style.setProperty(keys[i], colorPallete[k])
	}

	return (switchPallete = !switchPallete)
}
changeMode.addEventListener("click", handleChangeMode)

// obtém a variável do estilo inline
// element.style.getPropertyValue("--my-var");

// obtém variável de qualquer lugar
// getComputedStyle(element).getPropertyValue("--my-var")

// define a variável no estilo inline
// element.style.setProperty("--my-var", jsVar + 4);

// const computed = getComputedStyle(document.documentElement)
// const values = []
// values.push(computed.getPropertyValue(rules[i]))
