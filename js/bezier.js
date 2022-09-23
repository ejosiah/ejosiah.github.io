(function(app){
	var comb = (function(height){	// generate pascals pyramid of height height
		var data = [[1], [1, 1]];
		for(var i = 2; i < height; i++){
			var priv = data[i - 1];
			var row = [1];
			for(var j = 0; j < data.length - 1; j++){
				row.push(priv[j] + priv[j+1]);
			}
			row.push(1);
			data.push(row);
		}
		return data;
	})(1000);

	function Point(x, y){
		this.x = x;
		this.y = y;
	}


	function bezierCurve(u){
		var controlPts = Array.prototype.splice.call(arguments, 1);
		var p = new Point(0, 0);
		var n = controlPts.length  - 1;
		for(var i = 0; i <= n; i++){
			p.x += B(u, n, i) * controlPts[i].x;
			p.y += B(u, n, i) * controlPts[i].y;
		}
		return p;

	}

	function fact(n){
		if(n <= 1) return 1;
		return n * fact(n - 1);
	}

	function B(u, n, i){
		return comb[n][i] * Math.pow(1 - u, n - i) * Math.pow(u, i);
	}

	function drawPoint(p, ctx){
		ctx.beginPath();
		ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawLine(ctx, points, color){
		var p0, p1;
		color = color || "rgb(0, 255, 0)";
		ctx.beginPath();
		ctx.strokeStyle = color;
		for(var i = 0; i < points.length - 1; i++){
			p0 = points[i];
			p1 = points[i+1];
			ctx.moveTo(p0.x, p0.y);
			ctx.lineTo(p1.x, p1.y);
		}

		ctx.stroke();
	}

	function drawLinearCurve(){
		var canvas = document.getElementById("linear-bezier");
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;

		var p0 = new Point(20, h - 20);
		var p1 = new Point(w - 20, 20);

		var c = new Point((p1.x + p0.x)/2, (p1.y + p0.y)/2);



		// I know i can just draw a straight line but just
		// trying to be consistent :)
		ctx.beginPath();
		ctx.strokeStyle = "rgb(0, 255, 0)";
		for(var u = 0.0; u < 1.0; u += 0.01){
			var a = bezierCurve(u, p0, p1);
			var b = bezierCurve(u + 0.01, p0, p1);
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}

		ctx.fillStyle = "black";
		ctx.fillText("P0", p0.x-5, p0.y + 15);
		drawPoint(p0, ctx);

		ctx.fillText("P1", p1.x+5, p1.y -5);
		drawPoint(p1, ctx);

		ctx.fillText("c(u)", c.x + 5, c.y + 5);
		drawPoint(c, ctx);
	}

	function drawQuadraticBezierCurve(){
		var canvas = document.getElementById("quad-bezier2");
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var p0 = new Point(20, h - 20);
		var p1 = new Point(w/2, 40);
		var p2 = new Point(w - 20, h - 40);
		var a, b;

		ctx.beginPath();
		ctx.strokeStyle = "rgb(0, 255, 0)";
		ctx.moveTo(p0.x, p0.y);
		ctx.lineTo(p1.x, p1.y);
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();

		ctx.fillStyle = "black";
		ctx.fillText("P0", p0.x-5, p0.y + 15);
		drawPoint(p0, ctx);

		drawPoint(p1, ctx);
		ctx.fillText("P1", p1.x+5, p1.y - 10);

		drawPoint(p2, ctx);
		ctx.fillText("P2", p2.x, p2.y + 15);

		ctx.beginPath();
		ctx.strokeStyle = "rgb(0, 255, 0)";
		for(var u = 0.0; u < 1.0; u += 0.01){
			a = bezierCurve(u, p0, p1, p2);
			b = bezierCurve(u + 0.01, p0, p1, p2);
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}

		// draw line c(u) at a some u
		a = bezierCurve(0.3, p0, p1);
		b = bezierCurve(0.3, p1, p2);
		c = bezierCurve(0.3, p0, p1, p2);
		ctx.beginPath();
		ctx.strokeStyle = "rgb(0, 255, 0)";
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.stroke();

		ctx.fillStyle = "black";
		ctx.fillText("a(u)", a.x - 25, a.y );
		drawPoint(a, ctx);

		ctx.fillStyle = "black";
		ctx.fillText("b(u)", b.x, b.y - 5 );
		drawPoint(b, ctx);

		ctx.fillStyle = "black";
		ctx.fillText("c(u)", c.x, c.y + 10 );
		drawPoint(c, ctx);

		ctx.fillText("(b)", w/2, h - 5);


	}

	function drawUnhappyThreeControlPoints(){
		var canvas = document.getElementById("quad-bezier1");
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var p0 = new Point(20, h - 20);
		var p1 = new Point(w/2, 40);
		var p2 = new Point(w - 20, h - 40);

		drawLine(ctx, [p0, p1, p2]);
		ctx.fillStyle = "black";
		ctx.fillText("P0", p0.x-5, p0.y + 15);
		drawPoint(p0, ctx);

		drawPoint(p1, ctx);
		ctx.fillText("P1", p1.x+5, p1.y - 10);

		drawPoint(p2, ctx);
		ctx.fillText("P2", p2.x, p2.y + 10);

		ctx.fillStyle = "black";
		ctx.fillText("(a)", w/2, h - 10);
	}

	function drawBernsteiinPolynomials(){
		var canvas = document.getElementById("quad-bezier3");
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var a, b;

		var origin = new Point(5, h - 5);
		var max = new Point(w - 5, h - 5);
		drawLine(ctx, [origin, new Point(origin.x, 5)], "black");
		drawLine(ctx, [origin, new Point(w - 5, origin.y)], "black");

		ctx.beginPath();
		ctx.strokeStyle = "rgb(0, 255, 0)";

		a = origin;
		b = origin;
		console.log("max(" + max.x + ", " + max.y + ")");
		for(var u = 0.0; u < 1.0; u += 0.1){
			a.x =   B(u, 2, 0);
			a.y =  B(u, 2, 0);
			b.x =    B(u+0.1, 2, 0);
			b.y =   B(u+0.1, 2, 0);
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			console.log("a(" + a.x + ", " + a.y + ")");
			console.log("b(" + b.x + ", " + b.y + ")");
		}
		ctx.stroke();

	}

	app.onload = function(){
		drawLinearCurve();
		drawUnhappyThreeControlPoints();
		drawQuadraticBezierCurve();

	}
})(window);