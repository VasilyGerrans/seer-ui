import fs from "fs";
import path from "path";

export async function loadProgramMap(projectRoot: string): Promise<Record<string, string>> {
    const targetDir = path.join(projectRoot, "target", "deploy");

    if (!fs.existsSync(targetDir)) {
        throw new Error(`Directory not found: ${targetDir}`);
    }

    const files = fs.readdirSync(targetDir);
    const map: Record<string, string> = {};

    for (const file of files) {
        if (!file.endsWith(".so")) continue;

        const baseName = file.replace(/\.so$/, "");
        const keypairPath = path.join(targetDir, `${baseName}-keypair.json`);

        if (fs.existsSync(keypairPath)) {
            try {
                const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));

                let address: string;

                if (Array.isArray(keypairData)) {
                    const bs58 = (await import("bs58")).default;
                    const uint8 = Uint8Array.from(keypairData);
                    const pubkeyBytes = uint8.slice(32, 64);
                    address = bs58.encode(pubkeyBytes);
                } else if (typeof keypairData === "object" && keypairData.pubkey) {
                    address = keypairData.pubkey;
                } else {
                    throw new Error(`Unknown keypair format for ${keypairPath}`);
                }

                map[address] = baseName;
            } catch (err) {
                console.warn(`Failed to parse ${keypairPath}:`, err);
            }
        }
    }

    return map;
}
