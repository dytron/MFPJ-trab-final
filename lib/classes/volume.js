class Volume {
    constructor() {
        this.isSelected = false
        this.fillColor = 'rgba(255, 0, 0, 0.5)'
        this.strokeColor = 'black'
        this.outlineSize = 1
        this.points = []
    }
    // Modificar pontos
    setPoints(points) {
        this.points = []
        points.forEach(p => {
            this.points.push(p.copy())
        })
    }
    // Obter pontos
    getPoints() {
        let list = this.points
        list.forEach(p => p.copy())
        return list
    }
    // Mover volume
    move(p) {

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
        this.points = []
    }
    move(d) {
        this.points.forEach(p => {p = p.add(d)})
    }
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
    overlaps(v) {
        if (v instanceof AABB) {
            return !(
                    this.max().x < v.min().x
                ||  this.max().y < v.min().y
                ||  this.min().x > v.max().x
                ||  this.min().y > v.max().y
            )
        }
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