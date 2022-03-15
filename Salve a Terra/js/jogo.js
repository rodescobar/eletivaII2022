function start() {
		//Area Divs
		$('#start').hide();
		$('#gameover').hide();
		$('#area_jogo').append("<div id='player' class='player'></div>");
		$('#area_jogo').append("<div id='nave' class='nave'></div>");
		$('#area_jogo').append("<div id='tanque' class='tanque'></div>");
		$('#area_jogo').append("<div id='pessoa' class='pessoa'></div>");
		$('#area_jogo').append("<div id='vida_player' class='vida'></div>");
		$('#area_jogo').append("<div id='pontuacao' class='pontos'>Pontos: </div>");
		
		//Variaveis globais
		var player_local = 0;
		var tecla = {
			C:38,
			B:40,
			E:37,
			D:39,
			T:32
		}
		var jogo = {}
		jogo.pressionou = [];
		var vida = 4;
		var pontos = 0;
		
		//Teclas pressionadas
		$(document).keydown(function(e){
			jogo.pressionou[e.which] = true;
		});
	
	
		$(document).keyup(function(e){
	       jogo.pressionou[e.which] = false;
		});	

		//Sons
		var somjogo=document.getElementById("somjogo");		
		var lasernave=document.getElementById("lasernave");		
		var tiroplayer=document.getElementById("tiroplayer");		
		var salva=document.getElementById("salva");		
		var explode=document.getElementById("explode");		
		var explodeplayer=document.getElementById("explodeplayer");		
		var grito=document.getElementById("grito");		
		
		//Motor do jogo
		setInterval(loop,30);

		function loop() {
			somjogo.addEventListener("ended", function(){ somjogo.currentTime = 0; somjogo.play(); }, false);
			somjogo.play();
			movimentacenario();
			movimentaplayer();
			movimentanave();
			movimentatanque();
			movimentapessoa();
			movimentatiro();
			movetiro();
			mostrapontos();
			colisao();
		}
		
		function movimentacenario() {
			var posicao = parseInt($('.area_jogo').css("background-position"));
			$('.area_jogo').css("background-position",posicao-1);
		} //Fim movimentacenario

		function movimentaplayer() {
			if(jogo.pressionou[tecla.C]){
				var topo = parseInt($('#player').css("top"));
				$('#player').css("top", topo-8);
				if(topo<=10)
					$('#player').css("top", 10);
			}

			if(jogo.pressionou[tecla.B]){
				var down = parseInt($('#player').css("top"));
				$('#player').css("top", down+8);
				if(down>=256)
					$('#player').css("top", 256);
			}

			if(jogo.pressionou[tecla.D]){
				var left = parseInt($('#player').css("left"));
				$('#player').css("left", left+8);
				if(left>=560)
					$('#player').css("left", 560);
			}

			if(jogo.pressionou[tecla.E]){
				var left = parseInt($('#player').css("left"));
				$('#player').css("left", left-8);
				if(left<=0)
					$('#player').css("left", 0);
			}
			
			if(jogo.pressionou[tecla.T]){
				if($('#tiro').length==0) {
					var pos_y = parseFloat($('#player').css("top"));
					var pos_x = parseFloat($('#player').css("left"));
					$('#area_jogo').append("<div id='tiro' class='tiro'></div>");
					$('.tiro').css("left",pos_x+100);
					$('.tiro').css("top",pos_y+30);
				}
			}
		} //Movimenta player

		function movimentanave() {
			var left = parseInt($('#nave').css("left"));
			$('#nave').css("left", left-2);
			if(left<=-10) {
				nasce_nave();
			}
			
			if((left<=590) && (left>=580) && ($('#inimigo_tiro').length==0)){
				player_local = parseInt($('#player').css('top'));

				var topo = parseInt($('#nave').css("top"));
				$('#area_jogo').append("<div id='inimigo_tiro' class='tiro_nave'></div>");		
				$('.tiro_nave').css("top", topo);			
			}
			
		} //movimenta nave
		
		function nasce_nave() {
			var local = parseInt(Math.random() * 250);
			$('#nave').css("top",local);
			$('#nave').css("left",600);
			if($('#inimigo_tiro').length>0)
				$('#inimigo_tiro').remove();
		}
		
		function movimentatiro() {
			if($('#inimigo_tiro').length>0) {
				lasernave.play();
				var left = parseInt($('#inimigo_tiro').css("left"));
				var altura = parseInt($('#inimigo_tiro').css("top"));

				if(altura <= player_local) {
					$("#inimigo_tiro").css("top", altura+3);
				} else {
					$("#inimigo_tiro").css("top", altura-3);
				}

				$('#inimigo_tiro').css("left", left-4);
				
				if(left <=0) {
					$('#inimigo_tiro').remove();
				}
			}
		} //fim movimentatiro
		
		function movetiro() {
			if($('#tiro').length>0) {
				tiroplayer.play();
				var left = parseInt($('#tiro').css("left"));
				$('#tiro').css("left",left+10);
				
				if(left>=599)
					$('#tiro').remove();
			}
		} //Fim movetiro

		function movimentatanque() {
			var left = parseInt($('#tanque').css("left"));
			$('#tanque').css("left", left-1.1);
			if(left<=0) {
				$('#tanque').hide();
				setTimeout(function(){
					$('#tanque').css("left",610);
					$('#tanque').show()
				},5000);
			}
		} //movimenta tanque
		
		function movimentapessoa() {
				var left = parseInt($('#pessoa').css("left"));
				$('#pessoa').css("left", left+1);
				if(left>=640)
					$('#pessoa').css("left", 640);
		} //  Fim movimenta pessoa
		
		function colisao() {
			var colisao_1 =  ($("#player").collision($("#nave")));
			var colisao_2 =  ($("#player").collision($("#tanque")));
			var colisao_3 =  ($("#player").collision($("#pessoa")));
			var colisao_4 =  ($("#player").collision($("#inimigo_tiro")));
			var colisao_5 =  ($("#tiro").collision($("#nave")));
			var colisao_6 =  ($("#tiro").collision($("#tanque")));
			var colisao_7 =  ($("#tanque").collision($("#pessoa")));
			
			if(colisao_1.length>0) {
				explodeplayer.play();
				removevida();
				var posicao_x = $('#player').css("left");
				var posicao_y = $('#player').css("top");
				$('#player').remove();
				$('#area_jogo').append("<div id='player_exp' class='player_explode'></div>");
				$('#player_exp').css('top', posicao_y);
				$('#player_exp').css('left', posicao_x);
				setTimeout(function() {
					$('#area_jogo').append("<div id='player' class='player'></div>");
					$('#player_exp').remove()
				},2000);
				pontos = pontos - 100;
			} //Colisao de player com nave

			if(colisao_2.length>0) {
				explodeplayer.play();
				removevida();
				var posicao_x = $('#player').css("left");
				var posicao_y = $('#player').css("top");
				$('#player').remove();
				$('#area_jogo').append("<div id='player_exp' class='player_explode'></div>");
				$('#player_exp').css('top', posicao_y);
				$('#player_exp').css('left', posicao_x);
				setTimeout(function() {
					$('#area_jogo').append("<div id='player' class='player'></div>");
					$('#player_exp').remove()
				},2000);
				pontos = pontos - 120;
			} //Colisao de player com tanque

			if(colisao_3.length>0) {
				salva.play();
				$('#pessoa').remove();
				setTimeout(function() {
					$('#area_jogo').append("<div id='pessoa' class='pessoa'></div>");
				},2000);
				pontos = pontos + 200;
			} //Player pega pessoa

			if(colisao_4.length>0) {
				var posicao_x = $('#player').css("left");
				var posicao_y = $('#player').css("top");
				removevida();
				$('#player').remove();
				$('#area_jogo').append("<div id='player_exp' class='player_explode'></div>");
				$('#player_exp').css('top', posicao_y);
				$('#player_exp').css('left', posicao_x);
				setTimeout(function() {
					$('#area_jogo').append("<div id='player' class='player'></div>");
					$('#player_exp').remove()
				},2000);
				pontos = pontos - 100;
			} //Colisao de player com tiro da nave

			if(colisao_5.length>0) {
				explode.play();
				var posicao_x = $('#nave').css("left");
				var posicao_y = $('#nave').css("top");
				$('#tiro').remove();
				$('#nave').remove();
				$('#area_jogo').append("<div id='nave_exp' class='nave_explode'></div>");
				$('#nave_exp').css('top', posicao_y);
				$('#nave_exp').css('left', posicao_x);
				setTimeout(function() {
					$('#area_jogo').append("<div id='nave' class='nave'></div>");
					nasce_nave();
					$('#nave_exp').remove()
				},2000);
				pontos = pontos + 100;
			} //Colisao tiro player com nave

			if(colisao_6.length>0) {
				explode.play();
				var t_x = $('#tanque').css("left");
				$('#area_jogo').append("<div id='e_tanque' class='tanque_explosao'></div>");
				$('#e_tanque').css("left",t_x);
				$('#tiro').remove();
				$('#tanque').remove();
				setTimeout(function(){
					$('#area_jogo').append("<div id='tanque' class='tanque'></div>");
					$('#tanque').css("left",610);
					$('#tanque').show();
					$('#e_tanque').remove()
				},5000);
				pontos = pontos + 100;
			} //Colisao tiro player com tanque		

			if(colisao_7.length>0) {
				grito.play();
				$('#pessoa').remove();
				setTimeout(function(){
					$('#area_jogo').append("<div id='pessoa' class='pessoa'></div>");
					$('#tanque').css("left",610);
				},5000);
				pontos = pontos - 500;
			} //Colisao pessoa com tanque		
		}
		
		function mostrapontos() {
			$('#pontuacao').text("Pontos: " + pontos);
		}
		
		function removevida() {
			switch(vida) {
				case 4: {
					$('#vida_player').css("background-position","-118px 53px");
					vida--;
					break;
				}
				case 3:{
					$('#vida_player').css("background-position","-234px 53px");
					vida--;
					break;
				}
				case 2:{
					$('#vida_player').css("background-position","-350px 53px");
					vida--;
					break;
				}
				default: {
					$('#player').remove();
					$('#player_exp').remove();
					$('#nave').remove();
					$('#nave_exp').remove();
					$('#inimigo_tiro').remove();
					$('#tanque').remove();
					$('#e_tanque').remove();
					$('#pessoa').remove();
					$('#vida_player').remove();
					$('#gameover').show();
					return false;
				}
			}
		}
}
function reiniciar() {
	location.reload();
}
