require("dotenv").config();
const express      = require("express");
const jwt          = require("jsonwebtoken");
const bcrypt       = require("bcrypt");
const crypto       = require("crypto");
const cookieParser = require("cookie-parser");
const cors        = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


let refreshTokens = [];
let users         = [];

app.post("/auth/register", async (req, res) => {
  console.log("Received registration request:", req.body);
  if (!req.body.email || !req.body.firstname || !req.body.lastname ||!req.body.password) {
    return res.status(400).send("Email, first name, lastname and password are required!");
  }
  if (validateEmail(req.body.email)) {
    return res.status(400).send('No valid Email')
  }
  try {
    const userId         = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await createUser(userId, req.body.email, req.body.firstname, req.body.lastname, hashedPassword);
    res.status(201).send(`User with the Mail "${req.body.email}" created successfully`);
  } catch {
    res.status(500).send(`Error creating the User with the Mail "${req.body.email}"`);
  }
});

app.post("/auth/login", async (req, res) => {
  console.log("Received login request:", req.body);
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Email and password required");
  }
  try {
    const user = users.find((u) => u.email === req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.hashedPassword))) {
      return res.status(401).json({ loginSuccessful: false });
    }

    const { token: accessToken }                     = generateAccessToken(user.userId, user.role);
    const { token: refreshToken, jti, expiresAt }    = generateRefreshToken(user.userId, user.role);

    refreshTokens.push({ token: refreshToken, jti, expiresAt });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge:   24 * 60 * 60 * 1000,
      path:     "/auth"
    });

    res.json({ loginSuccessful: true, accessToken, refreshToken});
  } catch {
    res.status(500).send();
  }
});

app.post("/auth/updateAccessToken", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const stored = refreshTokens.find((t) => t.token === refreshToken);
    if (!stored) {
      const payload  = jwt.decode(refreshToken);
      refreshTokens  = refreshTokens.filter((t) => t.userId !== payload?.sub);
      return res.sendStatus(403);
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens = refreshTokens.filter((t) => t.token !== refreshToken);

    const { token: accessToken }                  = generateAccessToken(payload.sub, payload.role);
    const { token: newRefreshToken, jti, expiresAt } = generateRefreshToken(payload.sub, payload.role);

    refreshTokens.push({ token: newRefreshToken, jti, expiresAt });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge:   24 * 60 * 60 * 1000,
      path:     "/auth"
    });

    res.json({ accessToken });
  } catch {
    res.sendStatus(403);
  }
});

app.delete("/auth/logout", (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      refreshTokens = refreshTokens.filter((t) => t.token !== refreshToken);
    }
    res.clearCookie("refreshToken", { path: "/auth" });
    res.sendStatus(204);
  } catch {
    res.status(500).send();
  }
});

function validateEmail(email) {
  // return true if valid
  return !String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function createUser(userId, email, firstname, lastname, hashedPassword) {
  users.push({ userId, email, firstname, lastname, hashedPassword });
}

function generateAccessToken(userId, role) {
  const jti   = crypto.randomUUID();
  const token = jwt.sign(
    { sub: userId, jti, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return { token, jti };
}

function generateRefreshToken(userId, role) {
  const jti       = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const token     = jwt.sign(
    { sub: userId, jti, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  return { token, jti, expiresAt };
}

app.listen(4000);