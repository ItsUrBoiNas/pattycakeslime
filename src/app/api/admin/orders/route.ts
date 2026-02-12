import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase snake_case to what the frontend might expect (if necessary)
        // OrderManager.tsx currently expects 'id', 'customerName', etc.
        const mappedOrders = orders.map(order => ({
            id: order.id,
            customerName: order.customer_name,
            customerCashtag: order.customer_cashtag,
            shippingAddress: order.shipping_address,
            city: order.city,
            state: order.state,
            zip: order.zip,
            phoneNumber: order.phone_number,
            orderItems: order.order_items,
            totalPrice: order.total_price,
            status: order.status,
            createdAt: order.created_at
        }));

        return NextResponse.json({ docs: mappedOrders })
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json()

        const { data: order, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(order)
    } catch (error) {
        console.error('Failed to update order:', error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}
