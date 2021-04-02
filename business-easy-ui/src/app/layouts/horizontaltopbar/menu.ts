import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 2,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/dashboard',
                parentId: 1
            },
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
                link: 'javascript:void(0);',
                parentId: 1
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
                link: 'javascript:void(0);',
                parentId: 1
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
                link: 'javascript:void(0);',
                parentId: 1
            },
        ]
    },
    {
        id: 6,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx-tone',
        isUiElement: true,
        subItems: [
            {
                id: 7,
                label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 8,
                label: 'MENUITEMS.UIELEMENTS.LIST.BUTTONS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 9,
                label: 'MENUITEMS.UIELEMENTS.LIST.CARDS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 10,
                label: 'MENUITEMS.UIELEMENTS.LIST.CAROUSEL',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 11,
                label: 'MENUITEMS.UIELEMENTS.LIST.DROPDOWNS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 12,
                label: 'MENUITEMS.UIELEMENTS.LIST.GRID',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 13,
                label: 'MENUITEMS.UIELEMENTS.LIST.IMAGES',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 14,
                label: 'MENUITEMS.UIELEMENTS.LIST.MODALS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 15,
                label: 'MENUITEMS.UIELEMENTS.LIST.RANGESLIDER',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 16,
                label: 'MENUITEMS.UIELEMENTS.LIST.PROGRESSBAR',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 17,
                label: 'MENUITEMS.UIELEMENTS.LIST.SWEETALERT',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 18,
                label: 'MENUITEMS.UIELEMENTS.LIST.TABS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 19,
                label: 'MENUITEMS.UIELEMENTS.LIST.TYPOGRAPHY',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 20,
                label: 'MENUITEMS.UIELEMENTS.LIST.VIDEO',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 21,
                label: 'MENUITEMS.UIELEMENTS.LIST.GENERAL',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 22,
                label: 'MENUITEMS.UIELEMENTS.LIST.COLORS',
                link: 'javascript:void(0);',
                parentId: 6
            },
            {
                id: 23,
                label: 'MENUITEMS.UIELEMENTS.LIST.CROPPER',
                link: 'javascript:void(0);',
                parentId: 6
            },
        ]
    },
    {
        id: 24,
        label: 'MENUITEMS.APPS.TEXT',
        icon: 'bx-customize',
        subItems: [
            {
                id: 25,
                label: 'MENUITEMS.CALENDAR.TEXT',
                link: 'javascript:void(0);',
                parentId: 24
            },
            {
                id: 26,
                label: 'MENUITEMS.CHAT.TEXT',
                link: 'javascript:void(0);',
                parentId: 24
            },
            {
                id: 27,
                label: 'MENUITEMS.FILEMANAGER.TEXT',
                link: 'javascript:void(0);',
                parentId: 24
            },
            {
                id: 28,
                label: 'MENUITEMS.EMAIL.TEXT',
                subItems: [
                    {
                        id: 29,
                        label: 'MENUITEMS.EMAIL.LIST.INBOX',
                        link: 'javascript:void(0);',
                        parentId: 28
                    },
                    {
                        id: 30,
                        label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
                        link: 'javascript:void(0);',
                        parentId: 28
                    },
                    {
                        id: 31,
                        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.TEXT',
                        parentId: 28,
                        subItems: [
                            {
                                id:32 ,
                                label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BASIC',
                                link: 'javascript:void(0);',
                                parentId:31 
                            },
                            {
                                id:33 ,
                                label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.ALERT',
                                link: 'javascript:void(0);',
                                parentId:31 
                            },
                            {
                                id:34 ,
                                label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BILLING',
                                link: 'javascript:void(0);',
                                parentId:31 
                            }
                        ]
                    }
                ]
            },
            {
                id: 35,
                label: 'MENUITEMS.ECOMMERCE.TEXT',
                subItems: [
                    {
                        id: 36,
                        label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 37,
                        label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTDETAIL',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 38,
                        label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 39,
                        label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 40,
                        label: 'MENUITEMS.ECOMMERCE.LIST.CART',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 41,
                        label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 42,
                        label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                    {
                        id: 43,
                        label: 'MENUITEMS.ECOMMERCE.LIST.ADDPRODUCT',
                        link: 'javascript:void(0);',
                        parentId: 35
                    },
                ]
            },
            {
                id: 44,
                label: 'MENUITEMS.CRYPTO.TEXT',
                icon: 'bx-bitcoin',
                subItems: [
                    {
                        id: 45,
                        label: 'MENUITEMS.CRYPTO.LIST.WALLET',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 46,
                        label: 'MENUITEMS.CRYPTO.LIST.BUY/SELL',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 47,
                        label: 'MENUITEMS.CRYPTO.LIST.EXCHANGE',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 48,
                        label: 'MENUITEMS.CRYPTO.LIST.LENDING',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 49,
                        label: 'MENUITEMS.CRYPTO.LIST.ORDERS',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 50,
                        label: 'MENUITEMS.CRYPTO.LIST.KYCAPPLICATION',
                        link: 'javascript:void(0);',
                        parentId: 44
                    },
                    {
                        id: 51,
                        label: 'MENUITEMS.CRYPTO.LIST.ICOLANDING',
                        link: 'javascript:void(0);',
                        parentId: 44
                    }
                ]
            },
            {
                id: 52,
                label: 'MENUITEMS.PROJECTS.TEXT',
                subItems: [
                    {
                        id: 53,
                        label: 'MENUITEMS.PROJECTS.LIST.GRID',
                        link: 'javascript:void(0);',
                        parentId: 52
                    },
                    {
                        id: 54,
                        label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
                        link: 'javascript:void(0);',
                        parentId: 52
                    },
                    {
                        id: 55,
                        label: 'MENUITEMS.PROJECTS.LIST.OVERVIEW',
                        link: 'javascript:void(0);',
                        parentId: 52
                    },
                    {
                        id: 56,
                        label: 'MENUITEMS.PROJECTS.LIST.CREATE',
                        link: 'javascript:void(0);',
                        parentId: 52
                    }
                ]
            },
            {
                id: 57,
                label: 'MENUITEMS.TASKS.TEXT',
                subItems: [
                    {
                        id: 58,
                        label: 'MENUITEMS.TASKS.LIST.TASKLIST',
                        link: 'javascript:void(0);',
                        parentId: 57
                    },
                    {
                        id: 59,
                        label: 'MENUITEMS.TASKS.LIST.KANBAN',
                        link: 'javascript:void(0);',
                        parentId: 57
                    },
                    {
                        id: 60,
                        label: 'MENUITEMS.TASKS.LIST.CREATETASK',
                        link: 'javascript:void(0);',
                        parentId: 57
                    }
                ]
            },
            {
                id: 61,
                label: 'MENUITEMS.CONTACTS.TEXT',
                icon: 'bxs-user-detail',
                subItems: [
                    {
                        id: 62,
                        label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
                        link: 'javascript:void(0);',
                        parentId: 61
                    },
                    {
                        id: 63,
                        label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
                        link: 'javascript:void(0);',
                        parentId: 61
                    },
                    {
                        id: 64,
                        label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
                        link: 'javascript:void(0);',
                        parentId: 61
                    }
                ]
            },
            {
                id: 65,
                label: 'MENUITEMS.BLOG.TEXT',
                subItems: [
                    {
                        id: 66,
                        label: 'MENUITEMS.BLOG.LIST.BLOGLIST',
                        link: 'javascript:void(0);',
                        parentId: 65
                    },
                    {
                        id: 67,
                        label: 'MENUITEMS.BLOG.LIST.BLOGGRID',
                        link: 'javascript:void(0);',
                        parentId: 65
                    },
                    {
                        id: 68,
                        label: 'MENUITEMS.BLOG.LIST.DETAIL',
                        link: 'javascript:void(0);',
                        parentId: 65
                    },
                ]
            },
        ]
    },
    {
        id: 69,
        icon: 'bx-collection',
        label: 'MENUITEMS.COMPONENTS.TEXT',
        subItems: [
            {
                id: 70,
                label: 'MENUITEMS.FORMS.TEXT',
                subItems: [
                    {
                        id: 71,
                        label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 72,
                        label: 'MENUITEMS.FORMS.LIST.VALIDATION',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 73,
                        label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 74,
                        label: 'MENUITEMS.FORMS.LIST.EDITOR',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 75,
                        label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 76,
                        label: 'MENUITEMS.FORMS.LIST.REPEATER',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 77,
                        label: 'MENUITEMS.FORMS.LIST.WIZARD',
                        link: 'javascript:void(0);',
                        parentId: 70
                    },
                    {
                        id: 78,
                        label: 'MENUITEMS.FORMS.LIST.MASK',
                        link: 'javascript:void(0);',
                        parentId: 70
                    }
                ]
            },
            {
                id: 79,
                label: 'MENUITEMS.TABLES.TEXT',
                subItems: [
                    {
                        id: 80,
                        label: 'MENUITEMS.TABLES.LIST.BASIC',
                        link: 'javascript:void(0);',
                        parentId: 79
                    },
                    {
                        id: 81,
                        label: 'MENUITEMS.TABLES.LIST.ADVANCED',
                        link: 'javascript:void(0);',
                        parentId: 79
                    }
                ]
            },
            {
                id: 82,
                label: 'MENUITEMS.CHARTS.TEXT',
                subItems: [
                    {
                        id: 83,
                        label: 'MENUITEMS.CHARTS.LIST.APEX',
                        link: 'javascript:void(0);',
                        parentId: 82
                    },
                    {
                        id: 84,
                        label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
                        link: 'javascript:void(0);',
                        parentId: 82
                    },
                    {
                        id: 85,
                        label: 'MENUITEMS.CHARTS.LIST.CHARTIST',
                        link: 'javascript:void(0);',
                        parentId: 82
                    },
                    {
                        id: 86,
                        label: 'MENUITEMS.CHARTS.LIST.ECHART',
                        link: 'javascript:void(0);',
                        parentId: 82
                    }
                ]
            },
            {
                id: 87,
                label: 'MENUITEMS.ICONS.TEXT',
                subItems: [
                    {
                        id: 88,
                        label: 'MENUITEMS.ICONS.LIST.BOXICONS',
                        link: 'javascript:void(0);',
                        parentId: 87
                    },
                    {
                        id: 89,
                        label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
                        link: 'javascript:void(0);',
                        parentId: 87
                    },
                    {
                        id: 90,
                        label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
                        link: 'javascript:void(0);',
                        parentId: 87
                    },
                    {
                        id: 91,
                        label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
                        link: 'javascript:void(0);',
                        parentId: 87
                    },
                ]
            },
            {
                id: 92,
                label: 'MENUITEMS.MAPS.TEXT',
                subItems: [
                    {
                        id: 93,
                        label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
                        link: 'javascript:void(0);',
                        parentId: 92
                    }
                ]
            }
        ]
    },
    {
        id: 94,
        label: 'HEADER.EXTRA_PAGES.TITLE',
        icon: 'bx-file',
        subItems: [
            {
                id: 95,
                label: 'MENUITEMS.INVOICES.TEXT',
                subItems: [
                    {
                        id: 96,
                        label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
                        link: 'javascript:void(0);',
                        parentId: 95
                    },
                    {
                        id: 97,
                        label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAIL',
                        link: 'javascript:void(0);',
                        parentId: 95
                    },
                ]
            },
            {
                id: 98,
                label: 'MENUITEMS.AUTHENTICATION.TEXT',
                subItems: [
                    {
                        id: 99,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 100,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 101,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 102,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 103,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 104,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 105,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 106,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 107,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 108,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 109,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 110,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 111,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                        link: 'javascript:void(0);',
                        parentId: 98
                    },
                    {
                        id: 112,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION2',
                        link: 'javascript:void(0);',
                        parentId: 98
                    }
                ]
            },
            {
                id: 113,
                label: 'MENUITEMS.UTILITY.TEXT',
                icon: 'bx-file',
                subItems: [
                    {
                        id: 114,
                        label: 'MENUITEMS.UTILITY.LIST.STARTER',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 115,
                        label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 116,
                        label: 'Coming Soon',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 116,
                        label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 117,
                        label: 'MENUITEMS.UTILITY.LIST.FAQS',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 118,
                        label: 'MENUITEMS.UTILITY.LIST.PRICING',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 119,
                        label: 'MENUITEMS.UTILITY.LIST.ERROR404',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                    {
                        id: 120,
                        label: 'MENUITEMS.UTILITY.LIST.ERROR500',
                        link: 'javascript:void(0);',
                        parentId: 113
                    },
                ]
            }
        ]
    }
];

