var football = (function(){

	//解决浏览器兼容性问题
	var requestAnimFrame = (function(callback){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			setTimeout(callback, 1000 / 60)
		}
	})();

	//定义闭包内的全局变量
	var canvas;
	var context;
	var image;
	var ball;
	var ballContainer;
	var supportCanvas = document.createElement('canvas').getContext

	//构造Ball对象
	function Ball(ballimage, options){
		this.width = options.width;
		this.height = options.height;
		this.containerWidth = options.containerWidth;
		this.containerHeight = options.containerHeight;
		this.x = options.left;
		this.y = options.top;
		this.image = ballimage;
		this.gravity = 0.4;
		this.vy = 0.8;
		this.vx = 4;
		this.vyAdjust = -15;
		this.vxAdjust = 0.25;
		this.factor = 0.65;
		this.end = false;
		this.degree = 0;
		this.ball = ballimage.parentNode;
	}

	//Ball原型中的draw方法
	Ball.prototype.draw = function(){
		if (supportCanvas) {
			context.save();	//保存当前状态
			this.rotate();	//执行滚动函数
			context.drawImage(this.image,
				0, 0,
				100, 100,
				this.x, this.y,
				this.width, this.height
				);
			context.restore();	//重置画布状态

			if(this.vx > 0){
				this.degree += this.vx;
			}
		}else {
			this.ball.style.left = this.x + 'px';
			this.ball.style.top = this.y + 'px';
		}
	};

	//Ball原型中的hit方法
	Ball.prototype.hit = function(){
		this.vy = this.vyAdjust;
	}

	//Ball原型中的rotate方法
	Ball.prototype.rotate = function(){
		context.translate(this.x + this.width / 2, this.y + this.height / 2);
		context.rotate(Math.PI / 180 * this.degree);
		context.translate(-this.x - this.width / 2, -this.y - this.height / 2);
	}

	//Ball原型中的move方法
	Ball.prototype.move = function(){
		this.y += this.vy;
		this.vy += this.gravity;

		if(this.vx > 0){
			this.x += this.vx
		}

		if((this.y + this.height) > this.containerHeight){
			this.hit();
			this.vyAdjust = (this.vyAdjust * this.factor);
			this.vx = this.vx - this.vxAdjust;
		}

		if(this.vx < -0.1){
			this.end = true;
		}
	};

	//清除画布
	function clearCanvas(){
		context && context.clearRect(0, 0, canvas.width, canvas.height)
	}


	function update(){
		clearCanvas();
		ball.move();
		ball.draw();
		// console.log(ball.x, ball.y);
	}

	// loop函数用来控制球什么时候停止
	function loop(){
		update();

		if(!ball.end){
			requestAnimFrame(loop);
		}
	}

	//loadBall函数
	function loadBall(){
		//构建Ball对象的一个实例ball
		ball = new Ball(image, {
			width: 100,
			height: 100,
			containerWidth: 1000,
			containerHeight: 500,
			left:0,
			top:0
		});
		//执行loop函数
		loop();
	}

	//初始化函数
	function init(){
		//初始化一个Image对象的实例
		image = new Image();
		// 设定Image的src属性
		image.src = 'image/football.png';
		//当image加载完成时，执行的loadBall函数
		if (!supportCanvas) {
			ballContainer = document.getElementById('ball');
			ballContainer.appendChild(image);
			ballContainer.style.display = 'block';
		}else{
			// 获得html文档中的canvas标签
			canvas = document.getElementById('football');
			//获得canvas对象
			context = canvas.getContext("2d");	//此处不能用var，否则会编程局部变量
			canvas.style.display = "block";
		}
		image.onload = loadBall;
	}

	//定义football对象，对象中包含一个method
	var football = {
		play: function(){
			init();	//执行一个初始化的函数。
		}
	};

	//返回football对象
	return football;
})();

