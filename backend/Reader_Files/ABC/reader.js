import readDigits from '../Helpers/readerFile.js';
import addresses from '../Helpers/address.js';

const url = "https://abcnews.go.com/"

let major = "a.zZygg h2"
let minor = "a.zZygg h3"
let pathway = addresses.getOutput().ABC


async function readBackData(data,location){
    console.log("ABC Data recieved")
    for(let i=0;i<data.length;i++){
        data[i] = data[i].inner + "%" + data[i].url
    }
    let curr = readDigits.readJSON(pathway);
    curr.data = [curr.data,data.join("<>")].join("<>")
    readDigits.writeJSON(pathway,curr)
    console.log("ABC Data released")
}


export default async function prepABC() {
    readDigits.blankOut(pathway);

    await Promise.all([
        new Promise((resolve, reject) => {
            readDigits.readSite(url, major, (data) => {
                readBackData(data, "major")
                    .then(resolve)
                    .catch(reject)
            }, "none")
        }),
        new Promise((resolve, reject) => {
            readDigits.readSite(url, minor, (data) => {
                readBackData(data, "minor")
                    .then(resolve)
                    .catch(reject)
            }, "none")
        })
    ]);
}

//export default prepABC