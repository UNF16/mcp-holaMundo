import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode, } from "@modelcontextprotocol/sdk/types.js";
import { helloWorldHandler } from "./handlers/helloworld.js";

export function createMcpServer() {

    const server = new Server(

        { name: "mcp-holamundo", version: "1.0.0" },

        { capabilities: { tools: {} } } // le avisamos al host: "este server ofrece tools" 

    );

    // 1) tools/list → el catálogo. Es lo que el host lee para descubrir qué podemos hacer. 

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: "helloWorld",
                description: "Devuelve un saludo personalizado para el nombre recibido.",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Nombre de la persona a saludar" },
                    },

                    required: ["name"],
                },

            },

        ],

    }));

    // 2) tools/call → la ejecución. El host pide correr una tool por nombre, con argumentos. 

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        // Tool que no existe → error de PROTOCOLO (JSON-RPC "error", con code) 

        if (name !== "helloWorld") {
            throw new McpError(ErrorCode.MethodNotFound, `Tool desconocida: ${name}`);
        }

        try {

            const result = await helloWorldHandler(args ?? {});
            return {
                content: [{ type: "text", text: result.greeting }], // lo que lee el modelo 
                structuredContent: result,                           // lo que lee un programa 
            };

        } catch (err) {

            // Falla DENTRO de la tool → resultado con isError: el proceso no se cae 
            return {
                isError: true,
                content: [{ type: "text", text: `Request inválida: ${String(err)}` }],

            };

        }

    });



    async function start() {

        const transport = new StdioServerTransport();
        await server.connect(transport);
        // stdout es el canal del protocolo: los logs SIEMPRE van a stderr 
        console.error("[mcp] server levantado (stdio)");

    }

    return { server, start };

}