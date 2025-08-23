// --------------------------------------------importing all the icons for the sidebar------------------------------

import dashboard from '../assets/icons/DashboardIcon.svg' //use this as products symnbol also
import dealers from '../assets/icons/DealersIcon.svg'
import payments from '../assets/icons/PaymentsIcon.svg'

import React from 'react'

export const AdminNavitems=[
    {label: 'Dashboard' ,icon : dashboard , path:'/admin/dashboard'},
    {label: 'Inventory' ,icon : payments , path:'/admin/inventory'},    
    {label: 'Products' ,icon : dashboard , path:'/admin/products'},    
    // Catalogue removed - using PDF catalogue instead    
    {label: 'Dealers' ,icon : dealers , path:'/admin/dealers'},    
    {label: 'Orders' ,icon : payments , path:'/admin/orders'},    
    {label: 'Payments' ,icon :payments , path:'/admin/payments'},
    {label: 'Billing' ,icon : dashboard , path:'/admin/billing'}    
]
