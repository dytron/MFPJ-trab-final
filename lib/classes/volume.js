class Volume {
    constructor() {
        this.isSelected = false
        this.fillColor = 'rgba(255, 0, 0, 0.5)'
        this.strokeColor = 'black'
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
    constructor() {
        super()
        this.min = null
        this.max = null
    }
    fit(points) {
        this.min = points[0].copy()
        this.max = points[0].copy()
        // Agora para cada ponto
        points.forEach(p => { 
            this.min.x = Math.min(p.x, this.min.x)
            this.max.x = Math.max(p.x, this.max.x)
            this.min.y = Math.min(p.y, this.min.y)
            this.max.y = Math.max(p.y, this.max.y)
        })
    }
    overlaps(v) {
        if (v instanceof AABB) {
            return !(
                    this.max.x < v.min.x
                ||  this.max.y < v.min.y
                ||  this.min.x > v.max.x
                ||  this.min.y > v.max.y
            )
        }
    }
    hasPoint(p) {
        return ( 
            p.x >= this.min.x && p.x <= this.max.x &&
            p.y >= this.min.y && p.y <= this.max.y
        )
    }
    draw() {
        if (this.min == null) return
        fill(this.fillColor)
        stroke(this.strokeColor)
        let w = this.max.x - this.min.x
        let h = this.max.y - this.min.y 
        rect(this.min.x, this.min.y, w, h)
    }
}