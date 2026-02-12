/* DO NOT MODIFY IT MANUALLY */
import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './importMap'

import './custom.scss'

type Args = {
    children: React.ReactNode
}

const serverFunction = async (args: Args) => {
    'use server'
    return handleServerFunctions({
        ...args,
        config,
        importMap,
    })
}

const Layout = ({ children }: Args) => (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
    </RootLayout>
)

export default Layout
