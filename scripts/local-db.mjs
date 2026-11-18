import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const data = resolve(root, ".local/postgres");
const run = (bin, args) => execFileSync(bin, args, { stdio: "inherit" });
if (process.argv[2] === "stop") {
  run("pg_ctl", ["-D", data, "-m", "fast", "stop"]);
} else {
  mkdirSync(resolve(root, ".local"), { recursive: true, mode: 0o700 });
  if (!existsSync(resolve(data, "PG_VERSION"))) {
    run("initdb", [
      "-D",
      data,
      "-U",
      "wow_local",
      "--auth=trust",
      "--encoding=UTF8",
      "--locale=C",
    ]);
  }
  try {
    execFileSync("pg_ctl", ["-D", data, "status"], { stdio: "ignore" });
  } catch {
    run("pg_ctl", [
      "-D",
      data,
      "-l",
      resolve(root, ".local/postgres.log"),
      "-o",
      `-h 127.0.0.1 -p 55432 -k ${resolve(root, ".local")}`,
      "-w",
      "start",
    ]);
  }
  try {
    execFileSync(
      "psql",
      [
        "-h",
        "127.0.0.1",
        "-p",
        "55432",
        "-U",
        "wow_local",
        "-d",
        "wow_argentina",
        "-c",
        "SELECT 1",
      ],
      { stdio: "ignore" },
    );
  } catch {
    run("createdb", [
      "-h",
      "127.0.0.1",
      "-p",
      "55432",
      "-U",
      "wow_local",
      "wow_argentina",
    ]);
  }
  if (!existsSync(resolve(root, ".env"))) {
    writeFileSync(
      resolve(root, ".env"),
      `DATABASE_URL="postgresql://wow_local@127.0.0.1:55432/wow_argentina"\nDISCORD_INVITE_URL=""\nAPP_URL="http://localhost:3000"\nRATE_LIMIT_SALT="${randomBytes(32).toString("hex")}"\nTRUST_PROXY="false"\n`,
      { mode: 0o600 },
    );
  }
  console.log(
    "PostgreSQL local listo en 127.0.0.1:55432. Uso exclusivo de desarrollo.",
  );
}
