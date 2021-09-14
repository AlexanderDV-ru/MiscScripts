let dotsSet=[]
function connect(dot0,dot1) {
	if(dot0.neighbours.indexOf(dot1)==-1)dot0.neighbours.push(dot1)
	if(dot1.neighbours.indexOf(dot0)==-1)dot1.neighbours.push(dot0)
}
function frame(n,s) {
	return (n%s+s)%s
}
function fill(dontCheck) {
	let dotsArray=[]
	let cellsCountX=100,cellsCountY=100,cellsCountZ=1
	for(let x=0;x<cellsCountX;x++)
		for(let y=0;y<cellsCountY;y++)
			for(let z=0;z<cellsCountZ;z++)
				dotsSet.push(dotsArray[x*cellsCountY+y]={energy:Math.random()<0.9?"black":"green",neighbours:[]})
	function inBounds(dot,boundsMin,boundsMax) {
		if(!boundsMin)
			boundsMin=[0,0,0]
		if(!boundsMax)
			boundsMax=[cellsCountX-1,cellsCountY-1,cellsCountZ-1]
		for(let i=0;i<dot.length;i++)
			if(dot[i]<boundsMin[i]||dot[i]>boundsMax[i])
				return false
		return true
	}
	function getDot(x,y,z) {
		return dotsArray[(frame(x,cellsCountX)*cellsCountY+frame(y,cellsCountY))*cellsCountZ+frame(z,cellsCountZ)]
	}
	for(let x=0;x<cellsCountX;x++)
		for(let y=0;y<cellsCountY;y++)
			for(let z=0;z<cellsCountZ;z++)
			{
				let cur=getDot(x,y,z)
				let allCount=cellsCountX*cellsCountY*cellsCountZ
				if(inBounds([x+1,y,z])||dontCheck)
					connect(cur,getDot(x+1,y,z))
				if(inBounds([x-1,y,z])||dontCheck)
					connect(cur,getDot(x-1,y,z))
				if(inBounds([x,y+1,z])||dontCheck)
					connect(cur,getDot(x,y+1,z))
				if(inBounds([x,y-1,z])||dontCheck)
					connect(cur,getDot(x,y-1,z))
				if(x==2&&y==5||x==7&&y==4)
					connect(dotsArray[2*cellsCountY+5],dotsArray[7*cellsCountY+4])
			}
	function updateField(dot,cellSize) {
		if(!cellSize&&cellSize!==0)
			cellSize=4
		ctx2.clearRect(0,0,cellSize*cellsCountX,cellSize*cellsCountY)
		ctx2.strokeStyle="blue"
		for(let x=0;x<cellsCountX;x++)
			for(let y=0;y<cellsCountY;y++)
				for(let z=0;z<cellsCountZ;z++)
				{
					let cur=getDot(x,y,z)
					ctx2.fillStyle=cur.energy
					ctx2.fillRect(x*cellSize,y*cellSize,cellSize,cellSize)
					if(cur.neighbours.length>4)
						ctx2.strokeRect(x*cellSize,y*cellSize,cellSize,cellSize)
				}
		ctx2.strokeStyle="red"
		ctx2.strokeRect((dotsArray.indexOf(dot)-dotsArray.indexOf(dot)%cellsCountY)/cellsCountY*cellSize,dotsArray.indexOf(dot)%cellsCountY*cellSize,cellSize,cellSize)
	}
	let updateIntervalID=setInterval(()=>{
		updateField(current)
	},100)
}
fill(prompt("Enter 1 to wall bounds, else don't enter anything")?false:true)
let canvas=document.createElement("canvas"),ctx=canvas.getContext('2d')
document.body.appendChild(canvas)
let canvasZones=[]
let canvas2=document.createElement("canvas"),ctx2=canvas2.getContext('2d')
document.body.appendChild(canvas2)
canvas2.height=canvas2.width=500
let current=dotsSet[4]
function paths(dot0,dot1) {
	let ps={common:[]}
	for(let d0 of dot0.neighbours)
		for(let d1 of dot1.neighbours)
			if(d0==d1)
				ps.common.push(d0)
	return ps
}
function updateDot(dot,r,dotSize,lineLength,x,y,ignoringDots){
	if(!dotSize&&dotSize!==0)
		dotSize=6
	if(!x&&x!==0)
		x=120
	if(!y&&y!==0)
		y=60
	if(!lineLength&&lineLength!==0)
		lineLength=60
	if(!ignoringDots)
		ignoringDots=[]
	for(let i=0;i<dot.neighbours.length;i++)
	{
		let cur=dot.neighbours[i]
		if(ignoringDots.indexOf(cur)==-1){
			let repeat=null
			for(let z=0;z<canvasZones.length;z++)
				if(canvasZones[z].dot==cur)
					repeat=canvasZones[z]
			ctx.beginPath();
			ctx.moveTo(x,y)
			let curX,curY
			if(repeat)
				ctx.lineTo(curX=(repeat.minX+repeat.maxX)/2,curY=(repeat.minY+repeat.maxY)/2)
			else
			{
				let angle=(i/dot.neighbours.length+1/(r+2))*3.14*2
				ctx.lineTo(curX=x-Math.sin(angle)*lineLength,curY=y-Math.cos(angle)*lineLength)
				ctx.fillStyle=cur.energy
				ctx.fillRect(x-Math.sin(angle)*lineLength-dotSize/2,y-Math.cos(angle)*lineLength-dotSize/2,dotSize,dotSize)
				canvasZones.push({minX:x-Math.sin(angle)*lineLength-dotSize/2,minY:y-Math.cos(angle)*lineLength-dotSize/2,maxX:x-Math.sin(angle)*lineLength+dotSize/2,maxY:y-Math.cos(angle)*lineLength+dotSize/2,dot:cur})
			}
			ctx.stroke();
			if(r>0)
				updateDot(cur,r-1,dotSize,lineLength/2,curX,curY,[dot])
		}
	}
	ctx.fillStyle=dot.energy
	ctx.fillRect(x-dotSize/2,y-dotSize/2,dotSize,dotSize)
}
canvas.onclick=(e)=>{
	for(let i=0;i<canvasZones.length;i++)
		if(e.offsetX>=canvasZones[i].minX)
			if(e.offsetY>=canvasZones[i].minY)
				if(e.offsetX<=canvasZones[i].maxX)
					if(e.offsetY<=canvasZones[i].maxY)
						current=canvasZones[i].dot
}
function giveColor(text,color) {
	if(!color)
		color=text
	return "<label style=\"color:"+color+"\">"+text+"</label>"
}
function tick() {
	for(let i=0;i<dotsSet.length;i++)
	{
		let cur=dotsSet[i]
		switch (cur.energy) {
			case "yellow":
			case "gray":
				let n=(Math.random()*cur.neighbours.length)
				n=n-n%1
				if(cur.neighbours[n].energy=="black")
				{
					cur.neighbours[n].energy=cur.energy
					if(cur.energy!="gray")
						cur.energy="black"
				}
				break;
			case "green":
				for(let neighbour of cur.neighbours)
				{
					let ps=paths(cur.sourceNeighbour||cur.neighbours[Math.floor(Math.random()*cur.neighbours.length)], neighbour)
					if(ps.common.length==1&&cur.energy!="black")
					{
						cur.energy=neighbour.energy
						neighbour.energy="green"
						neighbour.sourceNeighbour=cur
					}
				}
				break;
		}
	}
}
let tickIntervalID=setInterval(()=>{
	tick()
	ctx.clearRect(0,0,600,600)
	canvasZones=[]
	updateDot(current,1)
},100)
