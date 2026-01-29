import readDigits from "./Helpers/readerFile.js"

function compareSearch(para1,para2){
    para1 = para1.toLowerCase();
    para2 = para2.toLowerCase();
    let count = 0;
    let words1 = para1.split(" ");
    let words2 = para2.split(" ");
    words1.forEach(Element=>{
        if(words2.includes(Element)) count += 1;
    })
    return count / words1.length;
}


let everything = readDigits.readJSON("./combinded.json")
everything = everything.split("<>")
for(let i=0;i<everything.length;i++) everything[i] = everything[i].split("%");


function determinePossible(searchTerm,dataset,factor = 1){
    let wildSet = [];
    for(let i=0;i<dataset.length;i++){
        let compare = compareSearch(searchTerm,dataset[i][0]);
        if(compare != 0) wildSet.push({"index":i,"percentage":compare * factor} );
    }
    wildSet.sort((a,b)=>b.percentage - a.percentage);
    return wildSet;
}

function getList(searchTerm,dataset){
    function seperateIndex(List){
        let indexes = [];
        List.forEach(Element=>{
            indexes.push(Element.index)
        })
        return indexes;
    }
    let allIndex = [];
    let firstPass = determinePossible(searchTerm,dataset);
    allIndex.push(...seperateIndex(firstPass));
    for(let i=0;i<firstPass.length;i++){
        let text = dataset[firstPass[i].index][0];
        let factor = firstPass[i].percentage;
        let newStates = determinePossible(text,dataset,factor);
        newStates.forEach(Element=>{
            if(!allIndex.includes(Element.index)){
                // adding
                firstPass.push(Element);
                allIndex.push(Element.index);
            }
        })
    }
    firstPass.sort((a,b)=>b.percentage - a.percentage);
    for(let i=0;i<firstPass.length;i++){
        allIndex[i] = dataset[firstPass[i].index];
    }
    return allIndex
}
everything = everything.filter(Element=> Element != "")


function exportSearch(searchTerm){
    return getList(searchTerm,everything);
}

export default exportSearch;