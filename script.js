function parseAirportData(){

let text=document.getElementById("airportInput").value
let lines=text.split("\n")

let airports=[]
let current={}

for(let line of lines){

if(line.startsWith("ICAO:")){
current.icao=line.split(":")[1].trim()
}

if(line.startsWith("FBO:")){
current.fbo=line.split(":")[1].trim()
}

if(line.startsWith("Fuel price:")){
current.fuel=parseFloat(line.split(":")[1])
}

if(line.startsWith("Handling fee:")){
current.fee=line.split(":")[1].trim()
}

if(line.startsWith("Min uplift")){
current.waive=line.split(":")[1].trim()

airports.push(current)
current={}
}

}

return airports
}

function calculate(){

let airports=parseAirportData()

let output=""

for(let a of airports){

output += `${a.icao} – ${a.fbo} | Decision Pending | Handling Fee – $${a.fee} | Min Uplift to Waive – ${a.waive} Gal | Fuel Price – $${a.fuel} / Gal\n\n`

}

document.getElementById("output").innerText=output

}
