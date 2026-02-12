
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerCashtag,
            shippingAddress,
            city,
            state,
            zip,
            phoneNumber,
            orderItems,
            totalPrice
        } = body;

        // Validation
        if (!customerName || !customerCashtag || !phoneNumber) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // --- NOTIFICATION LOGIC ---
        // Since we don't have SMS gateway credentials, we log to the console for verification.
        const itemsList = orderItems.map((item: any) => `${item.quantity}x ${item.name}`).join(', ');
        const notificationMessage = `
========================================
🔔 NEW ORDER NOTIFICATION
TO: (706) 346-7555
FROM: PattiCakeSlime System

New Order Received!
👤 Customer: ${customerName}
💰 Cashtag: ${customerCashtag}
📱 Phone: ${phoneNumber}
📦 Items: ${itemsList}
💵 Total: $${totalPrice.toFixed(2)}
========================================
        `;

        console.log("SMS SENT TO (706) 346-7555:", notificationMessage);
        // --------------------------

        // In a real app, we would save to database here.
        // For now, we simulate success.

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
            orderId: Math.floor(Math.random() * 10000) + 1000
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
