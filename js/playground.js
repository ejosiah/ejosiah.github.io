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