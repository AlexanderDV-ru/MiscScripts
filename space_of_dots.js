let dotsSet=[]
let dotsArray=[]
for(let x=0;x<10;x++)
	for(let y=0;y<10;y++)
		dotsSet.push(dotsArray[x*10+y]={energy:Math.random()<0.5?0:0,neighbours:[]})
function connect(dot0,dot1) {
	console.log(dot0);
	if(dot0.neighbours.indexOf(dot1)==-1)dot0.neighbours.push(dot1)
	if(dot1.neighbours.indexOf(dot0)==-1)dot1.neighbours.push(dot0)
}
function frame(n,s) {
	return (n%s+s)%s
}
for(let x=0;x<10;x++)
	for(let y=0;y<10;y++){
		let dontCheck=true
		if(x*10+y-10>=0&&x*10+y-10<100||dontCheck)	connect(dotsArray[x*10+y],dotsArray[frame(x*10+y-10,100)])
		if(x*10+y+10>=0&&x*10+y+10<100||dontCheck)	connect(dotsArray[x*10+y],dotsArray[frame(x*10+y+10,100)])
		if(x*10+y-1>=0&&x*10+y-1<100||dontCheck)	connect(dotsArray[x*10+y],dotsArray[frame(x*10+y-1,100)])
		if(x==2&&y==5||x==7&&y==4)
		{
			connect(dotsArray[2*10+5],dotsArray[7*10+4])
			dotsArray[2*10+5].energy=1
			dotsArray[7*10+4].energy=1
		}
		else if(x*10+y+1>=0&&x*10+y+1<100||dontCheck)	connect(dotsArray[x*10+y],dotsArray[frame(x*10+y+1,100)])
	}
let current=[document.createElement("button"),dotsSet[4]]
document.body.appendChild(current[0])
let canvas=document.createElement("canvas")
document.body.appendChild(canvas)
let ctx=canvas.getContext('2d');
let canvas2=document.createElement("canvas")
document.body.appendChild(canvas2)
let ctx2=canvas2.getContext('2d');
let neighbours=[]
function update(dot){
	current[0].innerHTML=dot.energy
	for(let i=0;i<4;i++)
		neighbours[i][0].innerHTML=""
	ctx.clearRect(0,0,120,120)
	ctx2.clearRect(0,0,120,120)
	for(let x=0;x<10;x++)
		for(let y=0;y<10;y++)
		{
			ctx2.fillStyle=dotsArray[x*10+y].energy?"white":"black"
			ctx2.fillRect(x*12,y*12,12,12)
		}
	ctx2.strokeStyle="red"
	ctx2.strokeRect((dotsArray.indexOf(dot)-dotsArray.indexOf(dot)%10)/10*12,dotsArray.indexOf(dot)%10*12,12,12)
	for(let i=0;i<dot.neighbours.length;i++){
		let nb=""
		neighbours[i][1]=dot.neighbours[i]
		for(let n=0;n<dot.neighbours[i].neighbours.length;n++)
			nb+=dot.neighbours[i].neighbours[n].energy
		neighbours[i][0].innerHTML=(dot.neighbours[i]?dot.neighbours[i].energy:"")+"("+nb+")"
		ctx.beginPath();
		ctx.moveTo(60,60)
		let angle=i/dot.neighbours.length*3.14*2
		ctx.lineTo(60-Math.sin(angle)*30,60-Math.cos(angle)*30)
		ctx.stroke();
		ctx.fillStyle=dot.neighbours[i].energy?"white":"black"
		ctx.fillRect(60-Math.sin(angle)*30-3,60-Math.cos(angle)*30-3,6,6)
	}
	ctx.fillStyle=dot.energy?"white":"black"
	ctx.fillRect(60-3,60-3,6,6)
	console.log(dot)
}
for(let i=0;i<8;i++){
	neighbours[i]=[document.createElement("button")]
	document.body.appendChild(neighbours[i][0])
	let c=i
	neighbours[i][0].onclick=()=>update(neighbours[c][1])
}
update(current[1])
