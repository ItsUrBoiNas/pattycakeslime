const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    console.error('❌ ERROR: Please add your Supabase credentials to .env.local first!');
    console.log('\n📝 Instructions:');
    console.log('1. Go to https://supabase.com/dashboard/project/xwiyfskjxnrjrviqmnge');
    console.log('2. Click Settings (gear icon) → API');
    console.log('3. Copy the Project URL and anon/public key');
    console.log('4. Paste them into .env.local\n');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Setting up PattiCakeSlime database...\n');

    // Check if tables exist by trying to query them
    const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1);

    if (existingSettings === null) {
        console.log('⚠️  Tables don\'t exist yet. Please run the SQL script first:');
        console.log('1. Open Supabase Dashboard → SQL Editor');
        console.log('2. Copy contents of SUPABASE_SETUP.sql');
        console.log('3. Paste and click Run\n');
        process.exit(1);
    }

    // Insert initial live status
    console.log('📝 Setting up live status...');
    const { error: statusError } = await supabase
        .from('site_settings')
        .upsert({
            key: 'live_status',
            value: 'Grandma Patti is stirring up something special! Check back soon! ✨'
        }, { onConflict: 'key' });

    if (statusError) {
        console.log('ℹ️  Live status already exists');
    } else {
        console.log('✅ Live status created');
    }

    // Insert initial products
    console.log('\n🧪 Adding initial slimes...');

    const initialProducts = [
        {
            name: 'Custom Slime',
            price: 7.00,
            description: 'Choose your own mix',
            tag: 'YOUR MIX',
            is_pre_made: false
        },
        {
            name: 'Blue Rocks',
            price: 5.00,
            description: 'Small cyan container',
            tag: 'CYAN',
            is_pre_made: true
        },
        {
            name: 'Cookies n Cream',
            price: 5.00,
            description: 'Dark blue/black container',
            tag: 'DARK',
            is_pre_made: true
        },
        {
            name: 'Peaches n Cream',
            price: 5.00,
            description: 'Orange container',
            tag: 'ORANGE',
            is_pre_made: true
        },
        {
            name: 'Key Lime',
            price: 5.00,
            description: 'Green container',
            tag: 'GREEN',
            is_pre_made: true
        },
        {
            name: 'Pink Jelly Cubes',
            price: 5.00,
            description: 'Pink container',
            tag: 'PINK',
            is_pre_made: true
        },
        {
            name: 'Purple Berries',
            price: 3.00,
            description: 'Small purple container',
            tag: 'BERRY',
            is_pre_made: true
        },
        {
            name: 'Butter Cream',
            price: 3.00,
            description: 'Small yellow container',
            tag: 'YELLOW',
            is_pre_made: true
        }
    ];

    for (const product of initialProducts) {
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('name', product.name)
            .single();

        if (existing) {
            console.log(`  ⏭️  ${product.name} already exists`);
        } else {
            const { error } = await supabase
                .from('products')
                .insert([product]);

            if (error) {
                console.log(`  ❌ Error adding ${product.name}:`, error.message);
            } else {
                console.log(`  ✅ Added ${product.name}`);
            }
        }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Visit http://localhost:3000/patty to manage products');
    console.log('3. Visit http://localhost:3000 to see the live site\n');
}

setupDatabase().catch(console.error);
