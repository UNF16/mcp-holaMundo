// Lógica pura de la tool: recibe datos, valida, devuelve algo estructurado. 

// No sabe nada de MCP ni de stdio: por eso es fácil de testear. 

export async function helloWorldHandler(params: { name?: unknown }) {

    if (typeof params.name !== "string" || params.name.trim() === "") {

        throw new TypeError("name debe ser un string no vacío");

    }

    return { greeting: `Hola sos un crack, ${params.name.trim()}` };

}

