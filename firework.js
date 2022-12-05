$(function() {
	var canvas = $('#canvas')[0];
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvas.onclick=pauseorcontinue;
	//获取2d画笔
	var ctx = canvas.getContext('2d');
	//烟花集合
	var listFire = [];
	var lights=[];
	var listFirework=[];
	var listTextFirework=[];
	var center = { x: canvas.width / 2, y: canvas.height / 2 };
	var conf={
		firex:function(){return center.x + 300*(Math.random()-0.5) ;}
		,firey:canvas.height
		,firesize:1
		,firefar:function(){ return center.y/5 + (center.y/2)* Math.random();}//烟花飞起高度
		,firefill:'#ff0'
		,firevx:function(){return (Math.random() - 0.5)*2;}
		,firevy:function(){return -(Math.random() + 4);}
		
		,firealpha:0.5
		,lightcolor:function(){return 'rgb($r, $g, $b)'.replace('$r', Math.floor(Math.random() * 256)).replace('$g', Math.floor(Math.random() * 256)).replace('$b', Math.floor(Math.random() * 256));}
		
		,lightlife:150 //烟花绽放到消失的时间
		,lightsize:0.5 //烟花颗粒大小
	};
	var  ispause = false;
	//初始化十个烟花
	for(var i=0;i<8;i++){//控制每批烟花的数量
		var fire = initfire({});
		//加入烟花集合
		listFire.push(fire);
	}

		//循环
	(function loop() {
		if(!ispause){
			update();
			draw();
		}
		requestAnimationFrame(loop);
	})();
	
	function pauseorcontinue(){
		ispause = !ispause;
	}

	function update(){
		// 更新烟花逻辑
		for (var i = listFire.length-1; i >=0 ; i--) {
			updateFire(listFire[i]);
		}
		//更新烟花爆炸效果
		for (var i = listFirework.length - 1; i >= 0; i--) {
			updateFireWork(listFirework[i])
		}
		
	}
 
	function draw(){
		//清空原图像，使用黑色覆盖原图像
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.1;
		ctx.fillStyle = '#000';//黑色
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//绘制
		for (var i = 0; i < listFire.length; i++) {
			drawFire(listFire[i]);
		}
		
		for (var i = 0; i < listFirework.length; i++) {
			drawFireWork(listFirework[i])
		}
	}
	//初始化烟花数据
	function initfire(fire){
		fire.x = conf.firex(),
		fire.y = conf.firey,
		fire.size = conf.firesize,
		fire.fill = conf.firefill,
		fire.vx = conf.firevx(),
		fire.vy = conf.firevy(),
		//fire.ax = conf.fireax(),
		fire.alpha = conf.firealpha+ Math.ceil(5*Math.random())/10,
		fire.far = conf.firefar()
		return fire;
	}
	//更新烟花上升位置
	function updateFire(fire){
		if (fire.y <= fire.far) {//到达最远距离，爆炸，并重置位置
			//创建爆炸效果
			makeFireWork(fire.x,fire.y);
			initfire(fire);//初始化烟花数据
		}else{//否则继续上升
			fire.x += fire.vx;
			fire.y += fire.vy;
			fire.vy *= 0.99+0.01;
			fire.alpha =1;
		}
	}
	
	function updateFireWork(firework){
		if (firework) {
			firework.vx *= 0.9;
			firework.vy *= 0.9;
			firework.x += firework.vx;
			firework.y += firework.vy;
			firework.vy += firework.ay;
			firework.alpha = firework.life / firework.base.life;
			firework.size = firework.alpha * firework.base.size;
			firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
			//控制生命周期
			firework.life--;
			if (firework.life <= 0) {
				listFirework.splice(listFirework.indexOf(firework), 1);
			}
		}
	}
	
	function drawFire(fire){
		ctx.globalAlpha = fire.alpha;
		ctx.beginPath();
		ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fillStyle = fire.fill;
		ctx.fill();
	}
	 
	function drawFireWork(fireWork){
		ctx.globalAlpha = fireWork.alpha;
		ctx.beginPath();
		ctx.arc(fireWork.x, fireWork.y, fireWork.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fillStyle = fireWork.fill;
		ctx.fill();
	}
	
	function makeFireWork(x,y){
		if(y>500)
		console.log(y);
		var a = Math.ceil(Math.random()*13);
		switch (a){
			case 1:makeMultipleCircleFirework(x,y,Math.ceil(Math.random()*3),5); break;
			case 2:makeFullCircleFirework(x,y);	break;
			case 3:makeMultipleFullCircleFirework(x,y);break;
			case 4:makePlanetCircleFirework(x,y);	break;
			case 5:makeMultipleHeartFirework(x,y,Math.ceil(Math.random()*3),5);	break;
			case 6:makeRandomFirework(x,y);	break;
			case 7:makePlanetCircleFirework(x,y);	break;
			case 8:makeMultipleHeartFirework(x,y,Math.ceil(Math.random()*3),5);	break;
			case 9:makeRandomFirework(x,y);	break;
			case 10:makeMultipleCircleFirework(x,y,Math.ceil(Math.random()*3),5);	break;
			case 11:maketextFireWork("我爱你!",x,y,200,"楷体");	break;
			default:makeMultipleFullCircleFirework(x,y);break;
		}
	}
	
	
	//创建多层圆形烟花（x,y,层数，半径）
	function makeMultipleCircleFirework(x,y,num,r) {
		var max = 50;
		if(num*3>r)r=num*3;
		for(var n=0; n<num; n++ ){//循环生成每一层圆形烟花
			var color = conf.lightcolor();//随机一个颜色
			makeCircleFirework(x,y,r,color,max,2);
			max -= 5;
			r -= 3 ;
		}
	}
	
	//创建实体圆形烟花
	function makeFullCircleFirework(x,y) {
		var color = conf.lightcolor();
		var r = Math.random() * 8 + 7;
		makeCircleFirework(x,y,r,color,50,0.5);
		makeCircleFirework(x,y,r/2,color,80,r);
	}
	
	//创建双层实体圆形烟花
	function makeMultipleFullCircleFirework(x,y) {
		var color = conf.lightcolor();
		var r = Math.random() * 5 + 3;
		makeCircleFirework(x,y,r,color,50,0.5);
		makeCircleFirework(x,y,r/2,color,70,r);
		makeCircleFirework(x,y,r*1.4,conf.lightcolor(),50,0.5);
	}
	
	//创建行星形烟花
	function makePlanetCircleFirework(x,y) {
		var velocity = Math.random() * 2 + 5;
		var color = conf.lightcolor();
		//创建圆
		makeCircleFirework(x,y,4.5,color,20,0);
		//创建圆内粒子
		makeCircleFirework(x,y,2,color,40,3);
		//创建星环（椭圆）
		makeEllipseFirework(x,y,4.5,conf.lightcolor(),30,0.5,2);
	}
	//创建多层心形烟花
	function makeMultipleHeartFirework(x,y,num,r){
		var max = 50;
		if(num*3>r)r=num*3;
		var angle = 360 * Math.random();
		for(var n=0; n<num; n++ ){//循环生成每一层圆形烟花
			var color = conf.lightcolor();//随机一个颜色
			makeHeartFirework(x,y,r,max,1,angle);
			max -= 5;
			r -= 3 ;
		}
		
	}
	//创建普通烟花
	function makeRandomFirework(x,y,color) {
		var num = Math.floor(Math.random()*3)+1 ;
		var max = 100;
		var avgmax = Math.ceil(max/num);
		var r = Math.random() * 5 + 3;
		var _color = color;
		for (var i = 0; i <num ; i++) {
			if(!color)_color = conf.lightcolor();
			makeCircleFirework(x,y,r,_color,avgmax,r*1.9);
		}
	}
	
	/** 圆形烟花
	x
	y
	半径
	颜色
	颗粒数
	半径浮动范围
	*/
	function makeCircleFirework(x,y,r,color,max,random){
		var _color = color;
		var angle = 360 * Math.random();
		for (var i = 0; i < max; i++) {
			if(!color)_color = conf.lightcolor();
				var rad = (i * Math.PI * 2) / max;//弧度
				var x1 = Math.cos(rad) * (r + (Math.random() - 0.5) * random);
				var y1 = Math.sin(rad) * (r + (Math.random() - 0.5) * random);
				var firework = {
					x: x,
					y: y,
					size: Math.random() + conf.lightsize,
					fill: _color,
					vx: x1*Math.cos(angle)+y1*Math.sin(angle),
					vy: y1*Math.cos(angle)-x1*Math.sin(angle),
					ay: 0.02+ 0.02*Math.random(),
					alpha: 1,
					life: Math.round(Math.random() * 60) + conf.lightlife
				};
				firework.base = {
					life: firework.life,
					size: firework.size
				};
				listFirework.push(firework);
			}
	}
 	/** 椭圆形烟花
	x
	y
	半径
	颜色
	颗粒数
	半径浮动范围
	*/
	function makeEllipseFirework(x,y,r,color,max,random,len){
		var vx = r*len ;
		var vy = r;
		var rotate = Math.random() * Math.PI * 2;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			// calc x, y for ellipse
			var cx = Math.cos(rad) * vx + (Math.random() - 0.5) * random;
			var cy = Math.sin(rad) * vy + (Math.random() - 0.5) * random;
			var firework = {
				x: x,
				y: y,
				size: Math.random() + conf.lightsize,
				fill: color,
				vx: cx * Math.cos(rotate) - cy * Math.sin(rotate), // rotate x ellipse
				vy: cx * Math.sin(rotate) + cy * Math.cos(rotate), // rotate y ellipse
				ay: 0.02+ 0.02*Math.random(),
				alpha: 1,
				life: Math.round(Math.random() * 60) + conf.lightlife
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
	}
	
	
	//创建心形烟花
	function makeHeartFirework(x,y,r,max,random,angle) {
		if(!angle) angle = 360 * Math.random();//随机旋转任意角度
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var x1 = 16 * Math.pow((Math.sin(rad)) , 3);
			var y1 = 13 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad);
			var firework = {
				x: x,
				y: y,
				size: Math.random() + conf.lightsize,
				fill: conf.lightcolor(),
				vx: r/10*(x1*Math.cos(angle)+y1*Math.sin(angle))+random*Math.random() ,
				vy: -r/10*(y1*Math.cos(angle)-x1*Math.sin(angle))+random*Math.random(),
				ay: 0.02+ 0.02*Math.random(),
				alpha: 1,
				life: Math.round(Math.random() * 60) + conf.lightlife
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
	}
	/**
	文字
	起点x
	起点y
	大小
	字体
	*/
	function maketextFireWork(str,x,y,size,family){
		if(!str)return;
		//使用span获取文字的实际宽高
		var span = document.createElement("span");
		span.innerText=str;
		span.style.fontSize = "20px";
		span.style.fontFamily=family;
		document.body.appendChild(span);
		var w1 = span.offsetWidth;
		var h1 = span.offsetHeight;
		span.style.display="none";
		//设置画布2的宽高，并绘制文字
		var canvas2 = document.createElement("canvas"); //$('#canvas2')[0];
		canvas2.width = w1;
		canvas2.height = h1;
		document.body.appendChild(canvas2);
		var ctx2 = canvas2.getContext('2d');
		ctx2.fillStyle='#000';
		ctx2.fillRect(0,0,w1,h1);
		ctx2.fillStyle = '#111';//文字颜色，比黑色浅一点点。
		ctx2.font = "20px  "+family;
		ctx2.textBaseline = 'top';
		ctx2.fillText(str, 0, 0);
		//获取画布2 的image信息
		var imageData = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
		canvas2.style.display="none";
		var bl = size/20;
		var width = w1* bl;
		var height = h1*bl;
		x = x-Math.floor(width/2);
		y = y-Math.floor(height/2);
		for(var i=0;i<h1;i++ ) {
			for(var j=0;j<w1;j++){
				var R = imageData.data[(i*w1+j)*4];
				if(R>0){//颜色值不为0，则是文字部分所在的像素点。
					makeDelayCircleFirework(x + j*bl,y + i*bl,0.5,null,3,1);
				} 
			} 
		} 
	}
	
	function makeDelayCircleFirework(x,y,r,color,max,random){
		setTimeout(function(){
			makeCircleFirework(x,y,r,color,max,random);
			},Math.random()*500);
	}
	
	
})