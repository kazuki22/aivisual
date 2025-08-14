import React from 'react'
import { tools, ToolType } from '@/config/tool'
import { notFound } from 'next/navigation'
import PageContainer from '@/components/dashboard/page-container'
import PageHeader from '@/components/dashboard/page-header'

const ToolPage = async ({params}: {params: Promise<{tool: string}>}) => {
    const { tool } = await params;
    const toolType = tool as ToolType;
    const toolConfig = tools[toolType];

    if (!toolConfig) {
        notFound();
    }

    const ToolComponent = toolConfig.component;

    return (
        <PageContainer>
            <PageHeader title={toolConfig.name} description={toolConfig.description} />
            <div className="max-w-2xl">
                <ToolComponent />
            </div>
        </PageContainer>
    )
}

export default ToolPage