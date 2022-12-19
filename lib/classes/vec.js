// Vetor de 2 dimensões
class vec2
{
  constructor(x = 0, y = 0)
  {    
    this.x = x
    this.y = y
  }
  /// produto escalar, retorna um 'float'
  dot(v = this)
  {
    return this.x*v.x + this.y*v.y
  }
  /// produto vetorial em 2D: retorna um 'float', i.e., z de um vetor 3D (0,0,z)
  cross(v)
  {
    return this.x*v.y - this.y*v.x
  }
  /// retorna o comprimento do vetor
  len()
  {
    return sqrt( this.dot(this  ) )
  }
  /// subtração vetorial: retorna this - v
  sub(v)
  {
    return new vec2(this.x - v.x,this.y - v.y)
  }
  /// adição vetorial: retorna this + v
  add(v)
  {
    return new vec2(this.x + v.x,this.y + v.y)
  }
  /// adição com produto por escalar 's': retorna this + s*v
  madd(s,v)
  {
    return new vec2(this.x + s*v.x,this.y + s*v.y)
  }
  // interpolação linear de (this) para v: retorna this + (v - this)*t
  lerp(v, t)
  {
    return this.madd(t, v.sub(this))
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