// Dupla
// Guilherme Alfaia Caetano - 493695
// Carlos Magno Dantas de Figueirêdo Belém - 495914

// Link para testar: https://editor.p5js.org/guilhermealfaiagui1/full/rKLemqNSl
// Obs: O teste de interseção (Volume x ponto) pode ser feito colocando o mouse em cima

// Índice do grupo de pontos em modificação
var groupIndex = 0;
// Grupos de pontos
var pointsGroup = [[]];
// Estado
const STATE = {
  ADD_POINTS: 0, // Adicionar pontos
  SELECT_VOLUME: 1, // Selecionar volume
  MOVING_VOLUME: 2, // Movendo volume
};
let state = STATE.ADD_POINTS;
// Botões
var btnAdd, btnCreate, btnMove, chk;
var label;
var volumeList = [];
var selected = {
  volume: null, // Instância do volume
  points: [], // Pontos do volume quando havia sido selecionado
  group: [], // Pontos da nuvem quando o volume havia sido selecionado
  index: -1, // Índice na lista de Volumes / Grupos
};
// Cor normal
var COLOR_DEFAULT = "rgba(50, 205, 50, 0.5)";
// Cor em caso de interseção
var COLOR_OVERLAP = "rgba(255, 0, 0, 0.5)";
const pointSize = 3;
function createVolume(v) {
  if (pointsGroup[groupIndex].length === 0) return;
  v.fit(pointsGroup[groupIndex]);
  volumeList.push(v);
  pointsGroup[++groupIndex] = [];
}
function setup() {
  cursor("arrow");
  createCanvas(500, 500);
  // Adicionar pontos
  btnAdd = Button("Adicionar Pontos");
  btnAdd.mousePressed(() => {
    state = STATE.ADD_POINTS;
    label.html("Clique na tela para inserir pontos.");
  });
  // Criar Volume
  btnCreate = Button("Criar AABB");
  btnCreate.mousePressed(() => {
    createVolume(new AABB());
  });
  btnCreate2 = Button("Criar OBB");
  btnCreate2.mousePressed(() => {
    createVolume(new OBB());
  });
  btnCreate3 = Button("Criar O");
  btnCreate3.mousePressed(() => {
    createVolume(new Circle());
  });
  // Mover
  btnMove = Button("Mover");
  btnMove.mousePressed(() => {
    state = STATE.SELECT_VOLUME;
    selectedVolume = null;
    label.html("Clique e arraste o volume envoltório desejado.");
  });
  label = Label("Clique na tela para inserir pontos.");
  chk = Checkbox("Esconder nuvem de pontos.");
}

function draw() {
  goCartesian();
  colore("black");

  let type = ARROW;
  let mousePoint = new vec2(mouseXC, mouseYC);
  if (state == STATE.ADD_POINTS) {
    colore("grey");
    circle(mousePoint.x, mousePoint.y, pointSize);
    colore("black");
  }
  if (state === STATE.MOVING_VOLUME) {
    if (selected.volume != null) {
      let mouseMove = mousePoint.sub(mouseOrigin);
      selected.volume.points = [];
      for (let i = 0; i < selected.points.length; i++) {
        selected.volume.points[i] = selected.points[i].add(mouseMove);
      }
      for (let i = 0; i < selected.group.length; i++) {
        pointsGroup[selected.index][i] = selected.group[i].add(mouseMove);
      }
    }
  }

  // Desenhar os pontos de cada grupo de pontos
  pointsGroup.forEach((group, i) => {
    if (i === groupIndex || !chk.checked()) {
      group.forEach((p) => circle(p.x, p.y, pointSize));
    }
  });

  volumeList.forEach((v) => {
    v.fillColor = COLOR_DEFAULT;
    v.outlineSize = 1;
    // Deixa o contorno mais grosso se o mouse estiver dentro
    if (v.hasPoint(mousePoint)) {
      v.outlineSize = 3;
      if (state != STATE.ADD_POINTS) type = MOVE;
    }
  });
  cursor(type);
  volumeList.forEach((v) => {
    volumeList.forEach((v2) => {
      if (v != v2 && v.overlaps(v2)) {
        v.fillColor = v2.fillColor = COLOR_OVERLAP;
      }
    });
  });

  volumeList.forEach((v) => {
    v.draw();
  });
}

function mousePressed() {
  let mousePoint = new vec2(mouseXC, mouseYC);
  // Ignora se o clique for fora do canvas
  if (abs(mouseXC) * 2 > width || abs(mouseYC) * 2 > height) return;
  switch (state) {
    case STATE.ADD_POINTS:
      pointsGroup[groupIndex].push(new vec2(mouseXC, mouseYC));
      break;
    case STATE.SELECT_VOLUME:
    case STATE.MOVING_VOLUME:
      for (let i = volumeList.length - 1; i >= 0; i--) {
        v = volumeList[i];
        if (selected.volume == null && v.hasPoint(mousePoint)) {
          selected.volume = v;
          selected.points = v.getPoints();
          selected.index = i;
          selected.group = [];
          pointsGroup[i].forEach((p) => {
            selected.group.push(p.copy());
          });
          state = STATE.MOVING_VOLUME;
          mouseOrigin = mousePoint.copy();
          return;
        }
      }
      break;
  }
}

function mouseReleased() {
  if (state == STATE.MOVING_VOLUME) {
    state == STATE.SELECT_VOLUME;
  }
  selected.volume = null;
}
