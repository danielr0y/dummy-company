import { LeaveRequestTableRowModel } from "@/Components/LeaveRequestTableRow";
import { AlertColor } from "@mui/material";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    messages: Array<{
        type: AlertColor;
        text: string;
        link: string|null;
    }>;
    queryParams: Record<string, string>;
    employees: Array<string>;
    columns: Record<string, string>;
    rows: Array<LeaveRequestTableRowModel>;
    pagination: Array<Record<string, string>>;
};
