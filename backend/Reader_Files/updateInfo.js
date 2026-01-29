import addressList from "./Helpers/address.js";

async function updateInformation() {
    const updatedList = addressList.getReaders();

    for (const key in updatedList) {
        const modulePath = updatedList[key];
        const module = await import(modulePath);
        const fn = module.default;

        if (typeof fn === "function") {
            await fn(); 
        }
    }
    return 1
}

export default updateInformation;