class Volume {
  constructor() {
    this.isSelected = false;
    this.fillColor = "rgba(255, 0, 0, 0.5)";
    this.strokeColor = "black";
    this.outlineSize = 1;
    this.points = [];
  }
  // Obter pontos (cópia)
  getPoints() {
    let list = this.points;
    list.forEach((p) => p.copy());
    return list;
  }
  // Adequa-se à nuvem de pontos
  fit(points) {}
  // Contém o ponto p
  hasPoint(p) {
    return false;
  }
  // Interseção com volume v
  overlaps(v) {
    return false;
  }
  // Desenha o volume
  draw() {}
}
class OBB extends Volume {
  center;
  area;
  u;
  v;
  side2;
  side1;
  fit(group) {
    let minArea = Infinity;
    for (let i = 0; i < 100; i++) {
      let theta = (random(0, 360) * PI) / 180;
      let u = new vec2(cos(theta), sin(theta));
      let v = new vec2(-u.y, u.x);

      let projections_u = [];
      group.forEach((p) => {
        projections_u.push(p.dot(u));
      });

      let max_u = max(projections_u);
      let min_u = min(projections_u);

      let projections_v = [];
      group.forEach((p) => {
        projections_v.push(p.dot(v));
      });

      let max_v = max(projections_v);
      let min_v = min(projections_v);

      let centerX = (u.x * (min_u + max_u)) / 2 + (v.x * (min_v + max_v)) / 2;
      let centerY = (u.y * (min_u + max_u)) / 2 + (v.y * (min_v + max_v)) / 2;
      let center = new vec2(centerX, centerY);

      let side2 = max_u - min_u;
      let side1 = max_v - min_v;
      let testOBB = new OBB();
      testOBB.define(center, u, v, side1, side2);
      if (testOBB.area < minArea) {
        this.define(center, u, v, side1, side2);
        minArea = testOBB.area;
      }
    }
  }
  // Define a OBB com base nos seguintes parâmetros
  define(center, u, v, side1, side2) {

    let p1 = center.madd(side1 / 2, v).madd(side2 / 2, u);
    let p2 = center.madd(-side1 / 2, v).madd(side2 / 2, u);
    let p3 = center.madd(-side1 / 2, v).madd(-side2 / 2, u);
    let p4 = center.madd(side1 / 2, v).madd(-side2 / 2, u);

    this.area = calculate_area(p1, p2, p3, p4);
    
    this.center = center;
    this.points = [p1, p2, p3, p4];
    this.u = u;
    this.v = v;
    this.side1 = side1;
    this.side2 = side2;

  }
  // Obter os 4 segmentos
  getLines() {
    let p = [];
    for (let i = 0; i < 4; i++) {
      let j = (i + 1) % 4;
      p.push([this.points[i].copy(), this.points[j].copy()]);
    }
    return p;
  }
  overlaps(v) {
    if (v instanceof OBB) {
      // Caso 1: Ponto dentro do outro volume
      for (let p of v.points) 
        if (this.hasPoint(p)) return true
      
      for (let p of this.points) 
        if (v.hasPoint(p)) return true

      // Caso 2: Interseção dos segmentos      
      for (let line of this.getLines()) {
        for (let line2 of v.getLines()) {
          if (checkCollision(line[0], line[1], line2[0], line2[1]))
            return true
        }
      }

    }
    if (v instanceof AABB) {
      // Vamos transformar o AABB em um OBB equivalente
      let obb = v.toOBB();
      return this.overlaps(obb);
    }
    if (v instanceof Circle) {
      
    }
    return false;
  }

  hasPoint(pt) {
    for (var c = false, i = -1, l = 4, j = l - 1; ++i < l; j = i)
      ((this.points[i].y <= pt.y && pt.y < this.points[j].y) ||
        (this.points[j].y <= pt.y && pt.y < this.points[i].y)) &&
        pt.x <
          ((this.points[j].x - this.points[i].x) * (pt.y - this.points[i].y)) /
            (this.points[j].y - this.points[i].y) +
            this.points[i].x &&
        (c = !c);
    return c;
  }
  draw() {
    if (this.points[0] == null) return;
    fill(this.fillColor);
    strokeWeight(this.outlineSize);
    stroke(this.strokeColor);
    quad(
      this.points[0].x,
      this.points[0].y,
      this.points[1].x,
      this.points[1].y,
      this.points[2].x,
      this.points[2].y,
      this.points[3].x,
      this.points[3].y
    );

    strokeWeight(1);
  }
}

class AABB extends Volume {
  fit(group) {
    this.points[0] = group[0].copy();
    this.points[1] = group[0].copy();
    // Agora para cada ponto do grupo
    group.forEach((p) => {
      this.min().x = Math.min(p.x, this.min().x);
      this.max().x = Math.max(p.x, this.max().x);
      this.min().y = Math.min(p.y, this.min().y);
      this.max().y = Math.max(p.y, this.max().y);
    });
  }
  min() {
    return this.points[0];
  }
  max() {
    return this.points[1];
  }
  get4Points() {
    return [
      new vec2(this.min().x, this.max().y),
      new vec2(this.max().x, this.max().y),
      new vec2(this.min().x, this.min().y),
      new vec2(this.max().x, this.min().y),
    ];
  }
  overlaps(v) {
    if (v instanceof OBB) {
      return v.overlaps(this);
    }
    if (v instanceof AABB) {
      return !(
        this.max().x < v.min().x ||
        this.max().y < v.min().y ||
        this.min().x > v.max().x ||
        this.min().y > v.max().y
      );
    }
    if (v instanceof Circle) {
      return v.overlaps(this);
    }
    return false;
  }
  hasPoint(p) {
    return (
      p.x >= this.min().x &&
      p.x <= this.max().x &&
      p.y >= this.min().y &&
      p.y <= this.max().y
    );
  }
  draw() {
    if (this.min() == null) return;
    fill(this.fillColor);
    strokeWeight(this.outlineSize);
    stroke(this.strokeColor);
    let w = this.max().x - this.min().x;
    let h = this.max().y - this.min().y;
    rect(this.min().x, this.min().y, w, h);
    strokeWeight(1);
  }
  toOBB() {
    let obb = new OBB()
    let center = this.min().add(this.max()).mul(1 / 2);
    let u = new vec2(0, 1)
    let v = new vec2(1, 0)
    let side = this.max().sub(this.min())
    obb.define(center, u, v, side.x, side.y)
    return obb
  }
}

class Circle extends Volume {
  fit(group) {
    this.center(group[0].copy());
    let minRadius2 = Infinity;
    for (let k = 0; k < 100; k++) {
      let currentCenter = this.center().copy();
      for (let i = 0; i < 6; i++) {
        let c = this.center().add(new vec2(random(-25, 25), random(-25, 25)));
        let r2 = 0;
        group.forEach((p) => {
          let d2 = p.sub(c).dot(); // Distância ao quadrado
          r2 = Math.max(r2, d2);
        });
        if (r2 < minRadius2) {
          minRadius2 = r2;
          currentCenter = c;
        }
      }
      this.center(currentCenter);
      this.radius = sqrt(minRadius2);
    }
  }
  center(p) {
    if (p != undefined) this.points[0] = p;
    return this.points[0];
  }
  hasPoint(p) {
    return this.center().sub(p).dot() <= this.radius * this.radius;
  }
  overlaps(v) {
    if (v instanceof OBB) {
      return v.overlaps(this);
    }
    if (v instanceof AABB) {
      // Vamos transformar o círculo em um AABB
      let aabb = this.toAABB();
      // Se o AABB desse círculo não intersecta v, o círculo também não v
      if (!aabb.overlaps(v)) return false;
      // Caso contrário, o círculo também intersecta v se estiver entre os x ou y
      else if (
        (this.center().x >= v.min().x && this.center().x <= v.max().x) ||
        (this.center().y >= v.min().y && this.center().y <= v.max().y)
      )
        return true;
      // Caso contrário, só falta checar se toca em alguma ponta
      let pi = null;
      v.get4Points().forEach((p) => {
        if (this.hasPoint(p)) pi = p;
      });
      return pi != null;
    }
    // Círculo com Círculo (distância dos centros <= soma dos raios)
    if (v instanceof Circle) {
      let centerDistance = this.center().sub(v.center()).dot();
      let radiusSum = (this.radius + v.radius) ** 2;
      return centerDistance <= radiusSum;
    }
    return false;
  }
  draw() {
    if (this.center() == null) return;
    fill(this.fillColor);
    strokeWeight(this.outlineSize);
    stroke(this.strokeColor);
    circle(this.center().x, this.center().y, 2 * this.radius);
    strokeWeight(1);
  }
  toAABB() {
    let v = new AABB();
    v.fit([
      this.center().add(new vec2(this.radius, this.radius)),
      this.center().sub(new vec2(this.radius, this.radius)),
    ]);
    return v;
  }
}
function calculate_area(p1, p2, p3, p4) {
  let sum1 = p1.x * p2.y + p2.x * p3.y + p3.x * p4.y + p4.x * p1.y;
  let sum2 = p1.y * p2.x + p2.y * p3.x + p3.y * p4.x + p4.y * p1.x;
  return abs(sum1 - sum2) / 2;
}
function checkCollision(A, B, C, D) {
  let AB = B.sub(A)
  let AC = C.sub(A)
  let AD = D.sub(A)
  
  if( AB.cross(AC)*AB.cross(AD) > 0 )
    return false

  let CD = D.sub(C)
  let CA = A.sub(C)
  let CB = B.sub(C)
  
  if( CD.cross(CA)*CD.cross(CB) > 0 )
    return false
  
  return true
}