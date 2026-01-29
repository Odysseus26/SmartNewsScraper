import readDigits from "../Helpers/readerFile.js"
import addresses from "../Helpers/address.js";

const url = "https://www.cnn.com/"
let keyword = "a.container__link span.container__headline-text"
let pathway = addresses.getOutput().CNN

async function readBackData(data){
    console.log("CNN data recieved")

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i].inner + "%" + data[i].url;
    }

    let curr = readDigits.readJSON(pathway);
    curr.data = data.join("<>")
    readDigits.writeJSON(pathway, curr)

    console.log("CNN data released")
}

export default async function prepCNN(){
    readDigits.blankOut(pathway)

    await new Promise((resolve, reject) => {
        readDigits.readSite(
            url,
            keyword,
            async (data) => {
                try {
                    await readBackData(data)
                    resolve()
                } catch (err) {
                    reject(err)
                }
            },
            "none"
        )
    })
}
