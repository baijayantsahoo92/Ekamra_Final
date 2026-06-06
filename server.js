const compression = require("compression");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { pages, navItems, footerText, getPageByPath } = require("./src/content");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
const submissionsFile =
  process.env.SUBMISSIONS_FILE || path.join(__dirname, "data", "submissions.jsonl");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "30d",
    etag: true,
  }),
);

app.locals.navItems = navItems;
app.locals.footerText = footerText;

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get(["/", "/whyus", "/whyus/", "/about", "/about/", "/medical", "/medical/", "/opmodel", "/opmodel/", "/journey", "/journey/", "/faq", "/faq/", "/contact", "/contact/"], (req, res) => {
  const page = getPageByPath(req.path);
  res.render("page", {
    page,
    pages,
    submitted: req.query.sent === "1",
    currentPath: page.path,
  });
});

app.post(["/contact", "/contact/"], (req, res) => {
  const submission = {
    receivedAt: new Date().toISOString(),
    body: req.body,
  };
  try {
    fs.mkdirSync(path.dirname(submissionsFile), { recursive: true });
    fs.appendFileSync(submissionsFile, `${JSON.stringify(submission)}\n`);
  } catch (error) {
    console.error("Unable to persist contact submission", error.message);
  }
  console.log("Consultation/contact form submission", JSON.stringify(req.body, null, 2));
  const referer = req.get("referer") || "";
  let refererPath = "";
  try {
    refererPath = new URL(referer).pathname;
  } catch (_error) {
    refererPath = "";
  }
  const redirectTarget = refererPath === "/" ? "/?sent=1#section-contact" : "/contact/?sent=1";
  res.redirect(redirectTarget);
});

app.use((req, res) => {
  res.status(404).render("404", {
    page: {
      title: "Page Not Found",
      description: "The page you are looking for could not be found.",
      path: req.path,
    },
    currentPath: req.path,
  });
});

const server = app.listen(port, host, () => {
  console.log(`Ekamra Node website running on ${host}:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
