import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/dashboard',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
                link: 'javascript:void(0);',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
                link: 'javascript:void(0);',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
                link: 'javascript:void(0);',
                parentId: 2
            },
        ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 9,
        label: 'MENUITEMS.CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: 'javascript:void(0);',
    },
    {
        id: 10,
        label: 'MENUITEMS.CHAT.TEXT',
        icon: 'bx-chat',
        link: 'javascript:void(0);',
        
    },
    {
        id: 11,
        label: 'MENUITEMS.FILEMANAGER.TEXT',
        icon: 'bx-file',
        link: 'javascript:void(0);',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.FILEMANAGER.BADGE',
        },
    },
    {
        id: 12,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 13,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 14,
                label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTDETAIL',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 15,
                label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 16,
                label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 17,
                label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 18,
                label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 19,
                label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
                link: 'javascript:void(0);',
                parentId: 12
            },
            {
                id: 20,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                link: 'javascript:void(0);',
                parentId: 12
            },
        ]
    },
    {
        id: 21,
        label: 'MENUITEMS.CRYPTO.TEXT',
        icon: 'bx-bitcoin',
        subItems: [
            {
                id: 22,
                label: 'MENUITEMS.CRYPTO.LIST.WALLET',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 23,
                label: 'MENUITEMS.CRYPTO.LIST.BUY/SELL',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 24,
                label: 'MENUITEMS.CRYPTO.LIST.EXCHANGE',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 25,
                label: 'MENUITEMS.CRYPTO.LIST.LENDING',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 26,
                label: 'MENUITEMS.CRYPTO.LIST.ORDERS',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 27,
                label: 'MENUITEMS.CRYPTO.LIST.KYCAPPLICATION',
                link: 'javascript:void(0);',
                parentId: 21
            },
            {
                id: 28,
                label: 'MENUITEMS.CRYPTO.LIST.ICOLANDING',
                link: 'javascript:void(0);',
                parentId: 21
            }
        ]
    },
    {
        id: 29,
        label: 'MENUITEMS.EMAIL.TEXT',
        icon: 'bx-envelope',
        subItems: [
            {
                id: 30,
                label: 'MENUITEMS.EMAIL.LIST.INBOX',
                link: 'javascript:void(0);',
                parentId: 29
            },
            {
                id: 31,
                label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
                link: 'javascript:void(0);',
                parentId: 29
            },
            {
                id: 32,
                label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.TEXT',
                badge: {
                    variant: 'success',
                    text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
                },
                parentId: 29,
                subItems: [
                    {
                        id:33 ,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BASIC',
                        link: 'javascript:void(0);',
                        parentId:32 
                    },
                    {
                        id:34 ,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.ALERT',
                        link: 'javascript:void(0);',
                        parentId:32 
                    },
                    {
                        id:35 ,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BILLING',
                        link: 'javascript:void(0);',
                        parentId:32 
                    }
                ]
            }
        ]
    },
    {
        id: 36,
        label: 'MENUITEMS.INVOICES.TEXT',
        icon: 'bx-receipt',
        subItems: [
            {
                id: 37,
                label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
                link: 'javascript:void(0);',
                parentId: 36
            },
            {
                id: 38,
                label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAIL',
                link: 'javascript:void(0);',
                parentId: 36
            },
        ]
    },
    {
        id: 39,
        label: 'MENUITEMS.PROJECTS.TEXT',
        icon: 'bx-briefcase-alt-2',
        subItems: [
            {
                id: 40,
                label: 'MENUITEMS.PROJECTS.LIST.GRID',
                link: 'javascript:void(0);',
                parentId: 38
            },
            {
                id: 41,
                label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
                link: 'javascript:void(0);',
                parentId: 38
            },
            {
                id: 42,
                label: 'MENUITEMS.PROJECTS.LIST.OVERVIEW',
                link: 'javascript:void(0);',
                parentId: 38
            },
            {
                id: 43,
                label: 'MENUITEMS.PROJECTS.LIST.CREATE',
                link: 'javascript:void(0);',
                parentId: 38
            }
        ]
    },
    {
        id: 44,
        label: 'MENUITEMS.TASKS.TEXT',
        icon: 'bx-task',
        subItems: [
            {
                id: 45,
                label: 'MENUITEMS.TASKS.LIST.TASKLIST',
                link: 'javascript:void(0);',
                parentId: 44
            },
            {
                id: 46,
                label: 'MENUITEMS.TASKS.LIST.KANBAN',
                link: 'javascript:void(0);',
                parentId: 44
            },
            {
                id: 47,
                label: 'MENUITEMS.TASKS.LIST.CREATETASK',
                link: 'javascript:void(0);',
                parentId: 44
            }
        ]
    },
    {
        id: 48,
        label: 'MENUITEMS.CONTACTS.TEXT',
        icon: 'bxs-user-detail',
        subItems: [
            {
                id: 49,
                label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
                link: 'javascript:void(0);',
                parentId: 48
            },
            {
                id: 50,
                label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
                link: 'javascript:void(0);',
                parentId: 48
            },
            {
                id: 51,
                label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
                link: 'javascript:void(0);',
                parentId: 48
            }
        ]
    },
    {
        id: 52,
        label: 'MENUITEMS.BLOG.TEXT',
        icon: 'bx-file',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
        },
        subItems: [
            {
                id: 53,
                label: 'MENUITEMS.BLOG.LIST.BLOGLIST',
                link: 'javascript:void(0);',
                parentId: 52
            },
            {
                id: 54,
                label: 'MENUITEMS.BLOG.LIST.BLOGGRID',
                link: 'javascript:void(0);',
                parentId: 52
            },
            {
                id: 55,
                label: 'MENUITEMS.BLOG.LIST.DETAIL',
                link: 'javascript:void(0);',
                parentId: 52
            },
        ]
    },
    {
        id: 56,
        label: 'MENUITEMS.PAGES.TEXT',
        isTitle: true
    },
    {
        id: 57,
        label: 'MENUITEMS.AUTHENTICATION.TEXT',
        icon: 'bx-user-circle',
        badge: {
            variant: 'success',
            text: 'MENUITEMS.AUTHENTICATION.BADGE',
        },
        subItems: [
            {
                id: 58,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 59,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 60,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 61,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 62,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 63,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 64,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 65,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 66,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 67,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 68,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 69,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION2',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 70,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                link: 'javascript:void(0);',
                parentId: 57
            },
            {
                id: 71,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION2',
                link: 'javascript:void(0);',
                parentId: 57
            }
        ]
    },
    {
        id: 72,
        label: 'MENUITEMS.UTILITY.TEXT',
        icon: 'bx-file',
        subItems: [
            {
                id: 73,
                label: 'MENUITEMS.UTILITY.LIST.STARTER',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 74,
                label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 74,
                label: 'Coming Soon',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 75,
                label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 76,
                label: 'MENUITEMS.UTILITY.LIST.FAQS',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 77,
                label: 'MENUITEMS.UTILITY.LIST.PRICING',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 78,
                label: 'MENUITEMS.UTILITY.LIST.ERROR404',
                link: 'javascript:void(0);',
                parentId: 72
            },
            {
                id: 79,
                label: 'MENUITEMS.UTILITY.LIST.ERROR500',
                link: 'javascript:void(0);',
                parentId: 72
            },
        ]
    },
    {
        id: 80,
        label: 'MENUITEMS.COMPONENTS.TEXT',
        isTitle: true
    },
    {
        id: 81,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx-tone',
        subItems: [
            {
                id: 82,
                label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 83,
                label: 'MENUITEMS.UIELEMENTS.LIST.BUTTONS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 84,
                label: 'MENUITEMS.UIELEMENTS.LIST.CARDS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 85,
                label: 'MENUITEMS.UIELEMENTS.LIST.CAROUSEL',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 86,
                label: 'MENUITEMS.UIELEMENTS.LIST.DROPDOWNS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 87,
                label: 'MENUITEMS.UIELEMENTS.LIST.GRID',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 88,
                label: 'MENUITEMS.UIELEMENTS.LIST.IMAGES',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 89,
                label: 'MENUITEMS.UIELEMENTS.LIST.MODALS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 90,
                label: 'MENUITEMS.UIELEMENTS.LIST.RANGESLIDER',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 91,
                label: 'MENUITEMS.UIELEMENTS.LIST.PROGRESSBAR',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 92,
                label: 'MENUITEMS.UIELEMENTS.LIST.SWEETALERT',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 93,
                label: 'MENUITEMS.UIELEMENTS.LIST.TABS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 94,
                label: 'MENUITEMS.UIELEMENTS.LIST.TYPOGRAPHY',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 95,
                label: 'MENUITEMS.UIELEMENTS.LIST.VIDEO',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 96,
                label: 'MENUITEMS.UIELEMENTS.LIST.GENERAL',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 97,
                label: 'MENUITEMS.UIELEMENTS.LIST.COLORS',
                link: 'javascript:void(0);',
                parentId: 81
            },
            {
                id: 98,
                label: 'MENUITEMS.UIELEMENTS.LIST.CROPPER',
                link: 'javascript:void(0);',
                parentId: 81
            },
        ]
    },
    {
        id: 99,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'bxs-eraser',
        badge: {
            variant: 'danger',
            text: 'MENUITEMS.FORMS.BADGE',
        },
        subItems: [
            {
                id: 100,
                label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 101,
                label: 'MENUITEMS.FORMS.LIST.LAYOUTS',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 102,
                label: 'MENUITEMS.FORMS.LIST.VALIDATION',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 103,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 104,
                label: 'MENUITEMS.FORMS.LIST.EDITOR',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 105,
                label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 106,
                label: 'MENUITEMS.FORMS.LIST.REPEATER',
                link: 'javascript:void(0);',
                parentId: 99
            },
            {
                id: 107,
                label: 'MENUITEMS.FORMS.LIST.WIZARD',
                link: '/form/wizard',
                parentId: 99
            },
            {
                id: 108,
                label: 'MENUITEMS.FORMS.LIST.MASK',
                link: '/form/mask',
                parentId: 99
            }
        ]
    },
    {
        id: 109,
        icon: 'bx-list-ul',
        label: 'MENUITEMS.TABLES.TEXT',
        subItems: [
            {
                id: 110,
                label: 'MENUITEMS.TABLES.LIST.BASIC',
                link: 'javascript:void(0);',
                parentId: 109
            },
            {
                id: 111,
                label: 'MENUITEMS.TABLES.LIST.ADVANCED',
                link: 'javascript:void(0);',
                parentId: 109
            }
        ]
    },
    {
        id: 112,
        icon: 'bxs-bar-chart-alt-2',
        label: 'MENUITEMS.CHARTS.TEXT',
        subItems: [
            {
                id: 113,
                label: 'MENUITEMS.CHARTS.LIST.APEX',
                link: 'javascript:void(0);',
                parentId: 112
            },
            {
                id: 114,
                label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
                link: 'javascript:void(0);',
                parentId: 112
            },
            {
                id: 115,
                label: 'MENUITEMS.CHARTS.LIST.CHARTIST',
                link: 'javascript:void(0);',
                parentId: 112
            },
            {
                id: 116,
                label: 'MENUITEMS.CHARTS.LIST.ECHART',
                link: 'javascript:void(0);',
                parentId: 112
            }
        ]
    },
    {
        id: 117,
        label: 'MENUITEMS.ICONS.TEXT',
        icon: 'bx-aperture',
        subItems: [
            {
                id: 118,
                label: 'MENUITEMS.ICONS.LIST.BOXICONS',
                link: 'javascript:void(0);',
                parentId: 117
            },
            {
                id: 119,
                label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
                link: 'javascript:void(0);',
                parentId: 117
            },
            {
                id: 120,
                label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
                link: 'javascript:void(0);',
                parentId: 117
            },
            {
                id: 121,
                label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
                link: 'javascript:void(0);',
                parentId: 117
            },
        ]
    },
    {
        id: 122,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'bx-map',
        subItems: [
            {
                id: 123,
                label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
                link: 'javascript:void(0);',
                parentId: 122
            }
        ]
    },
    {
        id: 124,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'bx-share-alt',
        subItems: [
            {
                id: 125,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                link: 'javascript: void(0);',
                parentId: 124
            },
            {
                id: 126,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 124,
                subItems: [
                    {
                        id: 127,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        link: 'javascript: void(0);',
                        parentId: 126,
                    },
                    {
                        id: 128,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        link: 'javascript: void(0);',
                        parentId: 126,
                    }
                ]
            },
        ]
    }
];

