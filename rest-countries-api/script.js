let config = {
  apiUrl: "https://restcountries.com/v3.1/all",
  initLoad: 250,
  loadedValue: 0,
  regList: [],
  selectedRegion: "null",
  selectedIdiom: "eng",
  sunMoonIcon: "fa-moon",
  countryShown: undefined,
}

const idiom = {
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
    knowMoreBtnTxt: "Know More About (External Link)",
    notWorkingBtnTxt: "Not working?",
    notWorkingContentTxt: `
			<h2> Page not found? </h2>
			<p> - The button on the right opens an external page that shows historical information about the country in website history.state.gov. Did you click the button on the right and, after the new tab opened, the page didn't find the country you were searching for? In some cases the external page will not find the country, this may happen because </p>
			<ul>
				<li> The external page may not have information about the specified country; </li>
				<li> The external page shows the original country name differently from the name provided by the API; </li>
				<li> The external page presents specific information in a grouped form; </li>
			</ul>
		`,
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
    knowMoreBtnTxt: "Saiba Mais (Link Externo)",
    notWorkingBtnTxt: "Não funciona?",
    notWorkingContentTxt: `
			<h2> Página não encontrada? </h2>
			<p> - O botão a direita abre uma página externa que mostra informações históricas sobre o país no site history.state.gov. Você clicou no botão à direita e, após a nova guia abrir, a página não encontrou o país que você estava pesquisando? Em alguns casos a página externa não encontrará o país, isso pode acontencer por alguns fatores: </p>
			<ul>
				<li> A página externa pode não ter informações sobre o país expecificado; </li>
				<li> A página externa mostra o nome do país original de forma diferente do nome fornecido pela API; </li>
				<li> A página externa apresenta informações específicas de forma agrupada; </li>
			</ul>
		`,
  },
}

const containerSection = document.querySelector(".containerSection")
const container = document.querySelector(".container")
const searchIcon = document.querySelector("#searchIcon")
const searchBar = document.querySelector("#searchBar")
const loadedCountries = [...document.querySelectorAll(".loadedCountries > *")]

const handleStart = () => {
  if (apiResponse.name == "TypeError") {
    errorOnFetch(apiResponse)
  } else {
    mainLoad(apiResponse)
  }
}

const handleFetch = async () => {
  //Actually the server ins't working, error 400. Because that, I'm using a .json file to simulate the API response.
  //const apiJson = await fetch("config.apiUrl")
  const apiJson = await fetch("./data.json")
    .then((res) => res.json())
    .catch((err) => err)

  return apiJson
}

let apiResponse = await handleFetch()

let fetchError = false
const errorOnFetch = (err) => {
  if (fetchError != false) {
    console.log("Error already execute")
  } else {
    fetchError = true
    const errorImage = document.createElement("img")
    errorImage.classList.add("errorImage")
    errorImage.src = "./img/error404.png"

    containerSection.removeChild(container)
    containerSection.appendChild(errorImage)

    console.table(err)
  }
}

const handleDrawBox = (country, className) => {
  if (typeof country != "object") {
    console.warn(country)
    return console.log(idiom[`${config.selectedIdiom}`].warn + country)
  }

  let abbr = findAbbr(country)
  let nat =
    abbr == "There's no abreviation avaiable" ? "There's no nat avaiable" : country.nativeName
  let subRegion = findSubregion(country)
  let currencies = findCurrencies(country)
  let languages = findLanguages(country)
  let bdcArray = findBorderCountries(country)
  let capital = country.capital ? country.capital : "Capital info is not avaiable."
  let tld = findTld(country)
  let population = country.population
  let region = country.region
  let infoList = idiom[`${config.selectedIdiom}`]
  let name = idiomName(country)

  const mainDiv = document.createElement("div")
  mainDiv.classList.add("box")

  const flag = document.createElement("img")
  flag.src = country.flags.png
  flag.alt = name + " flag"
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

const mainLoad = (resp) => {
  const filtered = resp
  config.loadedValue = 0
  container.innerHTML = ""
  searchBar.value = ""

  for (let i = 0; i < config.initLoad; i++) {
    handleDrawBox(filtered[i])
  }
}

const findNativeName = (obj) => {
  return String(Object.keys(obj)[0])
}

const findCurrencies = (obj) => {
  if (obj) {
    if (typeof obj.currencies == "undefined") {
      // console.warn(obj)
      return obj.name.common + " currencies undefined"
    } else {
      return Object.entries(obj.currencies)
        .map((el) => el[1].name)
        .join(", ")
    }
  } else {
    console.warn("The object wasn't passed to the method. findCurrencies(obj)" + obj)
    return "The object wasn't passed to the method. findCurrencies(obj)"
  }
}

const findSubregion = (obj) => {
  if (obj) {
    if (typeof obj.subregion != "undefined") {
      return obj.subregion
    } else {
      // console.warn(obj)
      return "There's no Subregion avaiable. See warning in console!"
    }
  } else {
    console.warn("The object wasn't passed to the method. findCurrencies(obj)" + obj)
    return "Object wasn't passed."
  }
}

const findLanguages = (obj) => {
  if (obj) {
    if (typeof obj.languages != "undefined") {
      let languages = obj.languages.map((el) => String(el.name)).join(", ")
      return languages
    } else {
      console.warn(obj)
      return "There's no Languages avaiable. See warning in console!"
    }
  } else {
    console.warn("The object wasn't passed to the method. findLanguages(obj)" + obj)
    return ["Object wasn't passed."]
  }
}

const findAbbr = (obj) => {
  if (obj) {
    if (obj.nativeName) {
      return findNativeName(obj.nativeName)
    } else {
      return "There's no abreviation avaiable"
    }
  } else {
    return "Object wasn't passed."
  }
}

const findTld = (obj) => {
  if (typeof obj.tld == "undefined") {
    return ["TLD Not Found"]
  }
  return obj.tld[0]
}

const findBorderCountries = (obj) => {
  let res = []

  if (obj) {
    if (typeof obj.borders == "undefined") {
      res = [{ name: "N/A" }]
    } else {
      obj.borders.forEach((border) => {
        let borderCountry = apiResponse.find((el) => el.alpha3Code == border)
        console.log(borderCountry)
        res.push(borderCountry)
      })
    }
  }

  return res
}

const boxInfo = (obj, changeDisplayedInputs) => {
  if (typeof obj != "object") {
    console.warn(obj)
    return console.log(idiom[`${config.selectedIdiom}`].warn + obj)
  }

  if (changeDisplayedInputs == true) {
    changeInputs()
  }

  let className = "countryInfo"
  container.innerHTML = ""
  config.loadedValue = 1
  config.countryShown = obj
  handleDrawBox(obj, className)
}

const changeInputs = () => {
  const filteringArea = [...document.querySelectorAll(".filteringArea > *")]

  filteringArea.forEach((el) => {
    el.classList.toggle("hidden")
  })
}

const idiomName = (obj) => {
  let objNameBrPattern = "pt"

  if (config.selectedIdiom != "eng") {
    if (obj && obj.translations) {
      return obj.translations[objNameBrPattern]
    } else {
      console.warn("Missing translations for object:", obj)
      return obj.name || ""
    }
  } else {
    return obj.name
  }
}

//External content
const knowMoreBtn = document.querySelector("#knowMoreBtn")
const notWorkingBtn = document.querySelector("#notWorkingBtn")

const notWorkingFunc = () => {
  let exitDiv = document.createElement("div")
  exitDiv.classList.add("exitDiv")

  exitDiv.addEventListener("click", (e) => {
    if (e.target.className == "exitDiv") {
      exitDiv.style.opacity = 0

      setTimeout(() => {
        document.body.removeChild(exitDiv)
      }, 10)
    }
  })
  document.body.appendChild(exitDiv)
  setTimeout(() => {
    exitDiv.style.opacity = 1
  }, 10)

  let notWorkingContent = document.createElement("div")
  notWorkingContent.classList.add("notWorkingContent")

  notWorkingContent.innerHTML = idiom[config.selectedIdiom].notWorkingContentTxt

  exitDiv.appendChild(notWorkingContent)
}

notWorkingBtn.addEventListener("click", notWorkingFunc)
const knowMoreAbout = () => {
  let externalLink = "https://history.state.gov/countries/"
  console.log(config.countryShown.name)
  let name = String(config.countryShown.name.toLowerCase())

  name = name.replace(" ", "-")

  let finalLink = externalLink + name
  window.open(finalLink, "_blank")
}
knowMoreBtn.addEventListener("click", knowMoreAbout)

//Animation Search Icon & Inputs Functions
const linkGithubBtn = document.querySelector(".linkGithubBtn")
const faGithub = document.querySelector(".fa-github")
const backBtn = document.querySelector("#backBtn")

linkGithubBtn.addEventListener("mouseover", () => {
  if (!faGithub.classList.contains("fa-flip")) faGithub.classList.add("fa-flip")
})
linkGithubBtn.addEventListener("mouseout", () => {
  if (faGithub.classList.contains("fa-flip")) faGithub.classList.remove("fa-flip")
})
backBtn.addEventListener("click", () => {
  config.countryShown = undefined
  changeInputs()
  containerSection.innerHTML = ""
  containerSection.appendChild(container)
  mainLoad(apiResponse)
})

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

  if (text == "") return mainLoad(apiResponse)

  if (config.selectedRegion == "null") {
    apiResponse.forEach((str) => {
      let name = idiomName(str).toLowerCase()

      if (name.includes(text)) handleDrawBox(str)
    })
  } else {
    config.regList.forEach((str) => {
      let name = idiomName(str).toLowerCase()

      if (name.includes(text)) handleDrawBox(str)
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
    mainLoad(apiResponse)
  } else {
    config.regList = []

    apiResponse.forEach((el) => {
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
const filterDefault = document.querySelector("#filterDefault")

const handleChangeTranslate = (evt) => {
  chooseRadio[0].previousElementSibling.removeAttribute("checked")
  chooseRadio[1].previousElementSibling.setAttribute("checked", "checked")

  let radioValue = evt ? evt.target.previousElementSibling.value : config.selectedIdiom
  config.selectedIdiom = radioValue
  let phrase = idiom[`${radioValue}`]
  let sel = config.sunMoonIcon == "fa-moon" ? 0 : 1

  mainTitle.innerHTML = phrase.title
  changeMode.innerHTML = `<i class="fa-regular ${config.sunMoonIcon} fa-spin"></i>${phrase.moon[sel]}`
  backBtn.innerHTML = `<i class="fa-solid fa-backward fa-beat-fade"></i> ${phrase.back}`
  searchBar.setAttribute("placeholder", phrase.search)
  loadedCountries[0].innerHTML = phrase.display
  filterDefault.innerHTML = phrase.filter
  ;[...knowMoreBtn.children].filter((el) => {
    if (el.localName == "span") {
      el.innerText = idiom[config.selectedIdiom].knowMoreBtnTxt
    }
  })
  ;[...notWorkingBtn.children].filter((el) => {
    if (el.localName == "span") {
      el.innerText = idiom[config.selectedIdiom].notWorkingBtnTxt
    }
  })

  container.innerHTML = ""
  searchBar.value = ""

  handleStart()
}
chooseRadio.forEach((el) => el.addEventListener("click", handleChangeTranslate))

const colorPallete = ["#ffffff", "#2b3945", "#314354", "#111517", "#fafafa", "#fafafa"]
const handleChangeMode = (evt) => {
  let switchPallete = config.sunMoonIcon != "fa-sun" ? true : false

  if (evt) {
    config.sunMoonIcon = config.sunMoonIcon == "fa-moon" ? "fa-sun" : "fa-moon"
    evt.target.setAttribute("disabled", "disabled")
    setTimeout(() => {
      evt.target.removeAttribute("disabled")
    }, 1000)
  }

  let sel = config.sunMoonIcon == "fa-moon" ? 0 : 1
  changeMode.innerHTML =
    '<i class="fa-regular ' +
    config.sunMoonIcon +
    ' fa-spin"></i>' +
    idiom[`${config.selectedIdiom}`].moon[sel]

  const rules = document.styleSheets[0].cssRules[1].style
  const keys = []

  for (let i = 0; i < 6; i++) {
    keys.push(rules[i])
  }

  for (let i = 0; i < keys.length; i++) {
    let k = i

    switchPallete && (k = i + 3)
    k >= keys.length && (k -= 6)

    document.documentElement.style.setProperty(keys[i], colorPallete[k])
  }

  switchPallete = config.sunMoonIcon != "fa-sun" ? true : false
}
changeMode.addEventListener("click", handleChangeMode)

handleStart()
