import { productStatuses, type ProductStatus } from "@/content/products";

export function StatusBadge({ status }: { status: ProductStatus }) {
  return <span className={`badge badge--${status}`}>{productStatuses[status]}</span>;
}
