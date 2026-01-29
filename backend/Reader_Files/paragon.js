import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import ollama from "ollama";
puppeteer.use(StealthPlugin());

async function runOnPage(url, scriptOrFn, ...args) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  let code;
  if (typeof scriptOrFn === "function") {
    code = scriptOrFn.toString();
  } else if (typeof scriptOrFn === "string") {
    code = scriptOrFn;
  } else {
    throw new Error("scriptOrFn must be a function or a string");
  }

  const result = await page.evaluate(
    (fnStr, passedArgs) => {
      const fn = new Function(
        "...args",
        `return (${fnStr})(...args)`
      );
      return fn(...passedArgs);
    },
    code,
    args
  );

  await browser.close();

  return result;
}

async function getReading(sites) {
  const replies = [];

  for (const site of sites) {
    const things = await runOnPage(
      site,
      (selector) => {
        const els = [...document.querySelectorAll(selector)];
        return els.map(el => el.textContent);
      },
      "h1, h2, p, span"
    );

    replies.push(things.join("\n"));
  }

  return replies;
}

async function getSummary(names, reading, temp = 1.0) {
  reading = reading.join("\n");
  names = names.join("\n");

  const schema = {
    type: "object",
    properties: {
      point1: { type: "string" },
      point2: { type: "string" },
      point3: { type: "string" },
      point4: { type: "string" },
      point5: { type: "string" }
    },
    required: ["point1", "point2", "point3","point4","point5"]
  };

  const response = await ollama.chat({
    model: "llama3.1",
    messages: [
      {
        role: "system",
        content: `
You are a factual summarizer. You will output exactly five points in JSON; each point MUST be at least nine sentences long. Do NOT output anything else besides a valid JSON with keys "point1", "point2", "point3" and the text at least three sentences each.
`
      },
      {
        role: "user",
        content: `
Based upon the following titles: ${names}
Summarize the following reading:
${reading}
`
      }
    ],
    format: schema,
    options: { temperature: temp }
  });

  //console.log(response);
  let reply = response.message.content
  reply = reply.replace("{","");
  reply = reply.replace("}","")
  reply = reply.replace('"',"")
  reply = reply.split("point")
  for(let i=1;i<reply.length;i++){
    reply[i] = `Point ${i}:` + reply[i].split(":")[1]
  }
  reply.shift()
  reply = reply.join("\n")
  reply = reply.replace('",',"")
  //console.log(reply)
  return reply;
}

export default async function getResponse(list){
  let sites = []
  let names = []
  for(let i=0;i<list.length;i++){
    names.push(list[i][0])
    sites.push(list[i][1])
  }
  let items = await getReading(sites);
  let answer = await getSummary(names,items);
  return answer;
}