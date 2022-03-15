var fase = 5
var aux = 1

function movimentaCenario() {
    var posicao_atual = $('#area_jogo').css("background-position")
    posicao_atual = parseInt( posicao_atual )
    
    $('#area_jogo').css("background-position", posicao_atual - fase )

    if ( aux >= 100) {
        fase = fase + 10
        aux = 1
    }

    aux++ 
}

setInterval(
    movimentaCenario,
    30
)