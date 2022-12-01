let modalKey = 0

let quantburgers = 1

let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.burgerWindowArea').style.opacity = 0 // transparente
    seleciona('.burgerWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.burgerWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.burgerWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.burgerWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.burgerInfo--cancelButton, .burgerInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasburgers = (burgerItem, item, index) => {
	burgerItem.setAttribute('data-key', index)
    burgerItem.querySelector('.burger-item--img img').src = item.img
    burgerItem.querySelector('.burger-item--price').innerHTML = formatoReal(item.price[2])
    burgerItem.querySelector('.burger-item--name').innerHTML = item.name
    burgerItem.querySelector('.burger-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.burgerBig img').src = item.img
    seleciona('.burgerInfo h1').innerHTML = item.name
    seleciona('.burgerInfo--desc').innerHTML = item.description
    seleciona('.burgerInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    let key = e.target.closest('.burger-item').getAttribute('data-key')
    console.log('burger clicada ' + key)
    console.log(burgerJson[key])

    quantburgers = 1

    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    seleciona('.burgerInfo--size.selected').classList.remove('selected')

    selecionaTodos('.burgerInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = burgerJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    selecionaTodos('.burgerInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            seleciona('.burgerInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')

            seleciona('.burgerInfo--actualPrice').innerHTML = formatoReal(burgerJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    seleciona('.burgerInfo--qtmais').addEventListener('click', () => {
        quantburgers++
        seleciona('.burgerInfo--qt').innerHTML = quantburgers
    })

    seleciona('.burgerInfo--qtmenos').addEventListener('click', () => {
        if(quantburgers > 1) {
            quantburgers--
            seleciona('.burgerInfo--qt').innerHTML = quantburgers	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.burgerInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("burger " + modalKey)
	    let size = seleciona('.burgerInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
    	console.log("Quant. " + quantburgers)
        let price = seleciona('.burgerInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
	    let identificador = burgerJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantburgers
        } else {
            let burger = {
                identificador,
                id: burgerJson[modalKey].id,
                size, 
                qt: quantburgers,
                price: parseFloat(price) 
            }
            cart.push(burger)
            console.log(burger)
            console.log('Sub total R$ ' + (burger.qt * burger.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' 
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' 
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
	seleciona('.menu-openner span').innerHTML = cart.length
	
	if(cart.length > 0) {

		seleciona('aside').classList.add('show')

		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

		for(let i in cart) {
			let burgerItem = burgerJson.find( (item) => item.id == cart[i].id )
			console.log(burgerItem)

        	subtotal += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let burgerSizeName = cart[i].size

			let burgerName = `${burgerItem.name} (${burgerSizeName})`

			cartItem.querySelector('img').src = burgerItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = burgerName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				cart[i].qt++
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					cart[i].qt--
				} else {
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		desconto = subtotal * 0
		total = subtotal - desconto

		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {

    seleciona('.cart--finalizar').addEventListener('click', () => {
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    window.open("https://wa.me/+5545989384983?text=Muito obrigado por comprar na Dunkel, agradecemos a preferencia, em braeve seu pedido sera enviado")

    })
}


burgerJson.map((item, index ) => {
    let burgerItem = document.querySelector('.models .burger-item').cloneNode(true)
    seleciona('.burger-area').append(burgerItem)

    preencheDadosDasburgers(burgerItem, item, index)
    
    burgerItem.querySelector('.burger-item a').addEventListener('click', (e) => {
        e.preventDefault()

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

        preencherTamanhos(chave)

		seleciona('.burgerInfo--qt').innerHTML = quantburgers

        escolherTamanhoPreco(chave)

    })

    botoesFechar()

}) 

mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
