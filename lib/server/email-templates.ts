import "server-only";
import { brand, absoluteUrl } from "@/lib/brand";

/**
 * Transactional email templates. Inline styles and tables for email-client
 * compatibility; calm, quiet, on-brand. Every email has a plain-text twin.
 */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1f1f1f;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 8px 28px;font-size:15px;font-weight:600;letter-spacing:0.14em;">${brand.name}</td></tr>
<tr><td style="background:#ffffff;border:1px solid #ececec;border-radius:24px;padding:36px 32px;">${body}</td></tr>
<tr><td style="padding:28px 8px 0;font-size:12px;line-height:1.6;color:#8a8a86;">${brand.name} · ${esc(brand.promise)}<br>You received this email because it was requested at ${esc(brand.url.replace(/^https?:\/\//, ""))}.</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:#1f1f1f;color:#fafaf8;text-decoration:none;font-size:14px;font-weight:500;padding:12px 22px;border-radius:999px;">${esc(label)}</a>`;

export type DeliveryLine = { productName: string; url: string };

export function deliveryEmail({ lines, free, orderId }: { lines: DeliveryLine[]; free: boolean; orderId: string }) {
  const subject = lines.length === 1 ? `Your download: ${lines[0].productName}` : `Your ${brand.asciiName} downloads`;
  const items = lines
    .map(
      (l) => `<tr><td style="padding:14px 0;border-top:1px solid #ececec;">
<p style="margin:0 0 10px;font-size:16px;font-weight:600;">${esc(l.productName)}</p>${button(l.url, "Download")}</td></tr>`,
    )
    .join("");
  const html = layout(
    subject,
    `<h1 style="margin:0;font-size:26px;line-height:1.15;letter-spacing:-0.02em;">${free ? "Here's your free download." : "Thank you. Your files are ready."}</h1>
<p style="margin:14px 0 22px;font-size:15px;line-height:1.6;color:#6e6e6a;">Your ${lines.length === 1 ? "link is" : "links are"} private to you and ${lines.length === 1 ? "stays" : "stay"} active for a few days. If a link expires, you can request a fresh one at any time.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a8a86;">Need your files again later? Visit <a href="${esc(absoluteUrl("/access"))}" style="color:#3d5c47;">${esc(absoluteUrl("/access"))}</a> and enter this email address.<br>Order number: ${esc(orderId)}</p>`,
  );
  const text = [
    free ? "Here's your free download." : "Thank you. Your files are ready.",
    "",
    ...lines.map((l) => `${l.productName}\n${l.url}\n`),
    `Need your files again later? Visit ${absoluteUrl("/access")} and enter this email address.`,
    `Order number: ${orderId}`,
    "",
    `${brand.name} · ${brand.promise}`,
  ].join("\n");
  return { subject, html, text };
}

export function accessEmail({ lines }: { lines: DeliveryLine[] }) {
  const subject = `Your ${brand.asciiName} downloads`;
  const items = lines
    .map((l) => `<tr><td style="padding:14px 0;border-top:1px solid #ececec;"><p style="margin:0 0 10px;font-size:16px;font-weight:600;">${esc(l.productName)}</p>${button(l.url, "Download")}</td></tr>`)
    .join("");
  const html = layout(
    subject,
    `<h1 style="margin:0;font-size:26px;line-height:1.15;letter-spacing:-0.02em;">Your downloads.</h1>
<p style="margin:14px 0 22px;font-size:15px;line-height:1.6;color:#6e6e6a;">Here are fresh links to everything you've received from ${brand.name}. If you didn't ask for this, you can ignore this email.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>`,
  );
  const text = ["Your downloads.", "", ...lines.map((l) => `${l.productName}\n${l.url}\n`), "If you didn't ask for this, you can ignore this email."].join("\n");
  return { subject, html, text };
}

export function contactNotification({ name, email, message }: { name: string; email: string; message: string }) {
  const subject = `New message from ${name}`;
  const html = layout(
    subject,
    `<p style="margin:0 0 6px;font-size:13px;color:#8a8a86;">Contact form</p>
<h1 style="margin:0 0 18px;font-size:22px;letter-spacing:-0.02em;">${esc(name)} &lt;${esc(email)}&gt;</h1>
<p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;">${esc(message)}</p>`,
  );
  return { subject, html, text: `From: ${name} <${email}>\n\n${message}` };
}

export function orderNotification({ orderId, email, items, free }: { orderId: string; email: string; items: string[]; free: boolean }) {
  const subject = `${free ? "Free download" : "New order"}: ${items.join(", ")}`;
  const html = layout(
    subject,
    `<p style="margin:0 0 6px;font-size:13px;color:#8a8a86;">${free ? "Free product claimed" : "Order paid and delivered"}</p>
<h1 style="margin:0 0 14px;font-size:22px;letter-spacing:-0.02em;">${esc(items.join(", "))}</h1>
<p style="margin:0;font-size:14px;line-height:1.7;color:#6e6e6a;">Customer: ${esc(email)}<br>Order number: ${esc(orderId)}</p>`,
  );
  return { subject, html, text: `${subject}\nCustomer: ${email}\nOrder number: ${orderId}` };
}
