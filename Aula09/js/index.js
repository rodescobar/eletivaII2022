/******************************************* 
 * Variáveis globais
********************************************/
var jogo_iniciado = false

var velocidade_player = 8
var vel_nave_inimigo = 2
var vel_tiro_nave_in = 3
var vel_tanque = 1
var vel_pessoa = 1

var podeAtirar = true

var fase = 1
var vida = 4
var pontos = 0
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
    $("#area_jogo").append('<div class="vida" id="vida"></div>')
    $("#area_jogo").append('<div id="pontuacao"></div>')

    //$('#musica').trigger('play')

    jogo_iniciado = true
    $('#gameover').hide()
    vida = 4
    removeVida()
}

function GameEngine() {
    if (!jogo_iniciado)
        return false

    $('#pontuacao').text(pontos)

    movimentaCenario()
    movimentaPlayer()
    movimentaNave()
    movimentaTanque()
    movimentaPessoa()
    movimentaTiroInimigo()
    movimentaTiro()
    mudarFase()
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

    var top = parseInt( $('#player').css("top") )
    var left = parseInt( $('#player').css("left") )

}

//Movimentar a nave
function movimentaNave() {
    var left = parseInt( $("#nave").css("left") )
    
    if ( $("#nave").length == 1 ) {
        if ( left <= 10 )
            $("#nave").remove()
        else
            $("#nave").css("left", left - vel_tanque)
    }
    else {
        if ($('#explodeNave').length == 0 ) {
            var top = Math.random() * (200 - 0) + 0

            $("#area_jogo").append('<div class="nave" id="nave"></div>')
            $("#nave").css('top', top)
        }
    }

}


//Mudanca de fase
function mudarFase() {
    var verifica = Math.trunc( pontos / 100 ) + 1
    fase = verifica
}

//Movimenta tanque
function movimentaTanque() {
    var left = parseInt( $("#tanque").css("left") )
    
    if ( $("#tanque").length == 1 ) {
        let vel = ( fase > 3 ) ? ( 3 ) : ( fase )
        if ( left <= 10 )
            $("#tanque").remove()
        else
            $("#tanque").css("left", left - vel  )
    }
    else{
        if ($('#tanqueExplode').length == 0)
            $("#area_jogo").append('<div class="tanque" id="tanque"></div>')
        
    }
}

//Movimenta pessoa
function movimentaPessoa() {
    var left = parseInt( $("#pessoa").css("left") )
    
    if ( $("#pessoa").length == 1 ) {
        if ( left >= 580 )
            $("#pessoa").remove()
        else
            $("#pessoa").css("left", left + vel_pessoa)
    }
    else {
        if ( parseInt($('#tanque').css("left")) >= 450 ) {
            $("#area_jogo").append('<div class="pessoa" id="pessoa"></div>')
        }
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

        $('#a_laser').trigger('play')
    }
}

//Movimenta Tiro player
function movimentaTiro() {

    if ( ( podeAtirar == false ) && ( $('#tiro').length == 0 )) {
        var topP = parseInt( $('#player').css('top') )
        var lefP = parseInt( $('#player').css('left') )

        $("#area_jogo").append('<div class="tiro" id="tiro"></div>')
        $('#tiro').css('top', topP + 20)
        $('#tiro').css('left', lefP + 100)
        $('#a_tiro').trigger('play')
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
    var c_t_p = $("#tanque").collision($('#pessoa')).length

    if ( c_p_n > 0 || c_p_t > 0 || c_p_v > 0 ) {
        explodirPlayer()
    }
    
    if ( c_t_n > 0 ) {
        explodirNave()
    }

    if ( c_t_v > 0 ) {
        explodirTanque()
    }

    //Player salva pessoa
    if ( c_p_p > 0 ) {
        pontos = pontos + 20
        $('#radio').trigger('play')
        salvarPessoa()
    }

    //Tanque mata pessoa
    if ( c_t_p > 0 ) {
        $('#grito').trigger('play')
        salvarPessoa()
    }
}

function explodirPlayer() {
    //Se não existir a DIV explodePlayer
    if ( $("#explodePlayer").length < 1 ) {
        removeVida()
        if ( vida >= 0) {
            $("#area_jogo").append('<div class="explodePlayer" id="explodePlayer"></div>')

            var player_top = parseInt( $('#player').css('top') )
            var player_left = parseInt( $('#player').css('left') )

            $('#explodePlayer').css("top", player_top)
            $('#explodePlayer').css("left", player_left)


            $('#player').remove()

            $('#a_explosao').trigger('play')

            setTimeout(
                function() {
                    $('#explodePlayer').remove()

                    $("#area_jogo").append('<div class="player" id="player"></div>')
                    
                    $('#a_explosao').each(function(){
                        this.pause();
                        this.currentTime = 0;
                    }); 
                },
                2000
            )
        }
    }
}

function explodirNave() {
    if ( $("#explodeNave").length < 1 ) {
        $("#area_jogo").append('<div class="explodeNave" id="explodeNave"></div>')

        var player_top = parseInt( $('#nave').css('top') )
        var player_left = parseInt( $('#nave').css('left') )

        $('#explodeNave').css("top", player_top)
        $('#explodeNave').css("left", player_left)

        $('#nave').remove()

        $('#explode_nave').trigger('play')

        pontos = pontos + 50

        setTimeout(
            function() {
                $('#explodeNave').remove()
                $("#area_jogo").append('<div class="nave" id="nave"></div>')
            },
            2000
        )
    }  
}

//Explodir tanque
function explodirTanque() {
    if ( $("#tanqueExplode").length < 1 ) {
        $("#area_jogo").append('<div class="tanqueExplode" id="tanqueExplode"></div>')

        var player_top = parseInt( $('#tanque').css('top') )
        var player_left = parseInt( $('#tanque').css('left') )

        $('#tanqueExplode').css("top", player_top)
        $('#tanqueExplode').css("left", player_left)

        $('#tanque').remove()

        pontos = pontos + 40

        setTimeout(
            function() {
                $('#tanqueExplode').remove()
                $("#area_jogo").append('<div class="tanque" id="tanque"></div>')
            },
            2000
        )
    }  
}

function salvarPessoa() {
    $('#pessoa').remove()
}

function removeVida() {
    switch( vida ) {
        case 4: {
            $('#vida').css("background-position", "0px 52px")
            break
        }
        case 3: {
            $('#vida').css("background-position", "-118px 52px")
            break
        }
        case 2: {
            $('#vida').css("background-position", "-235px 52px")
            break
        }
        case 1: {
            $('#vida').css("background-position", "-354px 52px")
            break
        }
        default: {
            $('#gameover').show()
            $('#vida').remove()
            $('#player').remove()
            $('#nave').remove()
            $('#tanque').remove()
            $('#tiro_inimigo').remove()
            $('#pessoa').remove()
            $('#pontuacao').remove()
            pontos = 0
            jogo_iniciado = false           
        }
    }

    vida--
}

setInterval(
    GameEngine,
    30
)