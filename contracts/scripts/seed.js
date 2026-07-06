import { ethers } from "ethers";
import fs from "fs";
import "dotenv/config";

async function main() {
    const privateKey = process.env["PRIVATE_KEY"];
    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in contracts/.env");
    }

    const provider = new ethers.JsonRpcProvider("https://rpc.bohr.life");
    const deployer = new ethers.Wallet(privateKey, provider);
    
    const artifactStr = fs.readFileSync("./artifacts/contracts/CreatorRegistry.sol/CreatorRegistry.json", "utf8");
    const artifact = JSON.parse(artifactStr);
    const registryAddress = process.env["CREATOR_REGISTRY_ADDRESS"] || "0xcb55f29c7F1D2e86E77CDc63C61270A73665Ae33";
    const registry = new ethers.Contract(registryAddress, artifact.abi, deployer);

    console.log("Generating demo accounts...");
    const creator1 = ethers.Wallet.createRandom().connect(provider);
    const creator2 = ethers.Wallet.createRandom().connect(provider);
    const creator3 = ethers.Wallet.createRandom().connect(provider);
    const tipper = ethers.Wallet.createRandom().connect(provider);

    console.log("Funding accounts with gas...");
    let tx = await deployer.sendTransaction({ to: creator1.address, value: ethers.parseEther("0.1") });
    await tx.wait();
    tx = await deployer.sendTransaction({ to: creator2.address, value: ethers.parseEther("0.1") });
    await tx.wait();
    tx = await deployer.sendTransaction({ to: creator3.address, value: ethers.parseEther("0.1") });
    await tx.wait();
    tx = await deployer.sendTransaction({ to: tipper.address, value: ethers.parseEther("5") });
    await tx.wait();

    console.log("Registering creators...");
    tx = await registry.connect(creator1).registerCreator("Alice in Web3", "Exploring the decentralized web one block at a time.", "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg");
    await tx.wait();
    tx = await registry.connect(creator1).setCampaign("New Podcast Mic", 150);
    await tx.wait();

    tx = await registry.connect(creator2).registerCreator("Bob Builds", "Full stack developer building open source tools.", "https://pbs.twimg.com/profile_images/1701878932176310272/q17rN95O_400x400.jpg");
    await tx.wait();
    tx = await registry.connect(creator2).setCampaign("Server Hosting", 50);
    await tx.wait();

    tx = await registry.connect(creator3).registerCreator("Charlie Art", "Digital artist and animator.", "https://pbs.twimg.com/profile_images/1648682054240976896/b0fB2e3b_400x400.jpg");
    await tx.wait();
    tx = await registry.connect(creator3).setCampaign("Drawing Tablet", 200);
    await tx.wait();

    console.log("Sending tips...");
    tx = await registry.connect(tipper).sendTip(creator1.address, "Fan", "Love your content!", { value: ethers.parseEther("1.5") });
    await tx.wait();
    tx = await registry.connect(tipper).sendTip(creator2.address, "Supporter", "Keep building!", { value: ethers.parseEther("0.5") });
    await tx.wait();
    tx = await registry.connect(tipper).sendTip(creator1.address, "Anon", "", { value: ethers.parseEther("2.5") });
    await tx.wait();

    console.log("Seed complete!");
    console.log("Registry:", registryAddress);
    console.log("Creators:", creator1.address, creator2.address, creator3.address);
    console.log("Tipper:", tipper.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
