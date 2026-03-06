function getAircraft(){

let type=document.getElementById("aircraft").value

if(type==="kingair")
return {name:"King Air 350",speed:260,burn:95,capacity:361}

if(type==="excel")
return {name:"Citation Excel",speed:430,burn:190,capacity:1000}

if(type==="cj3")
return {name:"Citation CJ3",speed:415,burn:140,capacity:700}

}

function haversine(lat1,lon1,lat2,lon2){

let R=3440

let dlat=(lat2-lat1)*Math.PI/180
let dlon=(lon2-lon1)*Math.PI/180

lat1=lat1*Math.PI/180
lat2=lat2*Math.PI/180

let a=Math.sin(dlat/2)**2+
Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2

let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R*c

}

async function getAirport(icao){

let res=await fetch(`https://airportdb.io/api/v1/airport/${icao}?apiToken=demo`)
let data=await res.json()

return data

}

async function calculate(){

let aircraft=getAircraft()

let route=document.getElementById("route").value.split(",")

let startingFuel=parseFloat(document.getElementById("startingFuel").value)

let fuelRemaining=startingFuel

let output=`AIRCRAFT: ${aircraft.name}\n\n`

output+="LEG ANALYSIS\n\n"

for(let i=0;i<route.length-1;i++){

let A=await getAirport(route[i].trim())
let B=await getAirport(route[i+1].trim())

let dist=haversine(A.latitude_deg,A.longitude_deg,B.latitude_deg,B.longitude_deg)

let burn=Math.round((dist/aircraft.speed)*aircraft.burn)

fuelRemaining-=burn

output+=`${route[i]} → ${route[i+1]}   ${Math.round(dist)} NM   Burn: ${burn} GAL   Remaining: ${Math.round(fuelRemaining)} GAL\n`

if(fuelRemaining<0){

output+=`⚠ FUEL REQUIRED BEFORE THIS LEG\n`

}

}

output+="\n---------------------------\n\n"

let table=document.getElementById("airportTable")

let cheapestFuel=999
let tanker=""

for(let i=1;i<table.rows.length;i++){

let fuel=parseFloat(table.rows[i].cells[3].children[0].value)
let icao=table.rows[i].cells[0].children[0].value

if(fuel && fuel<cheapestFuel){

cheapestFuel=fuel
tanker=icao

}

}

for(let i=1;i<table.rows.length;i++){

let cells=table.rows[i].cells

let icao=cells[0].children[0].value
let fbo=cells[1].children[0].value
let provider=cells[2].children[0].value
let fuel=parseFloat(cells[3].children[0].value)
let fee=parseFloat(cells[4].children[0].value)
let waive=parseFloat(cells[5].children[0].value)

if(!icao) continue

let decision="Pay Fee, No Uplift"

let fuelCost = waive * fuel
let extraCost = fuelCost - fee
let penaltyPerGal = extraCost / waive
let effectivePrice = fuel + penaltyPerGal

if(icao==="KDAB"){

decision="Uplift Max Fuel (Contract)"

}

else if(icao===tanker){

decision="Uplift Max Fuel"

}

else if(effectivePrice < cheapestFuel){

decision="Min Uplift to Waive Fee"

}

output+=`${icao} – ${fbo} – ${provider} | ${decision} | Handling Fee – $${fee} | Min Uplift – ${waive} | Fuel – $${fuel} | Effective – $${effectivePrice.toFixed(2)}\n\n`

}

document.getElementById("output").innerText=output

}
