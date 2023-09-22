// Define our labelmap
const labelMap = {
  0: { name: '0', color: 'purple' },
  1: { name: '1', color: 'red' },
  2: { name: '2', color: 'yellow' },
  3: { name: '3', color: 'lime' },
  4: { name: '4', color: 'blue' },
  5: { name: '5', color: 'orange' },
  6: { name: '6', color: 'black' },
  7: { name: '7', color: 'white' },
  8: { name: '8', color: 'darkred' },
  9: { name: '9', color: 'darkblue' },
}

// Define a drawing function
export const drawRect = (predictedValue, ctx, x, y, width, height) => {

  // Extract variables
  // let x = 25;
  // let y = 25;
  // let width = 320;
  // let height = 240;

  // Set styling
  ctx.strokeStyle = labelMap[predictedValue]['color']
  ctx.lineWidth = 1
  ctx.fillStyle = labelMap[predictedValue]['color']
  ctx.font = '70px Arial'

  // DRAW!!
  ctx.beginPath()
  ctx.rect(x, y, width, height);
  ctx.fillText(labelMap[predictedValue]['name'], (x+(width/2.5)), (y+310))
  
  ctx.stroke()

}