let airportDB = {}

async function loadAirports(){

let res = await fetch("airports.json")
airportDB = await res.json()

}

loadAirports()

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

function getAirport(icao){

icao=icao.toUpperCase()

if(!airportDB[icao]) return null

return {
lat:airportDB[icao].lat,
lon:airportDB[icao].lon
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

let A=getAirport(dep)
let B=getAirport(arr)

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

document.getElementById("output").innerText=output

}
