import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'COMMONS.INITIAL_SETUP',
        isTitle: true
    },
    {
        id: 2,
        label: 'COMMONS.PRODUCT_TITLE',
        icon: 'fa fa-wrench',
        link: '/product'
    }
];

