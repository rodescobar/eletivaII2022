var jogo_iniciado = false

var fase = 5
var aux = 1

function start() {
    $("#area_jogo").append('<div class="player" id="player"></div>')
    $("#area_jogo").append('<div class="nave" id="nave"></div>')
    $("#area_jogo").append('<div class="pessoa" id="pessoa"></div>')
    $("#area_jogo").append('<div class="tanque" id="tanque"></div>')
    jogo_iniciado = true
}

function movimentaCenario() {

    if (!jogo_iniciado)
        return false

    var posicao_atual = $('#area_jogo').css("background-position")
    posicao_atual = parseInt( posicao_atual )
    
    $('#area_jogo').css("background-position", posicao_atual - fase )

}

setInterval(
    movimentaCenario,
    30
)