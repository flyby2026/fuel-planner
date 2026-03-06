function calculate(){

let routeInput=document.getElementById("route").value
let route=routeInput.split(",")

let speed=260
let burn=95

let output=""

output+="LEG DISTANCES\n\n"

for(let i=0;i<route.length-1;i++){

let a=route[i].trim()
let b=route[i+1].trim()

let dist=getDistance(a,b)

let fuel=Math.round((dist/speed)*burn)

output+=`${a} → ${b}   ${Math.round(dist)} NM   ~${fuel} GAL\n`

}

output+="\n---------------------------\n\n"

let table=document.getElementById("airportTable")

for(let i=1;i<table.rows.length;i++){

let cells=table.rows[i].cells

let icao=cells[0].children[0].value
let fbo=cells[1].children[0].value
let fuel=cells[2].children[0].value
let fee=cells[3].children[0].value
let waive=cells[4].children[0].value

if(icao==="") continue

output += `${icao} – ${fbo} | Decision Pending | Handling Fee – $${fee} | Min Uplift to Waive – ${waive} Gal | Fuel Price – $${fuel} / Gal\n\n`

}

document.getElementById("output").innerText=output

}


function getDistance(a,b){

const airports={
KDAB:{lat:29.18,lon:-81.05},
KGMU:{lat:34.85,lon:-82.35},
KPWK:{lat:42.11,lon:-87.90},
KEYE:{lat:39.83,lon:-86.29},
KFXE:{lat:26.19,lon:-80.17},
KSSI:{lat:31.15,lon:-81.39},
KPBI:{lat:26.68,lon:-80.09},
KTPA:{lat:27.97,lon:-82.53}
}

if(!airports[a] || !airports[b]) return 0

let R=3440

let lat1=airports[a].lat*Math.PI/180
let lat2=airports[b].lat*Math.PI/180

let dlat=lat2-lat1
let dlon=(airports[b].lon-airports[a].lon)*Math.PI/180

let x=Math.sin(dlat/2)**2+
Math.cos(lat1)*Math.cos(lat2)*Math.sin(dlon/2)**2

let c=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))

return R*c

}
