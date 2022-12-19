class Volume {
    constructor() {
        this.isSelected = false
        this.fillColor = 'rgba(255, 0, 0, 0.5)'
        this.strokeColor = 'black'
        this.outlineSize = 1
        this.points = []
    }
    // Obter pontos
    getPoints() {
        let list = this.points
        list.forEach(p => p.copy())
        return list
    }
    // Adequa-se à nuvem de pontos
    fit(points) {

    }
    // Contém o ponto p
    hasPoint(p) {
        return false
    }
    // Interseção com volume v
    overlaps(v) {
        return false
    }
    // Desenha o volume
    draw() {

    }
}
class AABB extends Volume {
    fit(group) {
        this.points[0] = group[0].copy()
        this.points[1] = group[0].copy()
        // Agora para cada ponto do grupo
        group.forEach(p => { 
            this.min().x = Math.min(p.x, this.min().x)
            this.max().x = Math.max(p.x, this.max().x)
            this.min().y = Math.min(p.y, this.min().y)
            this.max().y = Math.max(p.y, this.max().y)
        })
    }
    min() {
        return this.points[0]
    }
    max() {
        return this.points[1]
    }
    get4Points() {
        return [
            new vec2(this.min().x, this.max().y),
            new vec2(this.max().x, this.max().y),
            new vec2(this.min().x, this.min().y),
            new vec2(this.max().x, this.min().y),
        ]
    }
    overlaps(v) {
        if (v instanceof AABB) {
            return !(
                    this.max().x < v.min().x
                ||  this.max().y < v.min().y
                ||  this.min().x > v.max().x
                ||  this.min().y > v.max().y
            )
        }
        if (v instanceof Circle) {
            return v.overlaps(this)
        }
        return false
    }
    hasPoint(p) {
        return ( 
            p.x >= this.min().x && p.x <= this.max().x &&
            p.y >= this.min().y && p.y <= this.max().y
        )
    }
    draw() {
        if (this.min() == null) return
        fill(this.fillColor)
        strokeWeight(this.outlineSize)
        stroke(this.strokeColor)
        let w = this.max().x - this.min().x
        let h = this.max().y - this.min().y 
        rect(this.min().x, this.min().y, w, h)
        strokeWeight(1)
    }
}

class Circle extends Volume {
    fit(group) {
        this.center(group[0].copy())
        let minRadius2 = Infinity
        for (let k = 0; k < 100; k++) {
            let currentCenter = this.center().copy()
            for (let i = 0; i < 6; i++) {
                let c = this.center().add(
                    new vec2(random(-25, 25), random(-25, 25))
                )
                let r2 = 0
                group.forEach(p => {
                    let d2 = p.sub(c).dot() // Distância ao quadrado
                    r2 = Math.max(r2, d2)
                })
                if (r2 < minRadius2) {
                    minRadius2 = r2
                    currentCenter = c
                }
            }
            this.center(currentCenter)
            this.radius = sqrt(minRadius2)
        }

    }
    center(p) {
        if (p != undefined)
            this.points[0] = p
        return this.points[0]
    }
    hasPoint(p) {
        return (this.center().sub(p).dot() <= this.radius*this.radius)
    }
    overlaps(v) {
        if (v instanceof AABB) {
            // Vamos transformar o círculo em um AABB
            let aabb = this.toAABB()
            // Se o AABB desse círculo não intersecta v, o círculo também não v
            if (!aabb.overlaps(v))
                return false
            // Caso contrário, o círculo também intersecta v se estiver entre os x ou y
            else if ((this.center().x >= v.min().x && this.center().x <= v.max().x)
                ||   (this.center().y >= v.min().y && this.center().y <= v.max().y))
                return true
            // Caso contrário, só falta checar se toca em alguma ponta
            let pi = null
            v.get4Points().forEach(p => {
                if (this.hasPoint(p)) pi = p
            })
            return pi != null
            return false
        }
        // Círculo com Círculo (distância dos centros <= soma dos raios)
        if (v instanceof Circle) {
            let centerDistance = this.center().sub(v.center()).dot()
            let radiusSum = (this.radius + v.radius)**2
            return (centerDistance <= radiusSum)
        }
        return false
    }
    draw() {
        if (this.center() == null) return
        fill(this.fillColor)
        strokeWeight(this.outlineSize)
        stroke(this.strokeColor)
        circle(this.center().x, this.center().y, 2*this.radius) 
        strokeWeight(1)
    }
    toAABB() {
        let v = new AABB()
        v.fit([
            this.center().add(new vec2(this.radius, this.radius)),
            this.center().sub(new vec2(this.radius, this.radius))
        ])
        return v
    }
}