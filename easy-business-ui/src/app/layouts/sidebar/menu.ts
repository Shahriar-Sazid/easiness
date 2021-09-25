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
    link: "/accounts",
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
    id: 5,
    label: "COMMONS.SELL",
    icon: "fas fa-box-open",
    link: "/business/sell",
  },
];
