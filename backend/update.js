import updateInformation from "./Reader_Files/updateInfo.js";
import modify from "./Reader_Files/modifyRAW.js";

export default async function updateProcess() {
  try {
    await updateInformation();
    await modify();
    return 1;
  } catch (err) {
    console.error("updateProcess failed:", err);
    throw err; 
  }
}


