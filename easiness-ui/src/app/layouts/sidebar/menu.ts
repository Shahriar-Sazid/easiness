import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "COMMONS.INITIAL_SETUP",
    isTitle: true,
  },
  {
    id: 2,
    label: "COMMONS.PRODUCT",
    icon: "fas fa-wrench",
    link: "/product",
  },
  {
    id: 3,
    label: "COMMONS.PEOPLE",
    icon: "fas fa-user",
    link: "/people",
  },
  {
    id: 4,
    label: "COMMONS.ACCOUNT",
    icon: "fas fa-money-check-alt",
    link: "/accounting",
  },
  {
    id: 5,
    label: "COMMONS.BUSINESS",
    isTitle: true,
  },
  {
    id: 5,
    label: "COMMONS.BUY",
    icon: "fas fa-boxes",
    link: "/business/buy",
  },
  {
    id: 6,
    label: "COMMONS.SELL",
    icon: "fas fa-box-open",
    link: "/business/sell",
  },
  {
    id: 7,
    label: "COMMONS.STOCK",
    icon: "fas fa-border-all",
    link: "/business/stock",
  },
  {
    id: 8,
    label: "COMMONS.DOCUMENT",
    isTitle: true,
  },
  {
    id: 9,
    label: "COMMONS.INVOICE",
    icon: "fas fa-file-invoice-dollar",
    link: "/document/list/invoice",
  },
  {
    id: 10,
    label: "COMMONS.PURCHASE_ORDER",
    icon: "fas fa-file-invoice",
    link: "/document/list/purchase-order",
  },
  {
    id: 11,
    label: "COMMONS.TX_HISTORY",
    icon: "fas fa-list",
    link: "/accounting/tx/history"
  }
];
