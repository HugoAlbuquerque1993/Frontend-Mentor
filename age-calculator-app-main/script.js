const thisYear = new Date().getFullYear()
const bonus = document.querySelector("#bonus")
const subBtn = document.querySelector(".subBtn")

const inputs = [...document.querySelectorAll("input[type='number']")]
inputs.forEach((el) => el.addEventListener("input", step01))

const myForm = document.querySelector("#myForm")
myForm.addEventListener("submit", step02)

const clearBtn = document.querySelector("#clearBtn")
clearBtn.addEventListener("click", clearAll)

const numSpan = [...document.querySelectorAll(".numSpan")]
const singPlur = [...document.querySelectorAll(".singPlur")]

function step01(e) {
	const val = e.target.value
	const id = e.target.id

	if (val.length >= 2 && id != "inpYear") {
		if (val.length == 2) {
			if (id == "inpDay" && val < 32) {
				inputs[1].focus()
			} else if (id == "inpMonth" && val < 13) {
				inputs[2].focus()
			} else {
				e.target.value = ""
			}
		} else {
			e.target.value = ""
		}
	}

	if (val.length >= 4 && id == "inpYear") {
		if (val.length == 4) {
			if (val <= thisYear) {
				subBtn.removeAttribute("disabled")
				subBtn.focus()
			} else {
				e.target.value = ""
			}
		} else {
			e.target.value = ""
		}
	}

	enableBtn()
}

function step02(e) {
	e.preventDefault()

	let myArray = []
	inputs.map((el) => {
		myArray.push(el.value)
	})

	const dateStr = myArray.join("/")
	const daysInMonth = new Date(myArray[2], myArray[1], 0).getDate()

	if (myArray[0] > daysInMonth || myArray[0] < 1 || myArray[1] < 1) {
		alert(`This date "${dateStr}" doesn't exist in the calendar.`)
		clearAll(e)
	} else {
		step03(myArray, e)
	}
}

function step03(myArray, e) {
	const userDate = new Date(myArray[2], myArray[1] - 1, myArray[0])
	const currentDate = new Date()

	const timestamp = currentDate - userDate
	const onlydays = Math.floor(timestamp / (1000 * 60 * 60 * 24))

	if (timestamp < 0) {
		return alert("Impossible to know how long someone who came from the future has lived.")
	}

	const years = Math.floor(timestamp / (1000 * 60 * 60 * 24 * 365.25))
	const months = Math.floor((timestamp % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * (365.25 / 12)))
	const days = Math.floor((timestamp % (1000 * 60 * 60 * 24 * (365.25 / 12))) / (1000 * 60 * 60 * 24))

	numSpan[0].innerHTML = years
	numSpan[1].innerHTML = months
	numSpan[2].innerHTML = days

	singPlur[0].innerHTML = years > 1 ? "years" : "year"
	singPlur[1].innerHTML = months > 1 ? "months" : "month"
	singPlur[2].innerHTML = days > 1 ? "days" : "day"

	bonus.childNodes[1].innerHTML = onlydays
	bonus.style.opacity = 1

	clearBtn.setAttribute("disabled", "disabled")
	saveText()
	clearAll(e)
}

function enableBtn() {
	let bool = [false, false, false]

	inputs.map((el, ind) => {
		if (ind == 0) {
			bool[0] = el.value.length == 2 || el.value.length == 1 ? true : false
		}
		if (ind == 1) {
			bool[1] = el.value.length == 2 || el.value.length == 1 ? true : false
		}
		if (ind == 2) {
			bool[2] = el.value.length == 4 ? true : false
		}
	})

	if (bool[0] && bool[1] && bool[2]) {
		subBtn.removeAttribute("disabled")
		clearBtn.classList.remove("ocult")
		clearBtn.removeAttribute("disabled")
	} else {
		subBtn.setAttribute("disabled", "disabled")
	}
}

function clearAll(e) {
	inputs.forEach((el) => {
		el.value = ""
	})

	e.target.setAttribute("disabled", "disabled")
	inputs[0].focus()
	clearBtn.classList.add("ocult")

	if (e) {
		if (e.target.id == "clearBtn") {
			numSpan.forEach((el) => {
				el.innerHTML = "--"
			})

			singPlur.forEach((el, ind) => {
				ind == 0 ? (el.innerHTML = "years") : ind == 1 ? (el.innerHTML = "months") : (el.innerHTML = "days")
			})
		}
		bonus.style.opacity = 0
	}

	enableBtn()
	saveText()
}

//
function saveText() {
	const elArray = []
	const textArray = []

	;[...document.querySelectorAll(".result h2")].forEach((h2) => {
		;[...h2.children].forEach((span) => {
			let myText = span.innerHTML
			span.innerHTML = ""
			elArray.push(span)
			textArray.push(myText)
		})
	})

	drawText(elArray, textArray, 125)
}

function drawText(elArray, textArray, setTime) {
	let time = setTime ? setTime : 125
	let count = 1

	textArray.forEach((text, ind) => {
		for (i of text) {
			let letter = i

			setTimeout(function () {
				elArray[ind].innerHTML += letter
			}, setTime * count)
			count++
		}
	})
}
