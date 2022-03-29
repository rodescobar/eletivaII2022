/******************************************* 
 * Variáveis globais
********************************************/
var jogo_iniciado = false

var velocidade_player = 8
var fase = 5
var aux = 1

var teclas = {
    W: 87,
    A: 65,
    D: 68,
    S: 83
}

var jogo = {}
jogo.pressionou = []

$(document).keydown(function ( e ) {
    jogo.pressionou[e.keyCode] = true
    //jogo.pressionou[ 87 ] = true
})

$(document).keyup(function ( e ) {
    jogo.pressionou[e.keyCode] = false
    //jogo.pressionou[ 87 ] = false
})

/******************************************* 
 * Código
********************************************/
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

    movimentaPlayer()
}

function movimentaPlayer() {
    //Iremos movimenar o joador

    if ( jogo.pressionou[ teclas.W ] ) {
        var altura = parseInt( $('#player').css("top") )

        if ( altura >= 10 )
            $('#player').css("top", altura - velocidade_player )
    }

    if ( jogo.pressionou[ teclas.S ] ) {
        var altura = parseInt( $('#player').css("top") )

        if ( altura <= 255 )
            $('#player').css("top", altura + velocidade_player )
    }

    if ( jogo.pressionou[ teclas.A ] ) {
        var left = parseInt( $('#player').css("left") )

        if ( left >= 2 )
            $('#player').css("left", left - velocidade_player )
    }

    if ( jogo.pressionou[ teclas.D ] ) {
        var left = parseInt( $('#player').css("left") )

        if ( left <= 550 )
            $('#player').css("left", left + velocidade_player )
    }

}

setInterval(
    movimentaCenario,
    30
)