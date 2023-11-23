import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { router, usePage, Link, Head } from '@inertiajs/react'
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Autocomplete, Button, FormControl, FormHelperText, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import {CloseRounded, PublishRounded} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { PageProps } from '@/types/LeaveManager/create';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({auth, action, leaveRequest, types, employees}: PageProps) {
    const { errors } = usePage().props;
    const [startDate, setStartDate] = useState<Dayjs>(dayjs(leaveRequest?.start_date ?? new Date()));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs(leaveRequest?.end_date ?? new Date()));
    const [startTime, setStartTime] = useState<Dayjs>(dayjs(
        leaveRequest?.start_time ?? mergeDateAndTimeStrings(startDate.format("YYYY-MM-DD"), "08:00:00")
    ));
    const [endTime, setEndTime] = useState<Dayjs>(dayjs(
        leaveRequest?.end_time ?? mergeDateAndTimeStrings(startDate.format("YYYY-MM-DD"), "16:00:00")
    ));
    const [totalDays, setTotalDays] = useState(leaveRequest?.total_days ?? 1);
    const [isOneDay, setIsOneDay] = useState(startDate.isSame(endDate, 'day'));
    const [type, setType] = useState(leaveRequest?.type ?? "");
    const [employee, setEmployee] = useState(leaveRequest?.employee ?? "");
    const [reason, setReason] = useState(leaveRequest?.reason ?? "");

    function mergeDateAndTimeStrings(date: string|undefined, time: string|undefined): string|null{
        return ( date == undefined || time == undefined ) ? null : `${date} ${time}`;
    }

    function handleCancelButtonClick(){
        router.get(route('leave.index'));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            start_date: startDate.format("YYYY-MM-DD"), 
            end_date: endDate.format("YYYY-MM-DD"), 
            start_time: mergeDateAndTimeStrings(startDate.format("YYYY-MM-DD"), startTime.format("HH:mm")), 
            end_time: mergeDateAndTimeStrings(startDate.format("YYYY-MM-DD"), endTime.format("HH:mm")), 
            total_days : totalDays,
            employee,
            reason,
            type,
        };

        switch (action) {
            case 'Create':
                return router.post(route('leave.store'), payload);
            case 'Edit':
                return router.put(route('leave.update', leaveRequest?.id), payload);
        }
    }

    useEffect( () => {
        let days: number;
        // drop the times theyre messing with diff
        const start = dayjs(mergeDateAndTimeStrings(startDate.format("YYYY-MM-DD"), "00:00:00"));
        const end = dayjs(mergeDateAndTimeStrings(endDate.format("YYYY-MM-DD"), "00:00:00"));

        const dateDiff = end.diff(start, 'day') ?? 0;

        if ( dateDiff == 0 )
        {
            const timeDiff = endTime.diff(startTime, 'hour', true) ?? 0;
            days = Math.min(1/8 * timeDiff, 1);
        }
        else{
            days = dateDiff + 1;
        }

        // calculate without weekends
        setTotalDays( days.toFixed(2) );
    }, [startDate, endDate, startTime, endTime] );

    useEffect( () => {
        setIsOneDay(startDate.isSame(endDate, 'day'));
    }, [startDate, endDate] );

    return (
        <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Leave Manager</h2>} >
            <Head title="Leave Manager" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <FormControl>
                                    <Autocomplete
                                            disablePortal
                                            id="employee"
                                            options={['invalid user', ...employees]}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Employee" />} 
                                            value={employee}
                                            onChange={ (e) => setEmployee(e.currentTarget.textContent ?? "") } />
                                    <FormHelperText>{errors.employee}</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='mb-4'>
                                <FormControl>
                                    <InputLabel id="type-label">Leave Type</InputLabel>
                                    <Select id="type"
                                            labelId="type-label"
                                            value={type}
                                            label="Leave Type"
                                            onChange={ ({target}) => setType(target.value) } 
                                            sx={{ width: 300 }} >
                                        {Object.entries(types).map( ([value, label]) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ) )}
                                    </Select>
                                    <FormHelperText>{errors.type}</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='flex gap-4 mb-4'>
                                <DatePicker 
                                        value={startDate} 
                                        onChange={(value) => value && setStartDate(value)} 
                                        slotProps={{
                                            textField: {
                                                helperText: errors.start_date,
                                            },
                                        }} />
                                <DatePicker 
                                        value={endDate} 
                                        onChange={(value) => value && setEndDate(value)} 
                                        slotProps={{
                                            textField: {
                                                helperText: errors.end_date,
                                            },
                                        }} />
                            </div>
                            <div className='flex gap-4 mb-4'>
                                <TimePicker 
                                        value={startTime} 
                                        onChange={(value) => value && setStartTime(value)} 
                                        slotProps={{
                                            textField: {
                                                helperText: errors.start_time,
                                            },
                                        }}  
                                        disabled={ !isOneDay } />
                                <TimePicker 
                                        value={endTime} 
                                        onChange={(value) => value && setEndTime(value)} 
                                        slotProps={{
                                            textField: {
                                                helperText: errors.end_time,
                                            },
                                        }}  
                                        disabled={ !isOneDay } />
                                <span className='py-3.5'>{totalDays} {totalDays == 1 ? "day" : "days"} total </span>
                            </div>
                            <FormHelperText>{errors.total_days}</FormHelperText>
                            <div className='mb-6'>
                                <TextField
                                        id="reason"
                                        label="Reason"
                                        value={reason}
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        onChange={ ({target}) => setReason(target.value) } />
                                <FormHelperText>{errors.reason}</FormHelperText>
                            </div>
                            <div className='flex gap-4 justify-end'>
                                <Button  sx={{ paddingY: 1.5, paddingX: 2.5 }} variant='outlined' endIcon={<CloseRounded />} onClick={handleCancelButtonClick}>Cancel</Button>
                                <Button  sx={{ paddingY: 1.5, paddingX: 2.5 }} variant="contained" endIcon={<PublishRounded />} type="submit">{(action)} Leave</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}