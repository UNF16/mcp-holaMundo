import { createMcpServer } from "./server.js";

async function main() {
    const { start } = createMcpServer();
    await start();
}

main().catch((err) => {
    console.error("[fatal]", err);
    process.exit(1);

}); 
