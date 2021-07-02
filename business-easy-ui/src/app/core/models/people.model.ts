import { ContactNo } from "./contact-no.model";

export interface People {
  id: number;
  name: string;
  companyName: string;
  address: string;
  email: string;
  type: "CUSTOMER" | "SUPPLIER" | "BOTH";
  contactNoList: ContactNo[];
  contactNo: string;
  balance: number;
}
