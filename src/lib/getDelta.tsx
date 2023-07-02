const getDelta = (targetColor:string, currentColor:string) => {
  const targetR:number = parseInt(targetColor.split(',')[0])
  const targetG:number = parseInt(targetColor.split(',')[1])
  const targetB:number = parseInt(targetColor.split(',')[2])

  const currentR:number = parseInt(currentColor.split(',')[0])
  const currentG:number = parseInt(currentColor.split(',')[1])
  const currentB:number = parseInt(currentColor.split(',')[2])

  const delta = (1/255) * (1/(Math.sqrt(3))) * (Math.sqrt(
    (targetR-currentR) ** 2 + (targetG-currentG) ** 2 + (targetB-currentB) ** 2
  ))
  return delta
}

export default getDelta;