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
  10: { name: 'A', color: 'purple' },
  11: { name: 'B', color: 'red' },
  12: { name: 'C', color: 'yellow' },
  13: { name: 'D', color: 'lime' },
  14: { name: 'E', color: 'blue' },
  15: { name: 'F', color: 'orange' },
  16: { name: 'G', color: 'black' },
  17: { name: 'H', color: 'white' },
  18: { name: 'I', color: 'darkred' },
  19: { name: 'K', color: 'darkblue' },
  20: { name: 'L', color: 'purple' },
  21: { name: 'M', color: 'red' },
  22: { name: 'N', color: 'yellow' },
  23: { name: 'O', color: 'lime' },
  24: { name: 'P', color: 'blue' },
  25: { name: 'Q', color: 'orange' },
  26: { name: 'R', color: 'black' },
  27: { name: 'S', color: 'white' },
  28: { name: 'T', color: 'darkred' },
  29: { name: 'U', color: 'darkblue' },
  30: { name: 'V', color: 'purple' },
  31: { name: 'W', color: 'red' },
  32: { name: 'X', color: 'yellow' },
  33: { name: 'Y', color: 'lime' },
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