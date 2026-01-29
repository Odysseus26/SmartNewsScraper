import readDigits from "./Helpers/readerFile.js";
import addressList from "./Helpers/address.js";

function modify(){
    let outs = addressList.getOutput()
    let allOuts = []
    for(let keys in outs){
        let holdData = readDigits.readJSON(outs[keys])
        holdData = holdData.data.split("<>")
        for(let i=0;i<holdData.length;i++) holdData[i] = holdData[i].split("%");
        holdData = holdData.filter(el => !el[1]?.includes("/video/") && el != [''])
        if(holdData[0] == '') holdData.shift();
        for(let i=0;i<holdData.length;i++) holdData[i] = holdData[i].join("%");
        holdData = holdData.join("<>");
        allOuts = [...allOuts,holdData]
    }
    allOuts = allOuts.join("<>");
    readDigits.writeJSON("./combinded.json",allOuts)
    console.log("Filtered and Fixed!")
}

export default modify