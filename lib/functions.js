//--- Name: Functions/Vesion: 0.1.5a/Authors: AlexanderDV/Description: Functions .js. ---
//Element hiding
function addHidingElement(hiding,hider,onFunc,init){
	hider.onchange=()=>{
		hiding.style.display=hider.checked?"":"none"
		if(onFunc)
			onFunc(hider.checked)
	}
	if(init!=undefined)
	{
		hider.checked=init
		hider.onchange()
	}
}
//Element moving
function addMovingElement(moving, mover, onmousedownRealisation, ondragstartRealisation, getCoordsRealisation, moveAtRealisation, onmousemoveRealisation, onmouseupRealisation){
	mover.ondragstart = ondragstartRealisation || function(){
		return false
	}

	var getCoords = getCoordsRealisation || function(elem){
		var box = elem.getBoundingClientRect()
		return {
			top : box.top + pageYOffset,
			left : box.left + pageXOffset
		}
	}

	mover.onmousedown = onmousedownRealisation || function(e){
		var moveAt = moveAtRealisation || function(e){
			moving.style.left = e.pageX - shiftX + 'px'
			moving.style.top = e.pageY - shiftY + 'px'
		}

		document.onmousemove = onmousemoveRealisation || function(e){
			moveAt(e)
		}

		mover.onmouseup = onmouseupRealisation || function(){
			document.onmousemove = null
			mover.onmouseup = null
		}

		var coords = getCoords(moving)
		var shiftX = e.pageX - coords.left
		var shiftY = e.pageY - coords.top

		moving.style.position = 'absolute'
		// document.body.appendChild(moving)
		moveAt(e)

		moving.style.zIndex = 1000
	}
}
// Console element
var addConsoleElement = function(element, handler, commands, getTabVarRealisation, onkeydownRealisation){
	var selStart = element.selectionStart, selEnd = element.selectionEnd
	var fixed = element.value = element.value == "" ? ">" : element.value + "\n>", editable = ""
	var last = [""], n = 0
	var tabIndex = -1, tabN = -1
	element.oninput = function(e){
		if (!element.value.startsWith(fixed)){
			element.value = fixed + editable
			element.selectionStart = selStart
			element.selectionEnd = selEnd
		}
		else{
			editable = element.value.substring(fixed.length)
			if (n == last.length - 1)
				last[n] = editable
			selStart = element.selectionStart
			selEnd = element.selectionEnd
			tabIndex = tabN = -1
		}
	}
	if (commands)
		if (!commands.allVars){
			commands = {
				"allVars" : commands,
				"allVarsArray0" : [],
				"allVarsArray1" : []
			}
			for ( var v in commands.allVars)
				commands.allVarsArray0.push(commands.allVars[v].vars||v)
			for ( var v in commands.allVars)
				for ( var v2 in commands.allVars[v]){
					commands.allVarsArray0.push(commands.allVars[v][v2])
					commands.allVarsArray1.push(commands.allVars[v][v2])
				}
			for ( var v in commands.allVars)
				commands.allVarsArray1.push(commands.allVars[v].vars||v)
		}
	var getTabVar = getTabVarRealisation || function(args, n){
		var levelVars = args.length > 1 ? (commands.allVars[args[0]] || commands.allVarsArray1) : (Object.keys(commands.allVars) || commands.allVarsArray0)
		var curVars = []
		for ( var v in levelVars)
			if (levelVars[v].startsWith(args[args.length - 1]))
				curVars.push(levelVars[v])
		return curVars[(n % curVars.length + curVars.length) % curVars.length] || args[args.length - 1]
	}
	element.onkeydown = onkeydownRealisation || function(e){
		if (element.selectionStart == element.value.length)
			switch (e.key){
				case "Enter":
					var lines = editable.split("\n")
					for ( var v in lines)
						element.value = fixed = fixed + lines[v] + "\n" + handler(lines[v].toLowerCase().split(" ")) + "\n>"
					last[n = last.length] = editable = ""
					return false
				case "ArrowUp":
					editable = last[n == 0 ? n : --n]
					element.value = fixed + editable
					return false
				case "ArrowDown":
					editable = last[n == last.length - 1 ? n : ++n]
					element.value = fixed + editable
					return false
				case "Tab":
					if (tabIndex == -1)
						tabIndex = editable.length
					var args = editable.substring(0, tabIndex).split(" ")
					editable = editable.substring(0, tabIndex - args[args.length - 1].length) + getTabVar(args, ++tabN)
					element.value = fixed + editable
					return false
			}
	}
}
