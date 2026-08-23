export type JsonBodyResult =
  { success: true; data: unknown } | { success: false; response: Response }

export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  try {
    return { success: true, data: await request.json() }
  } catch {
    return {
      success: false,
      response: Response.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON",
          },
        },
        { status: 400 }
      ),
    }
  }
}
