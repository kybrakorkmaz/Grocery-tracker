import { ZodError } from "zod";

/**
 * Custom error class for API-related issues with specific HTTP status codes.
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Higher-order function to wrap API route handlers with unified error handling.
 * This simplifies route implementations by removing redundant try-catch blocks
 * and prevents implementation detail leaks in production.
 */
export function withErrorHandler<T extends any[]>(
    handler: (request: Request, ...args: T) => Promise<Response>
): (request: Request, ...args: T) => Promise<Response> {
    return async (request: Request, ...args: T) => {
        try {
            return await handler(request, ...args);
        } catch (error) {
            // 1. Handle explicit ApiErrors (like 401, 404)
            if (error instanceof ApiError) {
                return Response.json({ error: error.message }, { status: error.status });
            }

            // 2. Handle Zod validation errors (400)
            if (error instanceof ZodError) {
                const message = error.issues.map((iss) => iss.message).join(", ");
                return Response.json({ error: message }, { status: 400 });
            }

            // 3. Handle unexpected errors (500)
            console.error("[API Error] Unhandled exception:", error);

            const isProd = process.env.NODE_ENV === "production";
            const message = error instanceof Error ? error.message : "An unexpected error occurred";

            // Sanitize 500 Internal Server Error messages in production
            const userFriendlyMessage = isProd ? "Internal Server Error" : message;

            return Response.json(
                { error: userFriendlyMessage },
                { status: 500 }
            );
        }
    };
}
