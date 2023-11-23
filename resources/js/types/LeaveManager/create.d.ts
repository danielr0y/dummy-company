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
    action: "Create"|"Edit";
    leaveRequest: Record<string, string> | undefined;
    types: Record<string, string>;
    employees: Array<string>;
};
