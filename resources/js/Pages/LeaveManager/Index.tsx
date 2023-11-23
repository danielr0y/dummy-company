import LeaveRequestTableRow from '@/Components/LeaveRequestTableRow';
import PaginationComponent from '@/Components/PaginationComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types/LeaveManager';
import { Head, Link, router } from '@inertiajs/react';
import { AddRounded } from '@mui/icons-material';
import { Alert, Autocomplete, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, MouseEvent, SyntheticEvent, useState } from 'react';

export default function Index({ auth, columns, rows, queryParams, employees, messages, pagination }: PageProps) {
    const [q, setQ] = useState(queryParams.q);
    const [startDate, setStartDate] = useState<Dayjs|null>(dayjsIfDefined(queryParams.start_date));
    const [endDate, setEndDate] = useState<Dayjs|null>(dayjsIfDefined(queryParams.end_date));

    function dayjsIfDefined(date: string|undefined): Dayjs|null{
        return ( date == undefined ) ? null : dayjs(date);
    }

    function handleAddButtonClick(){
        router.get(route('leave.create'));
    }

    function prepareQueryParams(){
        return {
            start_date: startDate?.format("YYYY-MM-DD"),
            end_date: endDate?.format("YYYY-MM-DD"),
            employee: queryParams.employee,
            sort: queryParams.sort,
            order: queryParams.order,
            q: queryParams.q,
        };
    }

    function handleStartDateChange(value: Dayjs|null){
        if ( endDate !== null ){
            value && router.get(route('leave.index'), {
                ...prepareQueryParams(),
                start_date: value.format("YYYY-MM-DD"),
            })
        }
        else{
            setStartDate(value);
        }
    }

    function handleEndDateChange(value: Dayjs|null){
        if ( startDate !== null ){
            value && router.get(route('leave.index'), {
                ...prepareQueryParams(),
                end_date: value.format("YYYY-MM-DD"),
            })
        }
        else{
            setEndDate(value);
        }
    }

    function handleSearchInput(e: ChangeEvent){
        const target = e.target as HTMLInputElement;

        setQ(target.value);

        router.get(route('leave.index'), {
            ...prepareQueryParams(),
            q: target.value,
        },{
            preserveState: true
        })
    }

    function handleEmployeeChange(e: SyntheticEvent){
        const target = e.target as HTMLElement;

        router.get(route('leave.index'), {
            ...prepareQueryParams(),
            employee: target.textContent,
        })
    }

    function handleSort(e: MouseEvent){
        const target = e.target as HTMLElement;
        const column = target.id;

        if ( [ 'reason', 'actions' ].includes(column) ){
            return;
        }

        router.get(route('leave.index'), {
            ...prepareQueryParams(),
            sort: column,
            order: queryParams.order == 'desc' ? 'asc' : 'desc',
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Leave Manager</h2>}
        >
            <Head title="Leave Manager" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="mb-4">
                            { messages.map( message => (
                                <Alert severity={message.type}>
                                    {message.link ? <Link href={message.link}>{message.text}</Link> : message.text}
                                </Alert>
                            ))}
                        </div>
                        <div className='flex justify-end mb-4'>
                            <TextField 
                                    sx={{ width: 300 }}
                                    placeholder='Christmas' 
                                    type="search" 
                                    label="Search" 
                                    value={q} 
                                    onChange={handleSearchInput}></TextField>
                        </div>
                        <div className='flex gap-4 justify-end mb-4'>
                            <FormControl className='me-auto'>
                                <Autocomplete
                                        sx={{ width: 300 }}
                                        options={employees}
                                        renderInput={(params) => <TextField {...params} label="Employee" />} 
                                        value={queryParams.employee}
                                        onChange={handleEmployeeChange} />
                            </FormControl>
                            <DatePicker 
                                    value={startDate} 
                                    onChange={handleStartDateChange} />
                            <DatePicker 
                                    value={endDate} 
                                    onChange={handleEndDateChange} />
                        </div>
                        <div className='flex justify-end mb-4'>
                            <Button sx={{ paddingY: 1.5, paddingX: 2.5 }} endIcon={<AddRounded />} variant="contained" onClick={handleAddButtonClick}>Add</Button>
                        </div>
                        <div className="mb-4">
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="Leave Requests">
                                    <TableHead>
                                        <TableRow>
                                            {Object.entries(columns).map(([key, value]) => (
                                                <TableCell onClick={handleSort} key={key} id={key}>{value}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => <LeaveRequestTableRow key={row.id} {...row} /> )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="flex justify-center gap-2 my-4">
                            <PaginationComponent links={pagination} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}