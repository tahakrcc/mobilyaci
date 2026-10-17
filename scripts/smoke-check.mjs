const base = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const pages = ["/tr", "/en", "/tr/products", "/tr/chairs", "/tr/sets", "/tr/woods", "/tr/projects", "/tr/design", "/tr/track", "/catalog/Wooden_Universe_Collection_2027.pdf"];
const failures = [];

for (const path of pages) {
  try {
    const response = await fetch(`${base}${path}`, { redirect: "follow" });
    const type = response.headers.get("content-type") || "";
    const expectedType = path.endsWith(".pdf") ? "application/pdf" : "text/html";
    if (!response.ok || !type.includes(expectedType)) failures.push(`${path}: ${response.status} ${type}`);
    else console.log(`OK ${response.status} ${path}`);
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const invalidOrder = await fetch(`${base}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
if (invalidOrder.status !== 400) failures.push(`/api/orders invalid payload: expected 400, got ${invalidOrder.status}`);
else console.log("OK 400 /api/orders invalid payload");

if (failures.length) {
  console.error("\nSMOKE CHECK FAILED\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`\nSmoke check passed against ${base}`);
