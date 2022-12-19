// Índice do grupo de pontos em modificação
var groupIndex = 0
// Grupos de pontos
var pointsGroup = [[]]
// Estado
const STATE = {
  ADD_POINTS: 0,            // Adicionar pontos
  SELECT_VOLUME: 1,         // Selecionar volume
  MOVING_VOLUME: 2          // Movendo volume 
}
let state = STATE.ADD_POINTS
// Botões
var btnAdd, btnCreate, btnMove
var volumeList = []
var selected = {
  volume: null, // Instância do volume
  points: [],   // Pontos do volume quando havia sido selecionado
  group: [],    // Pontos da nuvem quando o volume havia sido selecionado
  index: -1     // Índice na lista de Volumes / Grupos
}
// Cor normal
var COLOR_DEFAULT = 'rgba(50, 205, 50, 0.5)'
// Cor em caso de interseção
var COLOR_OVERLAP = 'rgba(255, 0, 0, 0.5)'
const pointSize = 3
function setup() {
  cursor('arrow')
  let canvas = createCanvas(500, 500)
  // Adicionar pontos
  btnAdd = Button('Adicionar Pontos')
  btnAdd.mousePressed(() => {
    state = STATE.ADD_POINTS
  })
  // Criar Volume
  btnCreate = Button('Criar AABB')
  btnCreate.mousePressed(() => {
    if (pointsGroup[groupIndex].length === 0) return
    let v = new AABB()
    v.fit(pointsGroup[groupIndex])
    volumeList.push(v)
    pointsGroup[++groupIndex] = []
  })
  btnCreate3 = Button('Criar O')
  btnCreate3.mousePressed(() => {
    if (pointsGroup[groupIndex].length === 0) return
    let v = new Circle()
    v.fit(pointsGroup[groupIndex])
    volumeList.push(v)
    pointsGroup[++groupIndex] = []
    print('teste')
  })
  // Mover
  btnMove = Button('Mover')
  btnMove.mousePressed(() => {
    state = STATE.SELECT_VOLUME
    selectedVolume = null
  })
}

function draw() {
  goCartesian()
  colore('black')

  let type = ARROW
  let mousePoint = new vec2(mouseXC, mouseYC)
  if (state == STATE.ADD_POINTS) {
    colore('grey')
    circle(mousePoint.x, mousePoint.y, pointSize)
    colore('black')
  }
  if (state === STATE.MOVING_VOLUME) {
    if (selected.volume != null) {
      let mouseMove = mousePoint.sub(mouseOrigin)
      selected.volume.points = []
      for (let i = 0; i < selected.points.length; i++) {
        selected.volume.points[i] = selected.points[i].add(mouseMove)
      }
      for (let i = 0; i < selected.group.length; i++) {
        pointsGroup[selected.index][i] = selected.group[i].add(mouseMove)
      }
    }
  }

  // Desenhar os pontos de cada grupo de pontos
  pointsGroup.forEach(
    group => group.forEach(
      p => circle(p.x, p.y, pointSize)
    )
  )

  volumeList.forEach(v => {
    v.fillColor = COLOR_DEFAULT
    v.outlineSize = 1
    // Deixa o contorno mais grosso se o mouse estiver dentro
    if (v.hasPoint(mousePoint)) {
      v.outlineSize = 3
      if (state != STATE.ADD_POINTS)
        type = MOVE
    }
  })
  cursor(type)
  volumeList.forEach(v => {
    volumeList.forEach(v2 => {
      if (v != v2 && v.overlaps(v2)) {
        v.fillColor = v2.fillColor = COLOR_OVERLAP
      }
    })
  })

  volumeList.forEach(v => v.draw())
}

function mousePressed() {
  let mousePoint = new vec2(mouseXC, mouseYC)
  // Ignora se o clique for fora do canvas
  if (abs(mouseXC) * 2 > width || abs(mouseYC) * 2 > height) return
  switch(state) {
    case STATE.ADD_POINTS:
      pointsGroup[groupIndex].push(new vec2(mouseXC, mouseYC))
      break
    case STATE.SELECT_VOLUME:
    case STATE.MOVING_VOLUME:
      for (let i = volumeList.length - 1; i >= 0; i--) {
        v = volumeList[i]
        if (selected.volume == null && v.hasPoint(mousePoint)) {
          selected.volume = v
          selected.points = v.getPoints()
          selected.index = i
          selected.group = []
          pointsGroup[i].forEach(p => {
            selected.group.push(p.copy())
          })
          state = STATE.MOVING_VOLUME
          mouseOrigin = mousePoint.copy()
          return
        }
      }
      break
  }
}

function mouseReleased() {
  if (state == STATE.MOVING_VOLUME) {
    state == STATE.SELECT_VOLUME
  }
  selected.volume = null
}