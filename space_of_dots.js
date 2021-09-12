let dotsSet=[]
let dotsArray=[]
let cellsCountX=30,cellsCountY=30,cellsCountZ=1
for(let x=0;x<cellsCountX;x++)
	for(let y=0;y<cellsCountY;y++)
		for(let z=0;z<cellsCountZ;z++)
			dotsSet.push(dotsArray[x*cellsCountY+y]={energy:Math.random()<0.9?"black":"green",neighbours:[]})
function connect(dot0,dot1) {
	console.log(dot0);
	if(dot0.neighbours.indexOf(dot1)==-1)dot0.neighbours.push(dot1)
	if(dot1.neighbours.indexOf(dot0)==-1)dot1.neighbours.push(dot0)
}
function frame(n,s) {
	return (n%s+s)%s
}
function fill(dontCheck) {
	for(let x=0;x<cellsCountX;x++)
		for(let y=0;y<cellsCountY;y++)
			for(let z=0;z<cellsCountZ;z++){
				let allCount=cellsCountX*cellsCountY*cellsCountZ
				if(x*cellsCountY+y-cellsCountY>=0&&x*cellsCountY+y-cellsCountY<allCount||dontCheck)	connect(dotsArray[x*cellsCountY+y],dotsArray[frame(x*cellsCountY+y-cellsCountY,allCount)])
				if(x*cellsCountY+y+cellsCountY>=0&&x*cellsCountY+y+cellsCountY<allCount||dontCheck)	connect(dotsArray[x*cellsCountY+y],dotsArray[frame(x*cellsCountY+y+cellsCountY,allCount)])
				if(x*cellsCountY+y-cellsCountZ>=0&&x*cellsCountY+y-cellsCountZ<allCount||dontCheck)	connect(dotsArray[x*cellsCountY+y],dotsArray[frame(x*cellsCountY+y-cellsCountZ,allCount)])
				if(x==2&&y==5||x==7&&y==4)
				{
					connect(dotsArray[2*cellsCountY+5],dotsArray[7*cellsCountY+4])
					dotsArray[2*cellsCountY+5].energy="blue"
					dotsArray[7*cellsCountY+4].energy="blue"
				}
				else if(x*cellsCountY+y+cellsCountZ>=0&&x*cellsCountY+y+cellsCountZ<allCount||dontCheck)	connect(dotsArray[x*cellsCountY+y],dotsArray[frame(x*cellsCountY+y+cellsCountZ,allCount)])
			}
}
fill(prompt("Enter 1 to wall bounds, else don't enter anything")?false:true)
let canvas=document.createElement("canvas")
document.body.appendChild(canvas)
let ctx=canvas.getContext('2d');
let canvas2=document.createElement("canvas")
document.body.appendChild(canvas2)
let ctx2=canvas2.getContext('2d');
document.body.appendChild(document.createElement("br"))
let current=[document.createElement("button"),dotsSet[4]]
document.body.appendChild(current[0])
let neighbours=[]
function updateField(dot,cellSize) {
	if(!cellSize&&cellSize!==0)
		cellSize=4
	ctx2.clearRect(0,0,cellSize*cellsCountX,cellSize*cellsCountY)
	for(let x=0;x<cellsCountX;x++)
		for(let y=0;y<cellsCountY;y++)
			for(let z=0;z<cellsCountZ;z++)
			{
				ctx2.fillStyle=dotsArray[x*cellsCountY+y].energy
				ctx2.fillRect(x*cellSize,y*cellSize,cellSize,cellSize)
			}
	ctx2.strokeStyle="red"
	ctx2.strokeRect((dotsArray.indexOf(dot)-dotsArray.indexOf(dot)%cellsCountY)/cellsCountY*cellSize,dotsArray.indexOf(dot)%cellsCountY*cellSize,cellSize,cellSize)
}
function updateDot(dot,r,dotSize,lineLength,x,y,ignoringDots){
	if(!dotSize&&dotSize!==0)
		dotSize=6
	if(!x&&x!==0)
		x=60
	if(!y&&y!==0)
		y=60
	if(!lineLength&&lineLength!==0)
		lineLength=40
	if(!ignoringDots)
		ignoringDots=[]
	for(let i=0;i<dot.neighbours.length;i++)
	{
		let cur=dot.neighbours[i]
		if(ignoringDots.indexOf(cur)==-1){
			ctx.beginPath();
			ctx.moveTo(x,y)
			let angle=(i/dot.neighbours.length+1/(r+2))*3.14*2
			ctx.lineTo(x-Math.sin(angle)*lineLength,y-Math.cos(angle)*lineLength)
			ctx.stroke();
			ctx.fillStyle=cur.energy
			ctx.fillRect(x-Math.sin(angle)*lineLength-dotSize/2,y-Math.cos(angle)*lineLength-dotSize/2,dotSize,dotSize)
			if(r>0)
				updateDot(cur,r-1,dotSize,lineLength/2,x-Math.sin(angle)*lineLength,y-Math.cos(angle)*lineLength,[dot])
		}
	}
	ctx.fillStyle=dot.energy
	ctx.fillRect(x-dotSize/2,y-dotSize/2,dotSize,dotSize)
}
function giveColor(text,color) {
	if(!color)
		color=text
	return "<label style=\"color:"+color+"\">"+text+"</label>"
}
function update(dot){
	current[0].innerHTML=giveColor(dot.energy)
	current[1]=dot
	for(let i=0;i<4;i++)
		neighbours[i][0].innerHTML=""
	ctx.clearRect(0,0,120,120)
	updateField(dot)
	for(let i=0;i<dot.neighbours.length;i++){
		let nb=""
		neighbours[i][1]=dot.neighbours[i]
		for(let n=0;n<dot.neighbours[i].neighbours.length;n++)
			nb+=giveColor(dot.neighbours[i].neighbours[n].energy)+" "
		neighbours[i][0].innerHTML=giveColor(dot.neighbours[i]?dot.neighbours[i].energy:"")+"("+nb+")"
	}
	updateDot(dot,1)
}
document.body.appendChild(document.createElement("br"))
for(let i=0;i<8;i++){
	neighbours[i]=[document.createElement("button")]
	document.body.appendChild(neighbours[i][0])
	let c=i
	neighbours[i][0].onclick=()=>update(neighbours[c][1])
}
function tick() {
	for(let i=0;i<dotsSet.length;i++)
		if(dotsSet[i].energy=="yellow"||dotsSet[i].energy=="gray"||dotsSet[i].energy=="green")
		{
			let n=dotsSet[i].energy=="green"?0:(Math.random()*dotsSet[i].neighbours.length)
			n=n-n%1
			if(dotsSet[i].neighbours[n].energy=="black")
			{
				dotsSet[i].neighbours[n].energy=dotsSet[i].energy
				if(dotsSet[i].energy!="gray")
					dotsSet[i].energy="black"
			}
		}
}
let updateIntervalID=setInterval(()=>{
},100)
let tickIntervalID=setInterval(()=>{
tick()
update(current[1])
},1000)
