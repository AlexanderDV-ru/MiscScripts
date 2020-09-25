//---	Name:	DefaultProperties/Vesion:	0.1.6a/Authors:	AlexanderDV/Description:	Default-properties	.js.	---
var	props={}


// Universal local storage initialization
var storage = window.localStorage
function storageValue(key,val)
{
	var vals
	try {
		vals= JSON.parse(storage[programInfo.name])
	} catch (e) {

	}
	if(!vals)
		vals={}
	if(arguments.length>=2)
		vals[key]=val
	storage[programInfo.name]=JSON.stringify(vals)
	return vals[key]
}

// Messages language initialization by default value
props.msgsLang='ru-RU'
// Function for getting message by key
var getMsg=function(key, lang){
	return props.msgs[lang||messagesLanguage][key]
}
