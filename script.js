function getAircraft(){

let type=document.getElementById("aircraft").value

if(type==="kingair")
return {name:"King Air 350",speed:260,burn:95}

if(type==="excel")
return {name:"Citation Excel",speed:430,burn:190}

if(type==="cj3")
return {name:"Citation CJ3",speed:415,burn:140}

}

function cleanValue(val){

if(!val) return null

val=val.toString().trim().toUpperCase()

if(val==="N/A") return null

let num=parseFloat(val)

if(isNaN(num)) return null

return num

}

async function getDistance(dep,arr){

try{

let res=await fetch(`https://api.adsbdb.com/v0/calc/distance/${dep}/${arr}`)
let data=await res.json()

if(!data || !data.distance) return null

return data.distance.nautical

}catch{

return null

}

}

async function calculate(){

let aircraft=getAircraft()

let speed=aircraft.speed
let burnRate=aircraft.burn

let route=document.getElementById("route").value
.split(",")
.map(x=>x.trim().toUpperCase())
.filter(x=>x.length>0)

let startingFuel=cleanValue(document.getElementById("startingFuel").value)

if(startingFuel===null) startingFuel=0

let fuelRemaining=startingFuel

let output=`AIRCRAFT: ${aircraft.name}\n\n`

output+="LEG ANALYSIS\n\n"

for(let i=0;i<route.length-1;i++){

let dep=route[i]
let arr=route[i+1]

let dist=await getDistance(dep,arr)

if(!dist){

output+=`${dep} → ${arr}   Distance Unknown\n`
continue

}

let burn=Math.round((dist/speed)*burnRate)

fuelRemaining-=burn

output+=`${dep} → ${arr}   ${Math.round(dist)} NM   Burn: ${burn} GAL   Remaining: ${Math.round(fuelRemaining)} GAL\n`

if(fuelRemaining<0){

output+=`⚠ FUEL REQUIRED BEFORE THIS LEG\n`

}

}

output+="\n---------------------------\n\n"

let table=document.getElementById("airportTable")

let cheapestFuel=Infinity
let tanker=null

for(let i=1;i<table.rows.length;i++){

let fuel=cleanValue(table.rows[i].cells[3].children[0].value)
let icao=table.rows[i].cells[0].children[0].value

if(fuel!==null && fuel<cheapestFuel){

cheapestFuel=fuel
tanker=icao

}

}

for(let i=1;i<table.rows.length;i++){

let cells=table.rows[i].cells

let icao=cells[0].children[0].value
let fbo=cells[1].children[0].value
let provider=cells[2].children[0].value

let fuel=cleanValue(cells[3].children[0].value)
let fee=cleanValue(cells[4].children[0].value)
let waive=cleanValue(cells[5].children[0].value)

if(!icao) continue

let decision="Pay Fee, No Uplift"
let effectivePrice=null

if(icao==="KDAB"){

decision="Uplift Max Fuel (Contract)"

}

else if(fuel===null){

decision="Pay Fee, No Uplift"

}

else if(fee===null || waive===null){

decision="Min Operational Uplift"

}

else{

let fuelCost=waive*fuel
let extraCost=fuelCost-fee
let penalty=extraCost/waive

effectivePrice=fuel+penalty

if(icao===tanker){

decision="Uplift Max Fuel"

}

else if(effectivePrice<cheapestFuel){

decision="Min Uplift to Waive Fee"

}

}

output+=`${icao} – ${fbo} – ${provider} | ${decision} | Fee ${fee ?? "N/A"} | Waive ${waive ?? "N/A"} | Fuel ${fuel ?? "N/A"} | Effective ${effectivePrice ? "$"+effectivePrice.toFixed(2) : "N/A"}\n\n`

}

document.getElementById("output").innerText=output

}
