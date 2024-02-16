export async function isValidUUIDv4(param: string): Promise<boolean> {
    const uuidv4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return await uuidv4Pattern.test(param);
}
