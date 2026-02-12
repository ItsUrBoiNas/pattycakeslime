import { supabase } from '@/lib/supabase';
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

        // 1. Save to Supabase (Bypassing Payload to avoid hang)
        console.log("Saving order to Supabase...");
        const { data: order, error: supabaseError } = await supabase
            .from('orders')
            .insert({
                customer_name: customerName,
                customer_cashtag: customerCashtag,
                shipping_address: shippingAddress,
                city,
                state,
                zip,
                phone_number: phoneNumber,
                order_items: orderItems, // JSONB
                total_price: totalPrice,
                status: 'Pending Payment'
            })
            .select()
            .single();

        if (supabaseError) {
            console.error('Supabase error:', supabaseError);
            return NextResponse.json(
                { error: `Database Error: ${supabaseError.message}` },
                { status: 500 }
            );
        }

        console.log("Order created in Supabase:", order.id);

        // 2. Trigger Notifications (Non-blocking)
        (async () => {
            try {
                // Email Notification
                const nodemailer = await import('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: Number(process.env.EMAIL_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: '"PattiCakeSlime System" <no-reply@pattycakeslime.com>',
                    to: process.env.CLIENT_EMAIL || 'nasirhenken09@gmail.com',
                    subject: `New Order from ${customerName} - $${totalPrice}`,
                    text: `New Order Received!\n\nCustomer: ${customerName}\nPhone: ${phoneNumber}\nTotal: $${totalPrice}\n\nItems:\n${orderItems.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n')}\n\nShipping Address:\n${shippingAddress}, ${city}, ${state} ${zip}`,
                };

                await transporter.sendMail(mailOptions);
                console.log('Order notification email sent.');
            } catch (err) {
                console.error('Email notification failed:', err);
            }

            try {
                // SMS Notification
                const twilio = (await import('twilio')).default;
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                if (accountSid && authToken) {
                    const client = twilio(accountSid, authToken);
                    await client.messages.create({
                        body: `💰 New Order! ${customerName} just spent $${totalPrice} on PattiCakeSlime. They match payment from: ${customerCashtag}. Check Cash App!`,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: '+17063467555',
                    });
                    console.log('Order notification SMS sent.');
                }
            } catch (err) {
                console.error('SMS notification failed:', err);
            }
        })();

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
            orderId: order.id
        });

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: `Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
