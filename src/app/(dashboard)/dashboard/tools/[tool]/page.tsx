import React from "react";
import { tools, ToolType } from "@/config/tool";
import { notFound } from "next/navigation";
import PageContainer from "@/components/dashboard/page-container";
import PageHeader from "@/components/dashboard/page-header";

const ToolPage = async ({ params }: { params: Promise<{ tool: string }> }) => {
  const { tool } = await params;
  const toolType = tool as ToolType;
  const toolConfig = tools[toolType];

  if (!toolConfig) {
    notFound();
  }

  const ToolComponent = toolConfig.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <PageContainer>
        <PageHeader
          title={toolConfig.name}
          description={toolConfig.description}
        />
        <div className="w-full">
          <ToolComponent />
        </div>
      </PageContainer>
    </div>
  );
};

export default ToolPage;
