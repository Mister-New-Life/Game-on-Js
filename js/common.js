$(document).ready(function(){

	var strip = $(".strip");
	var ballHtml = $(".ball");
	var score = $(".score").val();
	var mainTitle =  $('h2');

	//Map 
	var map = {
		width: window.innerWidth,
		height: window.innerHeight,
		maxPosTop: 0,
		minPosLeft: 0
	};
	console.log(map);

	//Array heart
	var heart = ['img/heart.png','img/heart.png','img/heart.png'];

	//Platform
	var platform = {
		size: {
			width: 150,
			height: 30
		},
		pos: {
			top: map.height-30,
			left: map.width/2
		},
		speed: 20,
		skin: 'url(img/platform.png)'
	};

	//Ball
	var ball = {
		size: {
			width: 35,
			height: 35
		},
		pos: {
			// top: map.height-55,
			top: 10,
			left: map.width/2,
			startPos: map.height-55
		},
		speed: 13,
		deg: 20,
		moved: false,
		skin: 'url(img/ball3.png)'
	};

	// var gameOver = ['Reload', 'Home'];

	//Blocks
	var blckConfig = {
		size: {
			width: 150,
			height: 20
		},
		padding: 10,
		column: 6,
		row: 4,
		health: 2
	};

	var Block = function(data){
		this.id = data.id;
		this.health = data.health;
		this.x = data.x;	
		this.y = data.y;
		this.width = data.width || (map.width/blckConfig.column)-(blckConfig.padding*2);
		this.height = data.height || blckConfig.size.height;
		this.background = data.background || 'url(img/block.png)';
	};

	var blocks = [];
	for(var k = 0; k < blckConfig.row; k++){
		for(var i = 0; i < blckConfig.column; i++){
			blocks.push(new Block({
				id: Date.now()+i,
				health: blckConfig.health,
				x: (map.width/blckConfig.column) * i+blckConfig.padding,
				y: (blckConfig.padding+blckConfig.size.height+50)*(k+1)
			}));
		};
	};
	console.log(blocks);
	console.log(heart);
	//Render all object
	var MAIN = {
		options: {
			gameLoop: false,
			gameLoopPlatform: false,
			gameTooltipInfo: document.createElement('h2')
		},
		StripPosition: function(platform){
			strip.css({
				"left": platform.pos.left+"px"
			})
		},
		BallPosition: function(ball){
			ballHtml.css({
				"top": ball.pos.top+"px",
				"left": ball.pos.left+"px"
			})
		},
		renderHtmlBlock: function(){
			html = "";
			for(var i = 0, max = blocks.length; i < max; i++){
				html+='<button style="background:'+blocks[i].background+'; left:'+blocks[i].x+'px; top:'+blocks[i].y+'px; width:'+blocks[i].width+'px; height:'+blocks[i].height+'px" type="button" class="block" id="'+blocks[i].id+'"></button>'
			};
			return html;
		},
		renderHtmlHeart: function(){
			html = "";
			for(var i = 0, max = heart.length; i < max; i++){
				html+='<li class="heart">'+(heart[i]?'<img src="'+heart[i]+'">' : "")+'</li>'
			};
			return html;
		},
		ballOnPlatform: function(){
			if(!ball.moved){
				ball.pos.left = platform.pos.left;
				MAIN.BallPosition({
					pos: {
						left: platform.pos.left
					}
				})
			}
			MAIN.StripPosition(platform);	
		},
		restart: function(){
			clearInterval(MAIN.options.gameLoop);
			ball.pos.top = ball.pos.startPos;
			platform.pos.left = map.width/2;
			ball.pos.left = platform.pos.left;
			ball.moved = false;
		},
		moveBall: function(){
			ball.moved = true; 
			if(ball.pos.top >= map.maxPosTop){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
							ball.pos.top-=ball.speed;
						}else{
							map.maxPosTop+=ball.speed;
							ball.pos.top+=ball.speed;
						}
						if(ball.pos.left > platform.pos.left-((platform.size.width/2)+ball.size.width/2) && 
							ball.pos.left < platform.pos.left+((platform.size.width/2)+ball.size.width/2) && 
							ball.pos.top > ball.pos.startPos && 
							ball.pos.top < ball.pos.startPos+ball.size.height/2){
								map.maxPosTop=0;
								ball.pos.top-=ball.speed;
						}else if(ball.pos.top > map.height){
							MAIN.restart();
							if(heart.length <= 1){
								MAIN.renderHtmlAlert();
								// location.reload();
							}else{
								heart.pop();
								$('.core').html(MAIN.renderHtmlHeart());
							}
						}
						if(ball.pos.left-ball.size.width/2 >= map.maxPosLeft){
							ball.pos.left-=ball.speed;
						}else{
							map.maxPosLeft+=ball.deg;
							ball.pos.left+=ball.speed;
						}
						if(ball.pos.left+ball.speed >= map.width){
							map.maxPosLeft=0;
							ball.pos.left-=ball.speed;
						}
						MAIN.BallPosition(ball);	
						MAIN.StripPosition(platform);
		},
		movePlatformRight: function(){
			if(platform.pos.left+platform.size.width/2 >= map.width){
				clearInterval(MAIN.options.gameLoopPlatform); 
			}else{
				platform.pos.left+=platform.speed;
			};
			MAIN.ballOnPlatform();
		},
		movePlatformLeft: function(){
			if(platform.pos.left-platform.size.width/2 <= map.minPosLeft){
				clearInterval(MAIN.options.gameLoopPlatform); 
			}else{
				platform.pos.left-=platform.speed;
			};
			MAIN.ballOnPlatform();
		},
		removeBlock: function(){
			for(var i = 0, max = blocks.length; i < max; i++){
				if(ball.pos.top-ball.size.height < blocks[i].y){
					blocks.find(function(o){
						if(ball.pos.top <= o.y+o.height &&
							ball.pos.left >= o.x &&	ball.pos.left <= o.x+o.width){
								o.health-=1;
								ball.pos.top+=ball.speed;
								map.maxPosTop = o.y;
								map.maxPosTop+=ball.pos.top;
								if(o.health === 3){
									o.background = 'rgba(240,15,0, 0.8)';
								}else if(o.health === 1){
									o.background = 'transparent';
									o.y = -o.height-50;
								}
								return o;
						}else if(ball.pos.top <= o.y &&
							ball.pos.left >= o.x &&	ball.pos.left <= o.x+o.width){
								o.health-=1;
								ball.pos.top+=ball.speed;
								map.maxPosTop = o.y;
								map.maxPosTop+=ball.pos.top;
								if(o.health === 3){
									o.background = 'rgba(240,15,0, 0.8)';
								}else if(o.health === 1){
									o.background = 'transparent';
									o.y = -o.height-50;
								}
								return o;
						}
					});
					$('.field').html(MAIN.renderHtmlBlock());
				}
			};
		},
		renderPlatformAndBall: function(){
			strip.css({
				"width": platform.size.width,
				"height": platform.size.height,
				"background-image": platform.skin,
				"top": platform.pos.top,
				"left": platform.pos.left+"px",
				"transform": "translateX(-50%)",
				"position": "absolute"
			});

			ballHtml.css({
				"width": ball.size.width,
				"height": ball.size.height,
				"background-image": ball.skin,
				"top": ball.pos.top,
				"left": ball.pos.left+"px",
				"transform": "translateX(-50%)",
				"position": "absolute"
			});
		},
		renderHtmlAlert: function(){
			MAIN.renderTitle('GAME OVER');
		},
		renderTitle: function(text){
			MAIN.options.gameTooltipInfo.innerHTML = text;
			field.insertBefore(MAIN.options.gameTooltipInfo, field.children[0]);
		},
		runGame: function(){
			$('.field').html(this.renderHtmlBlock());
			$('.field').html(this.renderPlatformAndBall());
			$('.core').html(this.renderHtmlHeart());

			$(document).on('keydown', function(e) {
				//Start game SPACE press-----------
				MAIN.renderTitle('');
				if(e.keyCode === 39 || e.key === "d" || e.key === "в"){
					clearInterval(MAIN.options.gameLoopPlatform); 
					MAIN.options.gameLoopPlatform = setInterval(function(){					
						MAIN.movePlatformRight();
					}, 30);

				}else if(e.keyCode === 37 || e.key === "a" || e.key === "ф"){
					clearInterval(MAIN.options.gameLoopPlatform);
					MAIN.options.gameLoopPlatform = setInterval(function(){					
						MAIN.movePlatformLeft();
					}, 30);

				}else if(e.keyCode === 32){			
				clearInterval(MAIN.options.gameLoop);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
				MAIN.options.gameLoop = setInterval(function(){					
					MAIN.removeBlock();
					MAIN.moveBall();
					}, 40);
			}
		});

			$(document).on('keyup', function(e) {
				if(e.keyCode === 39 || e.key === "d" || e.key === "в"){
					clearInterval(MAIN.options.gameLoopPlatform);
				}
				if(e.keyCode === 37 || e.key === "a" || e.key === "ф"){	
					clearInterval(MAIN.options.gameLoopPlatform); 
				}
			});	
		}	
	};

	//Start game
		$('.start').on('click', function(){
			MAIN.runGame();
			MAIN.renderTitle('Press space to start game');
		});
});