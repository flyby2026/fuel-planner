function calculate(){

let table=document.getElementById("airportTable")

let output=""

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
