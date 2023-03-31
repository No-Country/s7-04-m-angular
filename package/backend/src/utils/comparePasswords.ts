import bcrypt from "bcrypt";

export const comparePasswords = async (newPassword: string, password: string) => {
  return await bcrypt.compare(newPassword, password);
};
