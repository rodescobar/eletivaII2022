/******************************************* 
 * Variáveis globais
********************************************/
var jogo_iniciado = false

var velocidade_player = 8
var vel_nave_inimigo = 2
var vel_tiro_nave_in = 3

var podeAtirar = true

var fase = 5
var aux = 1

var teclas = {
    W: 87,
    A: 65,
    D: 68,
    S: 83,
    T: 32
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

//Iniciar o jogo
$(document).keydown(function ( e ) {
    if ( e.keyCode == 13 ) {
        if (!jogo_iniciado) { //if (jogo_iniciado == false)
            $("#iniciar").remove()
            start()
        }   
    }
})

/******************************************* 
 * Código
********************************************/
function start() {
    $("#area_jogo").append('<div class="player" id="player"></div>')
    $("#area_jogo").append('<div class="pessoa" id="pessoa"></div>')
    $("#area_jogo").append('<div class="tanque" id="tanque"></div>')

    jogo_iniciado = true
}

function GameEngine() {
    if (!jogo_iniciado)
        return false

    movimentaCenario()
    movimentaPlayer()
    movimentaNave()
    movimentaTiroInimigo()
    movimentaTiro()
    colisao()
}

function movimentaCenario() {
    var posicao_atual = $('#area_jogo').css("background-position")
    posicao_atual = parseInt( posicao_atual )
    
    $('#area_jogo').css("background-position", posicao_atual - fase )
}

//Movimenta o jogador
function movimentaPlayer() {
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

    if ( jogo.pressionou[ teclas.T ] && podeAtirar == true ) {
        podeAtirar = false
    }
}

//Movimentar a nave
function movimentaNave() {
    var left = parseInt( $("#nave").css("left") )
    
    if ( $("#nave").length == 1 ) {
        if ( left <= 10 )
            $("#nave").remove()
        else
            $("#nave").css("left", left - vel_nave_inimigo)
    }
    else {
        var top = Math.random() * (200 - 0) + 0

        $("#area_jogo").append('<div class="nave" id="nave"></div>')
        $("#nave").css('top', top)
    }

}

//Movimenta tiro inimigo
function movimentaTiroInimigo() {
    var left = parseInt( $('#tiro_inimigo').css('left'))

    if ( $('#tiro_inimigo').length == 1) {
        if ( left <= 10 )
            $('#tiro_inimigo').remove()
        else
            $('#tiro_inimigo').css('left', left - vel_tiro_nave_in)
    }
    else {
        var iniTop = parseInt( $('#nave').css('top') )
        var iniLeft = parseInt( $('#nave').css('left') )

        $("#area_jogo").append('<div class="tiro_inimigo" id="tiro_inimigo"></div>')
        $('#tiro_inimigo').css('top', iniTop);
        $('#tiro_inimigo').css('left', iniLeft);
    }
}

//Movimenta Tiro player
function movimentaTiro() {

    if ( ( podeAtirar == false ) && ( $('#tiro').length == 0 )) {
        console.log( "entra ")
        var topP = parseInt( $('#player').css('top') )
        var lefP = parseInt( $('#player').css('left') )

        $("#area_jogo").append('<div class="tiro" id="tiro"></div>')
        $('#tiro').css('top', topP + 20)
        $('#tiro').css('left', lefP + 100)
    }
    else if ( $('#tiro').length == 1) {

        var left = parseInt( $('#tiro').css('left') )
        if (left <=630 )
            $('#tiro').css('left', left + 6) 
        else {
            $('#tiro').remove()
            podeAtirar = true
        }
    }

}

//Verificando colisao Aul06
function colisao() {
    //c_p_n > 0 tenho uma colisao
    var c_p_n = $("#player").collision($('#nave')).length
    var c_p_t = $("#player").collision($('#tiro_inimigo')).length
    var c_p_v = $("#player").collision($('#tanque')).length
    var c_p_p = $("#player").collision($('#pessoa')).length
    var c_t_n = $("#nave").collision($('#tiro')).length
    var c_t_v = $("#tanque").collision($('#tiro')).length

    if ( c_p_n > 0 || c_p_t > 0 || c_p_v > 0 ) {
        explodirPlayer()
    }
        
}

function explodirPlayer() {
    //Se não existir a DIV explodePlayer
    if ( $("#explodePlayer").length < 1 ) {
        $("#area_jogo").append('<div class="explodePlayer" id="explodePlayer"></div>')

        var player_top = parseInt( $('#player').css('top') )
        var player_left = parseInt( $('#player').css('left') )

        $('#explodePlayer').css("top", player_top)
        $('#explodePlayer').css("left", player_left)

        $('#player').remove()

        setTimeout(
            function() {
                $('#explodePlayer').remove()
                $("#area_jogo").append('<div class="player" id="player"></div>')
            },
            2000
        )
    }
}

setInterval(
    GameEngine,
    30
)