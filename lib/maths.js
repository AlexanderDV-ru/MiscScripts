//--- Name: MathsFunctions/Vesion: 0.0.6a/Authors: AlexanderDV/Description: Maths functions .js. ---
var mathsProps = {}
mathsProps.numberForms = {
	default	:	{
		digits	:	"0123456789",
		direction	:	false,
		minus	:	"-",
		dot	:	".",
		minusPos	:	false,
		ignoreCase	:	true
	},
	back	:	{
		direction	:	true
	},
	x2	:	{
		digits	:	"01"
	},
	x3	:	{
		digits	:	"012"
	},
	x6	:	{
		digits	:	"012345"
	},
	x8	:	{
		digits	:	"012345678"
	},
	x12	:	{
		digits	:	"0123456789ab"
	},
	x12xe	:	{
		digits	:	"0123456789xe"
	},
	x16	:	{
		digits	:	"0123456789abcdef"
	},
	x20	:	{
		digits	:	"0123456789abcdefghijkl"
	},
	letters	:	{
		digits	:	"abcdefghijklmnopqrstuvwxyz"
	},
	digitsLetters	:	{
		digits	:	"0123456789abcdefghijklmnopqrstuvwxyz"
	},
	lettersDigits	:	{
		digits	:	"abcdefghijklmnopqrstuvwxyz0123456789"
	},
	abc	:	{
		digits	:	"abcdefghijklmnopqrstuvwxyz",
		ignoreCase	:	false
	},
	ABC :	{
		digits	:	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		ignoreCase	:	false
	},
	abcABC	:	{
		digits	:	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		ignoreCase	:	false
	},
	x60	:	{
		digits	:	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX",
		ignoreCase	:	false
	}
}
// Number form check&correct (service)
function numberFormCorrect(numberForm){
	var result={}
	arguments=[mathsProps.numberForms.default,...arguments]
	for(var v=0;v<arguments.length;v++)
		if(Array.isArray(arguments[v]))
		{
			arguments.splice(v,1,...arguments[v])
			v=0
		}
		else if(typeof arguments[v]=="string")
			arguments[v]=mathsProps.numberForms[arguments[v]]
	for(var v=0;v<arguments.length;v++)
		for(var v2 in arguments[v])
			if(arguments[v][v2]!=undefined&&arguments[v][v2]!=null)
				result[v2]=arguments[v][v2]
	return result
}
// String to number and number to string
function stringToNumber(string, numberForm){
	numberForm=numberFormCorrect(numberForm)

	var number = ""
	for (var v = 0; string.length > v; v++)
		number = numberForm.direction ? string[v] + number	:	number + string[v]
	var num = 0
	var min = string[0] == numberForm.minus ? numberForm.minus	:	""
	var d=0
	for (var v = (numberForm.minusPos ? 0	:	min.length); number.length - (numberForm.minusPos ? min.length	:	0) > v; v++)
		if (number[v] == numberForm.dot)
			d = 1
		else
    {
      num += numberForm.digits.match(number[v]).index*Math.pow(numberForm.digits.length, d?-d:(number.indexOf(".")==-1?number.length:number.indexOf("."))-v-1)
      d=d==0?0:d+1
    }
	return min ? -num	:	num
}
function numberToString(number, numberForm){
	numberForm=numberFormCorrect(numberForm)

	var string = ""
	var min = 0 > number ? numberForm.minus	:	""
	if(number instanceof Number)
		for (; number != 0;)
		{
			string = numberForm.digits[number % numberForm.digits.length] + string
			number = (number - number % numberForm.digits.length) / numberForm.digits.length
		}
	else return number+""
	string = min + string
	var val = ""
	for (var v = 0; string.length > v; v++)
		val = numberForm.direction ? string[v] + val	:	val + string[v]
	return val
}
// Replace variables in expression
function replaceVariables(expression, variables){
	for ( var v in variables)
			if (variables[v]!=undefined)
				expression = expression.replace(new RegExp("[" + v.split("").join("][")+"]", "g"), "("+variables[v]+")")
			else expression = expression.replace(new RegExp("[" + v.split("").join("][")+"]", "g"), "«"+v+"»")
	return expression
}
// Get action by action["variable"]==value
function actionByVariable(variable, value, actionsByPriority){
  for(var v in actionsByPriority)
    for(var v2 in actionsByPriority[v])
      if(actionsByPriority[v][v2][variable] == value)
        return actionsByPriority[v][v2]
}
// Make action by operator in actionsByPriority array for args in actions array
function makeAction(args, action, numberForm, actionsByPriority){
	numberForm=numberFormCorrect(numberForm)

  if(typeof action == "string")
    action  = actionByText(action)
	while(args.length >  1)
		args.splice(0,  2,  action.func(args[0]||action.a,args[1]||action.b))
	return args[0]
}
// Count in brackets
function bracketsCount(expression,  numberForm,  actionsByPriority, func, toEndMode){
  var last
  for(var v=0;v<expression.length;v++)
    if(expression[v]=="(")
      last=v
    else if(expression[v]==")")
    {
      //console.log(expression)
      expression=expression.substr(0, last)+func(expression.substr(last+1,v-1-last),  numberForm,  actionsByPriority)+expression.substr(v+1)
      //console.log(expression)
      if(toEndMode)
        v=-1
      else break
    }
  //console.log(expression)
  return expression
}
// Polish count method
function polishCount(expression, numberForm, actionsByPriority){
	numberForm=numberFormCorrect(numberForm)

	var stack=[]
	var spl=expression.split(",")
	for(var v in spl)
		if(function(){try{return stringToNumber(spl[v], numberForm);}catch(Exception){return false;}return true}())
			stack.push(spl[v])
		else stack=[makeAction(stack, spl[v], numberForm, actionsByPriority)]
	//console.log(stack)
	return stack[0]
}
// Standard count method
function splitCount(expression, numberForm, actionsByPriority){
	numberForm=numberFormCorrect(numberForm)

  return _splitCount2(_splitCount(expression,numberForm,actionsByPriority),numberForm,actionsByPriority)
}
function _splitCount(expression,numberForm,actionsByPriority) {
  	var splited=[""]
  	for(var v in expression)
    {
      splited[splited.length-1]+=expression[v]
  		for(var v2 in actionsByPriority)
  			for(var v3 in actionsByPriority[v2])
  				if(splited[splited.length-1].endsWith(actionsByPriority[v2][v3].text))
  				{
  					splited[splited.length-1]=splited[splited.length-1].substr(0,splited[splited.length-1].length-actionsByPriority[v2][v3].text.length)
  					splited[splited.length]=actionsByPriority[v2][v3]
  					splited[splited.length]=""
            break
  				}
    }
    for(var v in splited)
      if(typeof splited[v]=="string")
        try {
          splited[v]=stringToNumber(splited[v],numberForm)
        } catch (e) {
        }
  return splited
}
function _splitCount2(splited, numberForm, actionsByPriority){

	//console.log(splited)
	for(var v in actionsByPriority)
		for(var v2=0;v2<splited.length;v2++)
			for(var v3 in actionsByPriority[v])
				if(splited[v2]==actionsByPriority[v][v3])
				{
          var a=splited[v2-1],b=splited[v2+1],action=actionsByPriority[v][v3]
          if(typeof a!="number"||Number.isNaN(a))
            a=action.a
          if(typeof b!="number"||Number.isNaN(b))
            b=action.b
            //console.log(a)
            //console.log(b)
            //console.log(action)
            //console.log(makeAction([a,b], action, numberForm))
					splited.splice(v2-1,3,(a+"").indexOf("«")!=-1||(b+"").indexOf("«")!=-1?a+action.text+b:makeAction([a,b], action, numberForm))
					//console.log(splited)
					v2=0
				}
	//console.log(splited)
	return splited[0]
}


function prepare(expression, numberForm, actionsByPriority) {
	check(expression, numberForm, actionsByPriority)
  	var splited=[""]
		var bracketCount=0
  	for(var v=0;v<expression.length;v++)
    {
			if(expression[v]=="(")
			{
				bracketCount++
				if(bracketCount==1)
					if(v!=0&&splited[splited.length-1]!="")
	      		splited[splited.length]=""
			}
      splited[splited.length-1]+=expression[v]
			if(expression[v]==")")
			{
				bracketCount--
				if(bracketCount==0)
				{
					splited[splited.length-1]=prepare(splited[splited.length-1].substr(1,splited[splited.length-1].length-2),numberForm, actionsByPriority)
					if(v!=expression.length-1)
						splited[splited.length]=""
				}
			}
			if(bracketCount==0)
				if(typeof splited[splited.length-1]=="string")
		  		for(var v2 in actionsByPriority)
		  			for(var v3 in actionsByPriority[v2])
		  				if(splited[splited.length-1].endsWith(actionsByPriority[v2][v3].text))
		  				{
		  					splited[splited.length-1]=splited[splited.length-1].substr(0,splited[splited.length-1].length-actionsByPriority[v2][v3].text.length)
									if(v!=0&&splited[splited.length-1]!="")
					      		splited[splited.length]=""
		  					splited[splited.length-1]=actionsByPriority[v2][v3].func
								if(v!=expression.length-1)
		  						splited[splited.length]=""
		            break
		  				}
    }
  for(var v in splited)
    if(typeof splited[v]=="string")
      try {
        splited[v]=stringToNumber(splited[v],numberForm)
      } catch (e) {}
 //console.log(splited);
	return splited
}
function actionByUniversal(value, actionsByPriority){
	check(value,actionsByPriority)
  for(var v in actionsByPriority)
    for(var v2 in actionsByPriority[v])
      if(actionsByPriority[v][v2].func == value||actionsByPriority[v][v2].text == value||actionsByPriority[v][v2].name == value||actionsByPriority[v][v2] == value)
        return actionsByPriority[v][v2]
	return value
}
function doActionWithString(args, action, numberForm, actionsByPriority) {
	check(args,action,numberForm,actionsByPriority)
	args=[].concat(args)
	var result
	if(false)
		return args[0]+action.text+args[1]
	var prepared=[]
 //console.log(args);
 //console.log(action);
	for(var v in args)
		prepared[v]=prepare(args[v], numberForm, actionsByPriority)[0]
	for(var v in prepared)
		if(!prepared[v]||!prepared[v][prepared[v].length-1]||typeof prepared[v][prepared[v].length-1][0] !="string")
			return args[0]+action.text+args[1]
	var prevLastsActs=[]
	for(var v in prepared)
		prevLastsActs[v]=actionByUniversal(prepared[v][prepared[v].length-2],actionsByPriority)
	var groups={}
	for(var v in actionsByPriority)
		for(var v2 in actionsByPriority[v])
			if(actionsByPriority[v][v2].pos)
				groups[actionsByPriority[v][v2].text]=actionsByPriority[v][v2].pos
	 //console.log(groups);
	var mainActionOk=false
	for(var v in groups)
		if((action.pos||action.neg))
			mainActionOk=true
	console.log(prepared);
	if(mainActionOk)
		for(var v in groups)
		{
			var ok=true
			for(var v2 in prevLastsActs)
				if(prevLastsActs[v2]&&prevLastsActs[v2].text!=v&&prevLastsActs[v2].text!=groups[v])
					ok=false
			if(ok)
			{
				var funcfunc=function(value){
					if(Array.isArray(value))
						return value[0]
					return value
				}
				var variablesString=[[],[]]
				var variablesEquals
				var variablesStringIndexes=[[],[]]
				var variablesEqualsIndexes=[]
				var v2max=(prevLastsActs[0]&&prevLastsActs[0].laws&&prevLastsActs[0].laws.indexOf("c")!=-1?1:0)
				var v3max=(prevLastsActs[1]&&prevLastsActs[1].laws&&prevLastsActs[1].laws.indexOf("c")!=-1?1:0)
				for(var v2=(prevLastsActs[0].rotated&&!v2max?1:0);v2<v2max+1+(prevLastsActs[0].rotated&&!v2max?1:0);v2++)
					if(typeof funcfunc(prepared[0][prepared[0].length-1-v2*2])=="string")
					{
						variablesString[0].push(funcfunc(prepared[0][variablesStringIndexes[0].push(prepared[0].length-1-v2*2)]))
						for(var v3=(prevLastsActs[1].rotated&&!v3max?1:0);v3<v3max+1+(prevLastsActs[1].rotated&&!v3max?1:0);v3++)
							if(typeof funcfunc(prepared[1][prepared[1].length-1-v3*2])=="string")
							{
								variablesString[1].push(funcfunc(prepared[1][variablesStringIndexes[1].push(prepared[1].length-1-v3*2)]))
								if(funcfunc(prepared[0][prepared[0].length-1-v2*2])==funcfunc(prepared[1][prepared[1].length-1-v3*2]))
								{
									variablesEqualsIndexes[0]=prepared[0].length-1-v2*2
									variablesEqualsIndexes[1]=prepared[1].length-1-v3*2
									variablesEquals=funcfunc(prepared[0][prepared[0].length-1-v2*2])
								}
							}
					}

				var all=[[],[]]
				all[0].push(...prepared[0])
				all[0].splice(Math.min(variablesEqualsIndexes[0],all[0].length-2),2)
				all[1].push(...prepared[1])
				all[1].splice(Math.min(variablesEqualsIndexes[1],all[1].length-2),2)
				all=[...all[0],action.func,...all[1]]
				//console.log("/////",all);
				var add
				console.log(variablesString,variablesEquals);
				if(variablesString[0].length>0&&variablesString[1].length>0)
					switch (v) {
						case "^":

							break;
						case "*":
							if(variablesEquals)
								if(!prevLastsActs[0]||!prevLastsActs[1]||prevLastsActs[0].text==prevLastsActs[1].text)
									add=[prepared[1][prepared[1].length-2],variablesEquals]
								else add=undefined
							else add=undefined
							break;
						case "+":
							if(variablesEquals)
								if(!prevLastsActs[0]||!prevLastsActs[1]||prevLastsActs[0].text==prevLastsActs[1].text)
									add=[prepared[1][prepared[1].length-2],2,actionByUniversal("*",actionsByPriority).func,variablesEquals]
								else add=[]
							else add=[prepared[0][prepared[0].length-2],variablesString[0][0],prepared[1][prepared[1].length-2],variablesString[1][0]]
							break;
					}
			  console.log("******************************",all,add);
				if(add)
					return count(countInBrackets([all,...add], numberForm, actionsByPriority), numberForm, actionsByPriority)
			}
		}
	if(!result)
		return args[0]+action.text+args[1]
}
function doActionWithNumber(args, action) {
	check(args,action)
	return action.func(args[0],args[1])
}
function doAction(args, action, numberForm, actionsByPriority, polish) {
	check(args,action,numberForm,actionsByPriority)
	args=[].concat(args)
	action=actionByUniversal(action, actionsByPriority)

	var res
	var resT="number"
	var result=[]
	var args2=[]
	for(var v=0;v<args.length;v++)
	{
		if(v!=0)
			result[res=result.length]=res
		switch (typeof args[v]) {
			case "string":
				args2[v]="("+args[v]+")"
				resT="string"
				break;
			case "function":
				if(polish)
					args[v]=doAction([undefined,undefined],args[v], numberForm, actionsByPriority)
				else result.push(args[v])
			case "undefined":
			case "number":
				args2[v]=Number.isNaN(args[v])||typeof args[v]!="number"?(v==0?action.a:action.b):args[v]
				resT=resT!="string"?"number":"string"
				break;
		}
		if(v!=0)
			result[res]={a:args2[v-1],b:args2[v]}
	}
 //console.log("''''''''''''''",result);
	try {
		[0][0][0][0]=0
	} catch (e) {
	 //console.log(e);
	}
	result[res]=(resT=="string"?doActionWithString:doActionWithNumber)([result[res].a,result[res].b],action,numberForm, actionsByPriority)
	return result
}
function countInBrackets(prepared, numberForm, actionsByPriority){
	check(arguments)
	prepared=[].concat(prepared)
	var countedInBrackets=[]
	 //console.log(prepared,countedInBrackets);
	for(var v=0;v<prepared.length;v++)
		if(Array.isArray(prepared[v]))
			countedInBrackets.push(count(countInBrackets(prepared[v], numberForm, actionsByPriority), numberForm, actionsByPriority))
		else countedInBrackets.push(prepared[v])
		 //console.log(prepared,countedInBrackets);
	return countedInBrackets
}
function check(args){
	for(var v in arguments)
		if(arguments[v]==undefined||arguments[v]==null)
			console.error("These argument must be not '"+arguments[v]+"! (v="+v+")");
}
function count(countedInBrackets, numberForm, actionsByPriority) {
	check(arguments)
	countedInBrackets=[].concat(countedInBrackets)
	 //console.log(countedInBrackets,actionsByPriority);
	for(var v in actionsByPriority)
		for(var v2=0;v2<countedInBrackets.length;v2++)
			for(var v3 in actionsByPriority[v])
			{
				//console.log(countedInBrackets[v2],actionsByPriority[v][v3].func,countedInBrackets[v2]==actionsByPriority[v][v3].func);
				if(countedInBrackets[v2]==actionsByPriority[v][v3].func)
				{
					var start=v2==0?0:v2-1
					var length=(v2==0?0:1)+1+(v2==countedInBrackets.length-1?0:1)
					var a=v2==0?undefined:countedInBrackets[v2-1]
					var b=v2==countedInBrackets.length-1?undefined:countedInBrackets[v2+1]
					var action=actionsByPriority[v][v3]
				  //console.log(a,b,action);
					countedInBrackets.splice(start, length, ...doAction([a,b],action,numberForm, actionsByPriority))
					v2-=v2==0?1:2
				}
			}
				 //console.log(countedInBrackets);
	return countedInBrackets[countedInBrackets.length-1]
}
