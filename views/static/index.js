var carrinhoAtual = []
var carrinhoTable = []
var media1200 = window.matchMedia("(max-width: 1200px)")
var media700 = window.matchMedia("(max-width: 700px)")
var media300 = window.matchMedia("(max-width: 300px)")
var tamanhoBaseTipos = 105
var widthCard = 300
alterarTamanhoModal()
buscarItens(0)
retirarMenu()
media300.addListener(alterarTamanhoModal)
media700.addListener(retirarMenu)
media700.addListener(alterarTamanhoModal)
media1200.addListener(alterarTamanhoModal)
media1200.addListener(retirarMenu)

$('.themeRange').on('click', () => {
    if($('.theme').css('right') == '33px'){
        SetTheme('dark', 'light')
        $('.theme').css('right', '1px')
        return
    }
    SetTheme('light', 'dark')
    $('.theme').css('right', '33px')
})

function SetTheme(temaAntigo, temaNovo) {
    let rul = window.document.styleSheets
    for (i = 0; i < rul.length; i++) {
        let rules = rul[i].cssRules;
        for (j = 0; j < rules.length; j++) {
            media = rules[j].media
            if (media == undefined) {
                continue
            }
            if(rules[j].media.mediaText == '(prefers-color-scheme: dark)' || rules[j].media.mediaText == '(prefers-color-scheme: light)'){
                rules[j].media.mediaText = rules[j].media.mediaText.replace(`prefers-color-scheme: ${temaAntigo}`, `prefers-color-scheme: ${temaNovo}`)
                break
            }
        }
    }
}

$(window).on("load", async function(){
    const resposta = await $.ajax({
        url: 'https://gustakx36.pythonanywhere.com/type',
        dataType: 'json',
        method: 'GET'
    });
    let itensHtml = `<h1 class="busca cursor-pointer text-xl p-2 hover:bg-blue-600 rounded-md mt-1" id="busca0" onclick="buscarItens(0)">Todos</h1>`
    tamanhoBaseTipos += 48
    for(let i = 0; i < resposta.length; i++){
        const item = resposta[i]
        tamanhoBaseTipos += 48
        itensHtml += `<h1 class="busca cursor-pointer text-xl p-2 hover:bg-blue-600 rounded-md mt-1" id="busca${item.id}" onclick="buscarItens(${item.id})">${item.descricao}</h1>`
    }
    $('#submenu').html(itensHtml);
    $('#subMenuSuperior').html(itensHtml);
})
$('.finalizarPedido').on('click', async function(){
    if($('.finalizarPedido').hasClass('cursor-not-allowed')){
        return;
    }
    $('.modalObservacaoF').css('display', 'flex')
    $('.modalTextF').html(montarTable())
    $('body').css('overflow', 'hidden')
    setTimeout(() => {
        $('.modalBaseF').css('transform', 'scale(1)')
    }, 50)
})
$('.menu').on('click', function(){
    if($('.menu').css('left') == '310px') {
        $('.sidebar').css('left', '-300px')
        $('.apoio').css('min-width', '0px')
        $('.menu').css('left', '0px')
        $('.menu').css('transform', 'rotate(0deg)')
    }else{
        $('.sidebar').css('left', '0px')
        $('.apoio').css('min-width', '300px')
        $('.menu').css('left', '310px')
        $('.menu').css('transform', 'rotate(180deg)')
    }
})
$('.menuColapsSuperior').on('click', function(){
    if($('.menuColapsSuperior').css('transform') == 'matrix(0, 0.7, -0.7, 0, 0, 0)') {
        $('.menuColapsSuperior').css('transform', 'scale(0.7) rotate(270deg)')
        $('.menuColapsSuperiorDiv').css('z-index', '10000')
        $('.menuSuperior').css('height', tamanhoBaseTipos + 'px')
    }
    if($('.menuColapsSuperior').css('transform') == 'matrix(0, -0.7, 0.7, 0, 0, 0)'){
        $('.menuColapsSuperior').css('transform', 'scale(0.7) rotate(90deg)')
        $('.menuSuperior').css('height', '0px')
        setTimeout(() => {
            $('.menuColapsSuperiorDiv').css('z-index', '10')
        }, 300)
        
    }
})
function montarTable(){
    if(carrinhoAtual.length <= 0){
        $('.valorTotal').html('R$0,00')
        $('.finalizarPedido').toggleClass('cursor-not-allowed')
        fecharModalF()
        return
    }
    let valorTotal = 0
    let table = `
        <div class="bg-orange-600 dark:bg-orange-700" style="
            height: 144px; 
            overflow: auto; 
            padding: 26px 20px 0 20px;
            border-top: solid 0px;
            border-radius: 12px 12px 0 0;
            margin: 6px 0px 14px 2%;
            width: 96%;">
            <table  class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-black-700 uppercase bg-red-50 dark:bg-red-700 dark:text-black-400">
                    <tr>`
    Object.keys(carrinhoTable[0]).forEach((item) => {
        table += `<th scope="col" class="px-6 py-3">${item}</th>`
    })
    table += `  
                        <th scope="col" class="px-6 py-3"></th>
                    <tr>
                </thead>
                <tbody class="bg-red-50 dark:bg-red-700">`
    for(var i = 0; i < carrinhoTable.length; i++){
        table += `
                    <tr scope="col" class="px-6 py-3">`
        Object.keys(carrinhoTable[i]).forEach((item) => {
            if(item == 'preco'){
                valorTotal += carrinhoTable[i][item]
            }
            table += `<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${carrinhoTable[i][item]}</td>`
        })
        table += `
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" style="display: flex; justify-content: center;">
                            <button class="dark:bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onclick="deletarItemCarrinho(${i})">
                                ${svgLixeira}
                            </button>
                        </td>
                    </tr>`
    }
    table += `
                </tbody>
            </table>
        </div>
        <div class="bg-orange-600 dark:bg-orange-700" style="
            margin-top: 4px;
            padding: 0px 20px 26px 20px;
            border-top: solid 0px;
            border-radius: 0 0 12px 12px;
            margin: 6px 0px 14px 2%;
            width: 96%;">
            <table  class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-black-700 uppercase bg-red-50 dark:bg-red-700 dark:text-black-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Valor Total</th>
                        <th>${valorTotal.toFixed(2)}</th>
                    </tr>
                </thead>
            </table>
        </div>`
    return table
}
function retirarMenu() {
    if(media700.matches){
        $('.sidebar').css('left', '-300px')
        $('.apoio').css('min-width', '0px')
        $('.menu').css('display', 'none')
        $('.menuSuperior').css('display', 'flex')
        $('.menuColapsSuperiorDiv').css('display', 'flex')
        $('.widthCard').css('width', '170px')
        $('.imgCard').css('height', '170px')
        $('.sacola').css('width', '40px')
        $('.finalizarPedido').css('transform', 'scale(0.8)')
        $('.valorTotal').css('font-size', '25px')
        $('.finalizarPedido').css('font-size', '15px')
        $('.finalizarPedido').css('min-width', '160px')
        $('.themeRange').css('left', '0')
        $('.themeRange').css('right', '')
        return
    }else{
        $('.menu').css('display', 'block')
        $('.menuSuperior').css('height', '0px')
        $('.menuColapsSuperior').css('transform', 'scale(0.7) rotate(90deg)')
        $('.menuSuperior, .menuColapsSuperiorDiv').css('display', 'none')
        $('.widthCard').css('width', '300px')
        $('.imgCard').css('height', '300px')
        $('.sacola').css('width', '70px')
        $('.finalizarPedido').css('transform', 'scale(1.0)')
        $('.valorTotal').css('font-size', '1.875rem')
        $('.finalizarPedido').css('font-size', '100%')
        $('.finalizarPedido').css('min-width', '190px')
        $('.themeRange').css('right', '0')
        $('.themeRange').css('left', '')
    }
    if(media1200.matches) {
        $('.sidebar').css('left', '-300px')
        $('.apoio').css('min-width', '0px')
        $('.menu').css('left', '0px')
        $('.menu').css('transform', 'rotate(0deg)')
    }else {
        $('.sidebar').css('left', '0px')
        $('.apoio').css('min-width', '300px')
        $('.menu').css('left', '310px')
        $('.menu').css('transform', 'rotate(180deg)')
    }
}
function addItemCarrinho(id, preco, nome){
    $('.finalizarObservacao').attr('id', JSON.stringify({id : id, preco : preco, nome : nome}));
    $('.modalObservacao').css('display', 'flex')
    $('body').css('overflow', 'hidden')
    setTimeout(() => {
        $('.modalBase').css('transform', 'scale(1)')
    }, 50)
}
function atualizarCarrinho(preco){
    const valorAtual = parseFloat($('.valorTotal').html().replace('R$', '').replace(',', '.'))
    const valorNovo = valorAtual + preco
    if(valorNovo > 0){
        $('.finalizarPedido').removeClass('cursor-not-allowed')
    }
    $('.valorTotal').html(`R$${valorNovo.toFixed(2).replace('.', ',')}`)
}
function deletarItemCarrinho(id){
    carrinhoAtual.splice(id, 1)
    carrinhoTable.splice(id, 1)
    $('.modalTextF').html(montarTable())
}
function finalizarObs(id){
    const objetoProduto = JSON.parse(id)
    const observacao = $('#observacao').val()
    carrinhoTable.push({nome : objetoProduto.nome, preco : objetoProduto.preco})
    carrinhoAtual.push({observacao : observacao, id_produto : objetoProduto.id, preco : objetoProduto.preco})
    fecharModal()
    atualizarCarrinho(objetoProduto.preco)
    $('#observacao').val('')
}
function fecharModal(){
    $('.finalizarObservacao').attr('id', '');
    $('.modalBase').css('transform', 'scale(0)')
    $('body').css('overflow', 'auto')
    setTimeout(() => {
        $('.modalObservacao').css('display', 'none')
    }, 300)
}
async function finalizarObsF(){
    if($('#nome').val() == ''){
        return Swal.fire({
            icon: 'warning',
            title: 'É preciso um nome para finalizar o pedido!'
        })
    }
    const data = {pedidos : carrinhoAtual, nome_cliente : $('#nome').val()}
    const resposta = await $.ajax({
        url: 'https://gustakx36.pythonanywhere.com/orders/',
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(data)
    });
    if(resposta.response){
        Swal.fire({
            icon: 'success',
            title: 'Pedido finalizado!'
        })
    }
    carrinhoAtual = []
    $('.valorTotal').html('R$0,00')
    $('.finalizarPedido').toggleClass('cursor-not-allowed')
    fecharModalF()
}
function fecharModalF(){
    $('.finalizarObservacaoF').attr('id', '');
    $('.modalBaseF').css('transform', 'scale(0)')
    $('body').css('overflow', 'auto')
    setTimeout(() => {
        $('.modalObservacaoF').css('display', 'none')
    }, 300)
}
function alterarTamanhoModal(){
    if(media300.matches){
        $('.uniText').css('font-size', '20px')
    }else{
        $('.uniText').css('font-size', '30px')
    }
    if(media1200.matches && media700.matches){
        $('.modalBase').css('width', '90%')
        $('.modalBaseF').css('width', '90%')
    }else if(media1200.matches) {
        $('.modalBase').css('width', '70%')
        $('.modalBaseF').css('width', '70%')
    }else{
        $('.modalBase').css('width', '50%')
        $('.modalBaseF').css('width', '50%')
    }
}
async function buscarItens(id){
    if(media700.matches){
        $('.menuSuperior').css('height', '0px')
        $('.menuColapsSuperior').css('transform', 'scale(0.7) rotate(90deg)')
    }
    $('.itens').css('opacity', '0')
    const resposta = await $.ajax({
        url: 'https://gustakx36.pythonanywhere.com/product/ativo/',
        dataType: 'json',
        method: 'GET'
    });
    let itensHtml = ''
    for(let i = 0; i < resposta.length; i++){
        if(resposta[i].tipo_produto == id || id == 0){
            const item = resposta[i]
            itensHtml += `
                <div onmouseleave="mouseLeave(this)" onmouseenter="mouseEnter(this)" class="item bg-orange-400 dark:bg-orange-600 rounded-lg px-6 py-8 shadow-xl">
                    <div class="widthCard imgCard" style="
                        width: 300px;
                        height:  auto;
                        display: flex;
                        justify-content: center;
                        ">
                        <span class="flex justify-center">
                            <img src="${item.imagem}">
                        </span>
                    </div>
                    <h3 class="widthCard text-slate-900 dark:text-white mt-5 text-xl font-medium tracking-tight"  style="width: 300px;">${item.nome} - R$${item.preco.replace('.', ',')}</h3>
                    <p class="widthCard descricao text-slate-950 dark:text-white mt-2 text-base" style="width: 300px;">
                    ${item.descricao}
                    </p>
                    <div class="widthCard" style="
                        width: 300px;
                        display: flex;
                        justify-content: end;
                        margin-top: 13px;
                        ">
                        <div class="itemAdd p-2 bg-red-500 dark:bg-red-600 rounded-md shadow-lg" onclick="addItemCarrinho(${item.id}, ${item.preco}, '${item.nome}')">
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path style="stroke: #e7de04;" d="M4 12H20M12 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>`
        }
    }
    $('#itens').html(itensHtml)
    $('.itens').css('opacity', '1')
    retirarMenu()
}
function mouseLeave(elemento){
    elemento.children[2].style.maxHeight = '0px'
}
function mouseEnter(elemento){
    elemento.children[2].style.maxHeight = '100px'
}
const svgLixeira = `
<svg fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
<g>
	<g>
		<path d="M405.43,93.499V71.437c0-31.321-24.949-56.378-56.27-56.378h-63.278C284.563,5.792,277.403,0,268.742,0h-25.484    c-8.661,0-15.821,5.792-17.138,15.059h-63.278c-31.322,0-56.271,25.057-56.271,56.378v22.062    c-6.95,2.466-11.566,8.806-11.566,16.261c0,7.658,4.828,14.146,11.707,16.459l10.579,319c1.252,37.539,31.589,66.78,69.149,66.78    h139.123c37.56,0,67.964-29.241,69.216-66.78l10.512-319.083c6.878-2.313,11.706-8.718,11.706-16.377    C416.996,102.305,412.38,95.964,405.43,93.499z M360.046,444.203c-0.624,18.703-15.772,33.046-34.485,33.046H186.439    c-18.712,0-33.86-14.343-34.486-33.045l-10.576-316.783h229.245L360.046,444.203z M370.679,92.67H141.321V71.437    c0-12.159,9.36-21.627,21.519-21.627H349.16c12.159,0,21.519,9.467,21.519,21.627V92.67z"/>
	</g>
</g>
<g>
	<g>
		<path d="M209.137,214.323c-0.188-9.594-8.117-17.22-17.713-17.032c-9.595,0.188-17.219,8.118-17.032,17.713l3.854,196.56    c0.185,9.479,7.928,17.035,17.365,17.035c0.116,0,0.232-0.001,0.347-0.003c9.595-0.188,17.219-8.118,17.032-17.713    L209.137,214.323z"/>
	</g>
</g>
<g>
	<g>
		<path d="M256,198.081c-9.596,0-17.376,7.78-17.376,17.376v195.765c0,9.596,7.78,17.376,17.376,17.376    c9.596,0,17.376-7.78,17.376-17.376V215.457C273.376,205.861,265.596,198.081,256,198.081z"/>
	</g>
</g>
<g>
	<g>
		<path d="M320.576,197.291c-0.117-0.002-0.231-0.003-0.348-0.003c-9.436,0-17.18,7.557-17.365,17.035l-3.854,196.561    c-0.188,9.595,7.437,17.525,17.031,17.713c0.117,0.002,0.231,0.003,0.348,0.003c9.436,0,17.18-7.557,17.365-17.035l3.854-196.561    C337.795,205.41,330.171,197.479,320.576,197.291z"/>
	</g>
</g>
</svg>`
