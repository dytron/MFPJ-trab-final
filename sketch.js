var points = []
var btnCreate
var aabb = new AABB()
function setup() {
  createCanvas(500, 500)
  btnCreate = createButton('Criar')
  btnCreate.mousePressed(() => {
    aabb.fit(points)
  })
}

function draw() {
  goCartesian()
  colore('black')
  points.forEach(p => circle(p.x, p.y, 5))
  aabb.draw()
}

function mousePressed() {
  if (abs(mouseXC) * 2 > width || abs(mouseYC) * 2 > height) return
  points.push(new vec2(mouseXC, mouseYC))
}