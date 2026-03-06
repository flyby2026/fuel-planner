async function getAirport(icao){

let url=`https://airportdb.io/api/v1/airport/${icao}?apiToken=demo`

let res=await fetch(url)
let data=await res.json()

return {
lat:data.latitude_deg,
lon:data.longitude_deg
}

}

function haversine(a,b){

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

async function calculate(){

let routeInput=document.getElementById("route").value
let route=routeInput.split(",")

let speed=260
let burn=95

let output="LEG DISTANCES\n\n"

for(let i=0;i<route.length-1;i++){

let a=route[i].trim()
let b=route[i+1].trim()

let A=await getAirport(a)
let B=await getAirport(b)

let dist=haversine(A,B)

let fuel=Math.round((dist/speed)*burn)

output+=`${a} → ${b}   ${Math.round(dist)} NM   ~${fuel} GAL\n`

}

output+="\n---------------------------\n\n"

let table=document.getElementById("airportTable")

let cheapest=999

for(let i=1;i<table.rows.length;i++){

let fuel=table.rows[i].cells[2].children[0].value

if(fuel && fuel<cheapest){
cheapest=fuel
}

}

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

if(fuel===cheapest){
decision="Uplift Max Fuel"
}

else if(waiveCost < fee){
decision="Min Uplift to Waive Fee"
}

output += `${icao} – ${fbo} | ${decision} | Handling Fee – $${fee} | Min Uplift to Waive – ${waive} Gal | Fuel Price – $${fuel} / Gal\n\n`

}

document.getElementById("output").innerText=output

}
