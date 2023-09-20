// Define our labelmap
const labelMap = {
  0: { name: 'A', color: 'purple' },
  1: { name: 'B', color: 'red' },
  2: { name: 'C', color: 'yellow' },
  3: { name: 'D', color: 'lime' },
  4: { name: 'E', color: 'blue' },
  5: { name: 'F', color: 'orange' },
  6: { name: 'G', color: 'black' },
  7: { name: 'H', color: 'white' },
  8: { name: 'I', color: 'darkred' },
  9: { name: 'K', color: 'darkblue' },
  10: { name: 'L', color: 'purple' },
  11: { name: 'M', color: 'red' },
  12: { name: 'N', color: 'yellow' },
  13: { name: 'O', color: 'lime' },
  14: { name: 'P', color: 'blue' },
  15: { name: 'Q', color: 'orange' },
  16: { name: 'R', color: 'black' },
  17: { name: 'S', color: 'white' },
  18: { name: 'T', color: 'darkred' },
  19: { name: 'U', color: 'darkblue' },
  20: { name: 'V', color: 'purple' },
  21: { name: 'W', color: 'red' },
  22: { name: 'X', color: 'yellow' },
  23: { name: 'Y', color: 'lime' },
}

// Define a drawing function
export const drawRect = (predictedValue, ctx) => {

  // Extract variables

  // Set styling
  ctx.strokeStyle = labelMap[predictedValue]['color']
  ctx.lineWidth = 1
  ctx.fillStyle = labelMap[predictedValue]['color']
  ctx.font = '70px Arial'
  let x = 25;
  let y = 25;
  let width = 320;
  let height = 240;

  // DRAW!!
  ctx.beginPath()
  ctx.rect(x, y, width, height);
  ctx.fillText(labelMap[predictedValue]['name'], (x+(width/2.5)), (y+310))
  
  ctx.stroke()

}