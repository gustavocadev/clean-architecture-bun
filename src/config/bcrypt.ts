export class BcryptAdapter {
  static async hash(password: string): Promise<string> {
    return await Bun.password.hash(password);
  }

  static async compare(password: string, hashed: string): Promise<boolean> {
    return await Bun.password.verify(password, hashed);
  }
}
