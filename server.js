const compression = require("compression");
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { pages, navItems, footerText, getPageByPath } = require("./src/content");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  fs.appendFileSync(path.join(__dirname, "data", "submissions.jsonl"), `${JSON.stringify(submission)}\n`);
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

app.listen(port, () => {
  console.log(`Ekamra Node website running at http://localhost:${port}`);
});
