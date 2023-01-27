const click = document.querySelectorAll(".avaliacoes > span")
const avaliar = document.querySelector(".avaliar")
const ultimaCaixa = document.querySelector(".ultimaCaixa")
const extra = document.querySelector(".extra")
const resAvaliacao = document.querySelector(".resAvaliacao > span")

var nota = ""
function clicked(x) {
	for (let i = 0; i < click.length; i++) {
		if (x != i) {
			click[i].style.backgroundColor = ""
		} else {
			click[i].style.backgroundColor = "#fc7612"
		}
	}
	extra.classList.remove("extra")
	extra.classList.add("new")
	return (nota = x + 1)
}

function enviar() {
	if (nota == "") {
		return alert("Selecione um valor!")
	}
	resAvaliacao.innerHTML = nota
	avaliar.style.display = "none"
	ultimaCaixa.style.display = "flex"
}
