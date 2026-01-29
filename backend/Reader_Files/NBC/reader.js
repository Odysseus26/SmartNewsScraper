import readDigits from "../Helpers/readerFile.js"
import addresses from "../Helpers/address.js";

const url = "https://www.nbcnews.com/"
let pathway = addresses.getOutput().NBC

const keywords = [
    ["h2.storyline__headline a", "skip2"],
    ["h2.styles_teaseTitle__ClSV0 a", "none"]
]

async function readBackData(data, passAlong){
    console.log("NBC Data Recieved")

    if (passAlong === "skip2") {
        let newData = []
        for (let i = 0; i < data.length; i += 2) {
            newData.push(data[i])
        }
        data = newData
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i].inner + "%" + data[i].url
    }

    data = data.join("<>")

    let curr = readDigits.readJSON(pathway)
    curr.data = [curr.data, data].join("<>")
    readDigits.writeJSON(pathway, curr)

    console.log("NBC Data dumped")
}

export default async function prepNBC(){
    readDigits.blankOut(pathway)

    await Promise.all(
        keywords.map(([selector, passAlong]) => {
            return new Promise((resolve, reject) => {
                readDigits.readSite(
                    url,
                    selector,
                    async (data) => {
                        try {
                            await readBackData(data, passAlong)
                            resolve()
                        } catch (err) {
                            reject(err)
                        }
                    },
                    passAlong
                )
            })
        })
    )
}
