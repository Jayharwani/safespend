import {
  Car,
  Television,
  Receipt,
  DeviceMobile,
  Lightning,
  House,
  ForkKnife,
  ShoppingBag,
  Coffee,
  CreditCard,
  type Icon,
} from "@phosphor-icons/react";

export function getBillIcon(name: string): Icon {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile") || n.includes("cell")) return DeviceMobile;
  if (n.includes("electric") || n.includes("power") || n.includes("gas") || n.includes("energy") || n.includes("util")) return Lightning;
  if (n.includes("car") || n.includes("insurance") || n.includes("auto") || n.includes("vehicle")) return Car;
  if (n.includes("stream") || n.includes("sub") || n.includes("netflix") || n.includes("spotify") || n.includes("tv")) return Television;
  if (n.includes("rent") || n.includes("mortgage") || n.includes("home") || n.includes("housing")) return House;
  if (n.includes("food") || n.includes("grocer") || n.includes("dining") || n.includes("eat")) return ForkKnife;
  if (n.includes("coffee") || n.includes("cafe")) return Coffee;
  if (n.includes("shop") || n.includes("store") || n.includes("amazon")) return ShoppingBag;
  if (n.includes("card") || n.includes("loan") || n.includes("credit")) return CreditCard;
  return Receipt;
}
