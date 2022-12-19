/* Clique na seta > do lado de drawing.js para ver os outros arquivos
 * Desenha o plano de fundo da cena. Sobrescreva de acordo com suas necessidades.
 * Além disso, desenha um plano cartesiano centrado na origem, i.e., os 2 eixos.
 * 
 * NOTA: A partir dessa chamada, toda a cena é desenhada de acordo com o sistema
 *       cartesiano, i.e., a origem está no centro da tela, o eixo Y cresce para
 *       cima e o eixo X para a direita. Isso foi projetado para simplificar os
 *       trabalhos.
 */
function goCartesian()
{
  background(255)
  
  mouseXC = mouseX - width/2
  mouseYC = height/2 - mouseY
  
  colore(128,0,0)
  arrow(0,height/2,width, height/2)
  texto('x', width / 2 - 16, - 16)
  colore(0,128,0)
  arrow(width/2,height,width/2, 0)
  texto('y', 16, height / 2 - 16)
  
  translate(width/2,height/2)
  scale(1,-1,1)
}

// atualiza as variáveis globais com as coordenadas do mouse no plano cartesiano
function grabMouse()
{
  mouseXC = mouseX - width/2
  mouseYC = height/2 - mouseY
}

// renderiza texto corretamente no plano cartesiano
function texto(str,x,y)
{
  push()
    resetMatrix();
    translate(width/2,height/2)
    // desenha o texto normalmente
    text(str,x,-y)
  pop()
}


/* Define as cores de preenchimento e de contorno com o mesmo valor.
 * Há várias opções de trabalho em RGB nesse caso:
 *  - caso c1,c2,c3 e c4 sejam passados, o efeito padrão é uma cor RGBA
 *  - caso c1,c2 e c3 sejam passados, tem-se uma cor RGB.
 *  - caso c1 e c2 sejam passados, c1 é um tom de cinza e c2 é opacidade.
 *  - caso apenas c1 seja passado, c1 é um tom de cinza.
 */
function colore(c1,c2,c3,c4)
{
  if(c4 != null)
  {
    fill(c1,c2,c3,c4)
    stroke(c1,c2,c3,c4)
    return
  }
  if(c3 != null)
  {
    fill(c1,c2,c3)
    stroke(c1,c2,c3)
    return
  }
  
  if(c2 == null )
  {
    fill(c1)
    stroke(c1)
  }
  else
  {
    fill(c1,c1,c1,c2)
    stroke(c1,c1,c1,c2)
  }    
}

/* Desenha um segmento de reta com seta do ponto (x1,y1) para (x2,y2)
 */
function arrow(x1,y1,x2,y2)
{
  line(x1,y1,x2,y2)
  var dx = x2-x1, dy = y2-y1
  var le = sqrt(dx*dx + dy*dy)
  var vx = dx/le, vy = dy/le
  var ux = -vy
  var uy = vx
  triangle(x2,y2,
           x2-5*vx+2*ux, y2-5*vy+2*uy,
           x2-5*vx-2*ux, y2-5*vy-2*uy)
}

function Button(name, parent = 'panel') {
  let b = createButton(name)
  b.parent(parent)
  return b
}