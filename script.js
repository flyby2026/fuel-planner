async function getAirport(icao){

let url=`https://airportdb.io/api/v1/airport/${icao}?apiToken=demo`

let res=await fetch(url)
let data=await res.json()

return {
lat:data.latitude_deg,
lon:data.longitude_deg
}

}

function distance(a,b){

let R=3440

let lat1=a.lat*Math.PI/180
let lat2=b.lat*Math.PI/180

let dlat=lat2-lat1
let dlon=(b.lon-a.lon)*Math.PI/180

let x=Math.sin(dlat/2)**2+
Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2

let c=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))

return R*c

}

function getAircraft(){

let type=document.getElementById("aircraft").value

if(type==="kingair"){
return {name:"King Air 350",speed:260,burn:95,maxRange:700}
}

if(type==="excel"){
return {name:"Citation Excel",speed:430,burn:190,maxRange:1600}
}

if(type==="cj3"){
return {name:"Citation CJ3",speed:415,burn:140,maxRange:2000}
}

}

async function calculate(){

let aircraft=getAircraft()

let speed=aircraft.speed
let burn=aircraft.burn
let maxRange=aircraft.maxRange

let route=document.getElementById("route").value.split(",")

let output=`AIRCRAFT: ${aircraft.name}\n\n`
output+="LEG DISTANCES\n\n"

let longestLeg=0

for(let i=0;i<route.length-1;i++){

let A=await getAirport(route[i].trim())
let B=await getAirport(route[i+1].trim())

let dist=distance(A,B)

if(dist>longestLeg) longestLeg=dist

let fuel=Math.round((dist/speed)*burn)

output+=`${route[i]} → ${route[i+1]}   ${Math.round(dist)} NM   ~${fuel} GAL\n`

if(dist>maxRange){

output+=`⚠ WARNING: exceeds safe range for ${aircraft.name}\n`

}

}

output+="\n---------------------------\n\n"

let table=document.getElementById("airportTable")

let cheapestFuel=999
let tankerAirport=""

for(let i=1;i<table.rows.length;i++){

let cells=table.rows[i].cells

let fuel=parseFloat(cells[2].children[0].value)
let icao=cells[0].children[0].value

if(!fuel) continue

if(fuel<cheapestFuel){

cheapestFuel=fuel
tankerAirport=icao

}

}

output+=`CHEAPEST FUEL STOP: ${tankerAirport}\n\n`

for(let i=1;i<table.rows.length;i++){

let cells=table.rows[i].cells

let icao=cells[0].children[0].value
let fbo=cells[1].children[0].value
let fuel=parseFloat(cells[2].children[0].value)
let fee=parseFloat(cells[3].children[0].value)
let waive=parseFloat(cells[4].children[0].value)

if(!icao) continue

let decision="Pay Fee, No Uplift"

let waiveCost=waive*fuel

if(icao===tankerAirport){

decision="Uplift Max Fuel"

}

else if(waiveCost < fee){

decision="Min Uplift to Waive Fee"

}

output += `${icao} – ${fbo} | ${decision} | Handling Fee – $${fee} | Min Uplift to Waive – ${waive} Gal | Fuel Price – $${fuel} / Gal\n\n`

}

document.getElementById("output").innerText=output

}
