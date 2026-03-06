function getAircraft(){

let type=document.getElementById("aircraft").value

if(type==="kingair")
return {name:"King Air 350",speed:260,burn:95,capacity:361}

if(type==="excel")
return {name:"Citation Excel",speed:430,burn:190,capacity:1000}

if(type==="cj3")
return {name:"Citation CJ3",speed:415,burn:140,capacity:700}

return {name:"Aircraft",speed:250,burn:100,capacity:300}

}

function cleanValue(val){

if(!val) return null

val=val.toString().trim().toUpperCase()

if(val==="N/A") return null

let num=parseFloat(val)

if(isNaN(num)) return null

return num

}

function haversine(lat1,lon1,lat2,lon2){

let R=3440

let dlat=(lat2-lat1)*Math.PI/180
let dlon=(lon2-lon1)*Math.PI/180

lat1=lat1*Math.PI/180
lat2=lat2*Math.PI/180

let a=Math.sin(dlat/2)**2 +
Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2

let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R*c

}

async function getAirport(icao){

try{

let res=await fetch(`https://api.aviationapi.com/v1/airports?apt=${icao}`)
let data=await res.json()

if(!data[icao]) return null

return {
lat:parseFloat(data[icao].latitude),
lon:parseFloat(data[icao].longitude)
}

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
.map(x=>x.trim())
.filter(x=>x.length>0)

let startingFuel=cleanValue(document.getElementById("startingFuel").value)

if(startingFuel===null) startingFuel=0

let fuelRemaining=startingFuel

let output=`AIRCRAFT: ${aircraft.name}\n\n`

output+="LEG ANALYSIS\n\n"

for(let i=0;i<route.length-1;i++){

let dep=route[i]
let arr=route[i+1]

let A=await getAirport(dep)
let B=await getAirport(arr)

if(!A || !B){

output+=`${dep} → ${arr}   Distance Unknown\n`
continue

}

let dist=haversine(A.lat,A.lon,B.lat,B.lon)

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
