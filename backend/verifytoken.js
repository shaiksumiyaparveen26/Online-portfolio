import pkg from "jsonwebtoken";
const { verify } = pkg;

export const verifytoken = (req, res, next) => {
  const encryptedToken = req.cookies.token;

  if (!encryptedToken) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = verify(encryptedToken, "abcdef");
    console.log("Decoded token:", decoded);

    req.user = decoded; 

    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired. Please re-login" });
  }
};
