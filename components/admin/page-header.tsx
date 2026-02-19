interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

import {
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>
                        {description}
                    </CardDescription>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
