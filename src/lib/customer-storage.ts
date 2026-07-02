import { collection, getDocs, addDoc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export interface Customer {
  name: string;
  amount: number;
  mobile: string;
  days: number;
}

const CUSTOMERS_COLLECTION = "customers";

function isCustomer(item: unknown): item is Customer {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as any).name === "string" &&
    typeof (item as any).amount === "number" &&
    typeof (item as any).mobile === "string" &&
    typeof (item as any).days === "number"
  );
}

function validateCustomers(data: unknown): Customer[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isCustomer);
}

export async function readStoredCustomers(): Promise<Customer[]> {
  if (!isFirebaseConfigured) return [];

  try {
    const snapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    const customers = snapshot.docs.map((doc) => doc.data());
    return validateCustomers(customers);
  } catch {
    return [];
  }
}

export async function addCustomer(customer: Customer): Promise<void> {
  if (!isFirebaseConfigured) return;

  try {
    await addDoc(collection(db, CUSTOMERS_COLLECTION), customer);
  } catch {
    // Ignore database write failures for now.
  }
}

export function subscribeToCustomers(callback: (customers: Customer[]) => void): Unsubscribe {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => undefined;
  }

  return onSnapshot(collection(db, CUSTOMERS_COLLECTION), (snapshot) => {
    const customers = snapshot.docs.map((doc) => doc.data());
    callback(validateCustomers(customers));
  });
}
