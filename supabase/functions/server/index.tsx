import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const KV_PREFIX = "arplanet_";
const ALL_KEYS = [
  "heroSlides", "posts", "portfolio", "services", "inquiries",
  "companyInfo", "aboutData", "adminPassword", "artists", "awards",
  "currentProjects", "kakaoChannelUrl", "siteLogo", "kakaoLogo", "ogImage",
  "adminAccounts", "instagramToken", "analyticsData"
];

// Health check endpoint
app.get("/make-server-f286b462/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── Get ALL site data (bulk read) ───
app.get("/make-server-f286b462/site-data", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const prefixedKeys = ALL_KEYS.map(k => `${KV_PREFIX}${k}`);
    const { data, error } = await supabase
      .from("kv_store_f286b462")
      .select("key, value")
      .in("key", prefixedKeys);

    if (error) {
      console.log("Error fetching site data:", error.message);
      return c.json({ error: `Failed to fetch site data: ${error.message}` }, 500);
    }

    const result: Record<string, unknown> = {};
    for (const row of (data ?? [])) {
      const shortKey = row.key.replace(KV_PREFIX, "");
      result[shortKey] = row.value;
    }
    return c.json(result);
  } catch (err) {
    console.log("Unexpected error fetching site data:", err);
    return c.json({ error: `Unexpected error: ${err}` }, 500);
  }
});

// ─── Save a single data key ───
app.put("/make-server-f286b462/site-data/:key", async (c) => {
  try {
    const key = c.req.param("key");
    if (!ALL_KEYS.includes(key)) {
      return c.json({ error: `Invalid key: ${key}` }, 400);
    }
    const body = await c.req.json();
    await kv.set(`${KV_PREFIX}${key}`, body.value);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error saving site data key:`, err);
    return c.json({ error: `Failed to save: ${err}` }, 500);
  }
});

// ─── Bulk save multiple keys ───
app.put("/make-server-f286b462/site-data", async (c) => {
  try {
    const body = await c.req.json();
    const keys: string[] = [];
    const values: unknown[] = [];
    for (const [k, v] of Object.entries(body)) {
      if (ALL_KEYS.includes(k)) {
        keys.push(`${KV_PREFIX}${k}`);
        values.push(v);
      }
    }
    if (keys.length > 0) {
      await kv.mset(keys, values);
    }
    return c.json({ success: true, count: keys.length });
  } catch (err) {
    console.log("Error bulk saving site data:", err);
    return c.json({ error: `Failed to bulk save: ${err}` }, 500);
  }
});

// ─── Submit inquiry (public) ───
app.post("/make-server-f286b462/inquiry", async (c) => {
  try {
    const inquiry = await c.req.json();
    // Get existing inquiries
    const existing = await kv.get(`${KV_PREFIX}inquiries`);
    const list = Array.isArray(existing) ? existing : [];
    list.push(inquiry);
    await kv.set(`${KV_PREFIX}inquiries`, list);
    return c.json({ success: true });
  } catch (err) {
    console.log("Error saving inquiry:", err);
    return c.json({ error: `Failed to save inquiry: ${err}` }, 500);
  }
});

// ─── Instagram Feed Proxy ───
app.get("/make-server-f286b462/instagram-feed", async (c) => {
  try {
    // Get the token from KV store
    const token = await kv.get(`${KV_PREFIX}instagramToken`);
    if (!token) {
      return c.json({ error: "Instagram access token not configured", posts: [] }, 200);
    }
    const limit = c.req.query("limit") || "12";
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      console.log("Instagram API error:", errText);
      return c.json({ error: `Instagram API error: ${errText}`, posts: [] }, 200);
    }
    const data = await res.json();
    return c.json({ posts: data.data || [] });
  } catch (err) {
    console.log("Error fetching Instagram feed:", err);
    return c.json({ error: `Failed to fetch Instagram: ${err}`, posts: [] }, 200);
  }
});

Deno.serve(app.fetch);