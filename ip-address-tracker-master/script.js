var map = L.map("map")
var myIcon = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [70, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});


var arrayIPs = []
localStorage.strIPs && (arrayIPs = JSON.parse(localStorage.strIPs))

if (arrayIPs.length < 1) {
	fetch("https://api.ipify.org?format=json")
		.then((res) => res.json())
		.then((res) => {
			let thisIP = res
			verifyArray(thisIP.ip)
		})
} else {
	verifyArray(arrayIPs[0].ip)
}

function verifyArray(ip) {
	let filtered = arrayIPs.filter((el) => {
		if (el.ip == ip) {
			return el
		}
	})

	filtered.length > 0 ? drawInterface(filtered[0]) : saveNewIP(ip)
}

async function saveNewIP(IP) {
	console.log("Consumo")
	const obj = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_WTmpOAQhlPDjugu85wBfUw1DZ4Du0&ipAddress=${IP}`)
		.then((res) => res.json())
		.then((res) => res)

	arrayIPs.push(obj)
	localStorage.strIPs = JSON.stringify(arrayIPs)
	drawInterface(obj)
}

function drawInterface(obj) {
	const textIP = document.querySelector("#textIP")
	const textLocation = document.querySelector("#textLocation")
	const textTimezone = document.querySelector("#textTimezone")
	const textISP = document.querySelector("#textISP")

	textIP.innerHTML = obj.ip
	textLocation.innerHTML = `${obj.location.city}, ${obj.location.region} (${obj.location.country})`
	textTimezone.innerHTML = `UTC ${obj.location.timezone}`
	textISP.innerHTML = obj.isp
	changeView(obj)
}

function changeView(obj) {
	console.log(obj.location)
	const location = [obj.location.lat, obj.location.lng]
	map.setView(location, 13)

	L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map)

	L.marker(location, {icon: myIcon}).addTo(map)
}

const myRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/

const inputIP = document.querySelector("#inputIP")

document.querySelector(".btnSearch").addEventListener("click", inputValidation)
function inputValidation() {
	let res = myRegex.test(inputIP.value)
	res ? verifyArray(inputIP.value) : alert("IP Incorreto")
	inputIP.value = ""
}
