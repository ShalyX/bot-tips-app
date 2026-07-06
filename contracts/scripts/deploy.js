import { ethers } from "ethers";
import fs from "fs";
import "dotenv/config";

async function main() {
    const privateKey = process.env["PRIVATE_KEY"];
    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in contracts/.env");
    }

    const provider = new ethers.JsonRpcProvider("https://rpc.bohr.life");
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Read the compiled artifact
    const artifactStr = fs.readFileSync("./artifacts/contracts/CreatorRegistry.sol/CreatorRegistry.json", "utf8");
    const artifact = JSON.parse(artifactStr);
    
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("CreatorRegistry deployed to:", address);
    console.log("Explorer:", `https://scan.bohr.life/address/${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
