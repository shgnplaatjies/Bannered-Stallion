import { OrderDishStatus } from "../../models/OrderDishStatus.entity";
import { OrderStatus } from "../../models/OrderStatus.entity";
import { User } from "../../models/User.entity";
import { Vendor } from "../../models/Vendor.entity";

export const convertToArray = (value: string): false | number[] => {
  if (typeof value !== "string" || value.trim() === "") return false;

  if (!value.includes(",") && Number.isFinite(Number(value)))
    return [Number(value)];

  if (value.split(",").map(Number).every(Number.isFinite))
    return value.split(",").map(Number);

  return false;
};

export const findNextStatus = (
  currStatus: OrderStatus | OrderDishStatus,
  orderStatuses: (OrderStatus | OrderDishStatus)[],
  type: typeof Vendor | typeof User
): OrderStatus | 202 | 400 => {
  const currIndex = orderStatuses.findIndex(
    (status) => status.id === currStatus.id
  );

  if (currIndex === -1 || currIndex === orderStatuses.length - 1) return 400;

  const next = orderStatuses[currIndex + 1];

  if (!next || next instanceof OrderDishStatus) return 400;

  if (type === Vendor && next.isVendorControlled) return next;
  if (type === User && !next.isVendorControlled) return next;

  return 202;
};
