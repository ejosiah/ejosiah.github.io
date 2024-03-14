class Vec2 {

    constructor(x, y){
        if(x != undefined && y != undefined){
            this.x = x;
            this.y = y;
        }else if(x) {
            if(x instanceof Vec2){
                this.x = x.x;
                this.y = x.y;
            }else if(typeof x == 'number'){
                this.x = x;
                this.y = x;
            }else {
                throw `invalid argument ${x}:${(typeof x).toUpperCase()}`
            }

        }else {
            this.x = 0;
            this.y = 0;
        }
    }
  
  
  plus(other){
  	this.x += other.x;
    this.y += other.y;
    return this;
  }
  
  minus(other){
  	this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  
  mul(other){
  	if(other instanceof Vec2){
    	this.x *= other.x;
      this.y *= other.y;
    }else if(typeof other == 'number'){
    	this.x *= other;
        this.y *= other;
    }else {
        throw `can not multiply by ${other}:${typeof other}`;
    }
    return this;
  }

  div(other){
  	if(other instanceof Vec2){
    	this.x *= other.x;
      this.y *= other.y;
    }else if(typeof other == 'number'){
    	this.x *= other;
        this.y *= other;
    }else {
        throw `can not divide by ${other}:${typeof other}`; 
    }
    return this;
  }

  dot(other) {
    const a = this;
    const b = other;
    return a.x * b.x + b.y * b.y;
  }

  rotate(angle) {
    const a = this.x;
    const b = this.y;
    const c = Math.cos(angle);
    const d = Math.sin(angle);

    this.x = a*c - b*d;
    this.y = a*d + b*c;
    return this;
  }

  length() {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x*x + y*y);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }
  
  draw(ctx, radius = 2){
  	ctx.beginPath();
    ctx.arc(this.x, this.y, radius, -Math.PI, Math.PI);
    ctx.fill();
  }
}



class Line {
	constructor(a, b){
        this.a = a;
        this.b = b;
    }
  
    get start() {
        return this.a.clone();
    }

    get end() {
        return this.b.clone();
    }

    dir() {
        let c = this.b.clone();
        return c.minus(this.a);
    }

    midPoint() {
        let c = new Vec2(this.b);
        c.plus(this.a);
        c.mul(0.5);
        return c;
    }

    rotate(angle) {
        const rot = new Vec2(Math.cos(angle), Math.sin(angle));
        let d = this.dir();
        this.b = new Vec2(d.x * rot.x - d.y * rot.y, d.x * rot.y + d.y * rot.x);
        this.b.plus(this.a);
        return this;
    }

    clone() {
        return new Line(this.a.clone(), this.b.clone());
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }

    static fromRay(origin, direction) {
        return new Line(origin, origin.clone().plus(direction));
    }
}

class Circle {
    constructor(center, radius){
        this.center = center;
        this.radius = radius;
    }

    fill(ctx){
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, -Math.PI, Math.PI);
        ctx.fill();
    }

    stroke(ctx){
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, -Math.PI, Math.PI);
        ctx.stroke();
    }
}

function findIntersection(line1, line2) {
	const x1 = line1.a.x;
    const y1 = line1.a.y;
    const x2 = line1.b.x;
    const y2 = line1.b.y;
    const x3 = line2.a.x;
    const y3 = line2.a.y;
    const x4 = line2.b.x;
    const y4 = line2.b.y;
    
    const num = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
    const denum = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    const t = num / denum;
    
    const a = line1.a;
    const b = line1.b;
    
    return a.plus(line1.dir().mul(t));
    
}

function orient2d(points) {
    const [a, b, c] = points;
    const d = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    return Math.abs(d)/d;
}


window.addEventListener('load', () => {
    let points = [];

    const canvas = document.querySelector('#my-canvas');
    const ctx = canvas.getContext('2d');
    
    window.addEventListener('click', e => {
        if(points.length < 3) {
          points.push(new Vec2(e.x, e.y));
      }else {
          points = []
        points.push(new Vec2(e.x, e.y));
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      for(let p of points) {
        p.draw(ctx);
      }
      
      ctx.strokeStyle = 'gray'
      if(points.length == 3) {
        let a = new Line(points[0], points[1]);
        let b = new Line(points[0], points[2]);
        
        a.draw(ctx);
        b.draw(ctx);
        
        let midA = a.midPoint();
        midA.draw(ctx); 

        let midB = b.midPoint();
        midB.draw(ctx);

        // perpendicular
        const winding = orient2d(points);
        console.log(`winding: ${winding}`);
        let pa = Line.fromRay(midA, a.dir());
        pa.rotate(winding * Math.PI * 0.5);
        pa.draw(ctx);

        let pb = Line.fromRay(midB, b.dir());
        pb.rotate(-winding * Math.PI * 0.5);
        pb.draw(ctx);

        const c = findIntersection(pa, pb);
        c.draw(ctx);
        
        const circle = new Circle(c, c.clone().minus(b.b).length());
        circle.stroke(ctx);
      }
      
    });
    
});