//short
//let i=2000;for(let v=1;v<6;v++)i+=i*0.1;alert(i)
//long
function floorPlus(number,modif,func) {
	return (func||Math.floor)(number/modif)*modif
}
function needfulExp(level, beginVal, stepMultiplier, dontFloor, floorPlusModif, floorCur, floorI, floorPlusFunc, beginLevel) {
	level=level!=undefined?level:6
	beginVal=beginVal!=undefined?beginVal:2000
	stepMultiplier=stepMultiplier!=undefined?stepMultiplier:0.1
	beginLevel=beginLevel!=undefined?beginLevel:1

	let i=beginVal
	for(let v=beginLevel;v<level;v++)
	{
		let cur=i*stepMultiplier

		if(floorCur)
			cur=floorPlus(cur, floorPlusModif, floorPlusFunc)

		if(floorI%2==1)
			i=floorPlus(i, floorPlusModif, floorPlusFunc)
		i+=cur

		if(floorI>1)
			i=floorPlus(i, floorPlusModif, floorPlusFunc)
	}
	return dontFloor?i:Math.floor(i)
}
let text=""
let levels=[1,2,3,4,5,6,36,37,38]/*[1,6,36,38]*/
for(let v of levels)
	text+=v+": "+needfulExp(v)+"\n"
alert(text)
