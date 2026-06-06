import { Car, Play, Receipt, Smartphone, Zap, type LucideIcon } from "lucide-react";

export function getBillIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile")) return Smartphone;
  if (n.includes("electric") || n.includes("power") || n.includes("gas")) return Zap;
  if (n.includes("car") || n.includes("insurance") || n.includes("auto")) return Car;
  if (n.includes("stream") || n.includes("sub") || n.includes("netflix")) return Play;
  return Receipt;
}
