const addresses = {
    "ABC":"../ABC",
    "CBS":"../CBS",
    "CNN":"../CNN",
    "NBC":"../NBC"
}

const exclude = ["CBS"];

function getOutputs(){
    const append = "/output.json"
    let returnState = {}
    for(let keys in addresses){
        if(!exclude.includes(keys)) returnState[keys] = addresses[keys] + append;
    }
    return returnState;
}

function getReaders(){
    const append = "/reader.js"
    let returnState = {}
    for(let keys in addresses) if(!exclude.includes(keys)) returnState[keys] = addresses[keys] + append;
    return returnState;
}

const addressList = {
    "addresses":addresses,
    "getOutput":getOutputs,
    "getReaders":getReaders
}

export default addressList