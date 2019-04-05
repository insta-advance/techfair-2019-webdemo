const { exec } = require("child_process");

async function main() {
  const backend = exec("cd backend/src && npm run express-start-dev");
  let frontend = null;

  backend.stdout.on("data", () => {
    if (frontend) {
      return;
    }
    console.log("Backend ready on localhost:8888, starting frontend...")

    frontend = exec("cd frontend && npm start");
    frontend.on("error", e => console.log("Frontend error: ", 3));

  });
  backend.on("error", e => console.log("Backend error: ", e));

  const kill = () => {
    console.log("Killing backend...");
    backend.kill("SIGHUP");
    console.log("Killing frontend...");
    frontend.kill("SIGHUP");
  };

  process.on("SIGINT", kill);
  process.on("SIGTERM", kill);
}

main().catch(console.log);