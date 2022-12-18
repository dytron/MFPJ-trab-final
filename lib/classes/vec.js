// Vetor de 2 dimensões
class vec2
{
  constructor(x = 0, y = 0)
  {    
    this.x = x
    this.y = y
  }
  // Módulo do vetor
  len() {
    return sqrt(this.x**2 + this.y**2)
  }
  // Multiplica vetor por escalar k
  mul(k) {
    return new vec2(this.x*k, this.y*k)
  }
  // Retorna o vetor normalizado
  normalized() {
    let length = this.len()
    if (length === 1)
      return this.mul(1)
    return this.mul(1 / length)
  }
  // Retorna cópia
  copy() {
    return new vec2(this.x, this.y)
  }
}