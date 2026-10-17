import { site } from "@/config/site";
import { Icon } from "./Icon";

/** Shows ONLY details that have been configured. Renders nothing for blank values. */
export function ContactDetails({ variant = "contact" }: { variant?: "contact" | "support" }) {
  const email = variant === "support" ? site.contact.supportEmail ?? site.contact.email : site.contact.email;
  const items = [
    email && { icon: "mail", label: variant === "support" ? "Support email" : "Email", node: <a href={`mailto:${email}`}>{email}</a> },
    site.contact.phone && { icon: "file", label: "Phone", node: <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a> },
    site.company.registeredAddress && { icon: "building", label: "Registered address", node: <span>{site.company.registeredAddress}</span> },
  ].filter(Boolean) as { icon: string; label: string; node: React.ReactNode }[];

  return (
    <ul className="info-list">
      <li>
        <span className="icon-tile"><Icon name="shield" size={20} /></span>
        <div><strong>{site.brand}</strong><span>A brand of {site.legalOwner}</span></div>
      </li>
      {items.map((it) => (
        <li key={it.label}>
          <span className="icon-tile"><Icon name={it.icon} size={20} /></span>
          <div><strong>{it.label}</strong>{it.node}</div>
        </li>
      ))}
      {items.length === 0 && (
        <li>
          <span className="icon-tile"><Icon name="mail" size={20} /></span>
          <div><strong>Online enquiries</strong><span>Use the form and we will reply by email.</span></div>
        </li>
      )}
    </ul>
  );
}
