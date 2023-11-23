import { FC } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { router } from '@inertiajs/react';

export interface LeaveRequestTableRowModel {
    id: number;
    employee: string;
    reason: string;
    type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    actions: {
        edit: string;
        delete: string;
    };
    highlight: boolean;
}

const LeaveRequestTableRow: FC<LeaveRequestTableRowModel> = (row) => {
    return (
        <TableRow selected={row.highlight} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell>{row.employee}</TableCell>
            <TableCell>{row.reason}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.start_date}</TableCell>
            <TableCell>{row.end_date}</TableCell>
            <TableCell>{row.total_days}</TableCell>
            <TableCell>
                <IconButton onClick={e => router.get(row.actions.edit)}><EditRounded /></IconButton>
                {/* <IconButton onClick={e => router.get(row.actions.delete)}><DeleteRounded /></IconButton> */}
            </TableCell>
        </TableRow>
    );
}

export default LeaveRequestTableRow;