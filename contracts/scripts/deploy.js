import { ethers } from "ethers";
import fs from "fs";
import "dotenv/config";

async function main() {
    const provider = new ethers.JsonRpcProvider("https://rpc.bohr.life");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Read the compiled artifact
    const artifactStr = fs.readFileSync("./artifacts/contracts/CreatorRegistry.sol/CreatorRegistry.json", "utf8");
    const artifact = JSON.parse(artifactStr);
    
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    
    console.log("CreatorRegistry deployed to:", await contract.getAddress());
}

main().catch(console.error);
