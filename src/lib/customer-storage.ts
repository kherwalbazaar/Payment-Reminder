export interface Customer {
  name: string;
  amount: number;
  mobile: string;
  days: number;
}

const STORAGE_KEY = "customers";

export const defaultCustomers: Customer[] = [
  { name: "Rahul Sharma", amount: 2500, mobile: "9876543210", days: 3 },
  { name: "Amit Kumar", amount: 4800, mobile: "8765432109", days: 7 },
  { name: "Suresh Patel", amount: 1200, mobile: "7654321098", days: 1 },
  { name: "Vikram Singh", amount: 7500, mobile: "6543210987", days: 12 },
  { name: "Deepak Verma", amount: 3200, mobile: "5432109876", days: 5 },
];

function validateCustomers(data: unknown): Customer[] {
  if (!Array.isArray(data)) return defaultCustomers;

  return data.filter(
    (item): item is Customer =>
      Boolean(item) &&
      typeof item.name === "string" &&
      typeof item.amount === "number" &&
      typeof item.mobile === "string" &&
      typeof item.days === "number"
  );
}

export function readStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return defaultCustomers;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultCustomers;

    return validateCustomers(JSON.parse(saved));
  } catch {
    return defaultCustomers;
  }
}

export function writeStoredCustomers(customers: Customer[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // Ignore storage failures
  }
}
