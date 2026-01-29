import readDigits from "../Helpers/readerFile.js";
import addresses from "../Helpers/address.js";

const url = "https://www.cbsnews.com/"
const keyword = "a.item__anchor h4"
let pathway = addresses.getOutput().CBS

async function readBackData(data){
    console.log("CBS data recieved")

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i].inner + "%" + data[i].url;
    }

    let curr = readDigits.readJSON(pathway)
    curr.data = data.join("<>")
    readDigits.writeJSON(pathway, curr)

    console.log("CBS data released")
}

export default async function prepCBS() {
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
