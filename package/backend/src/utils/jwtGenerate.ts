import jwt from "jsonwebtoken";

export const jwtGenerate = (id: string, role: string, duration: string) => {
  return jwt.sign({ id, role }, `${process.env.JWT_SECRET || ""}`, {
    expiresIn: duration,
  });
};
