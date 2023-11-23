<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdateLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\LeaveManager\Employees;
use App\LeaveManager\LeaveTypes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $messages = $request->session()->get('messages') ?? [];
        $sort = $request->query('sort') ?? 'start_date';
        $order = $request->query('order') ?? 'desc';
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $employee = $request->query('employee');
        $q = $request->query('q');

        $builder = LeaveRequest::orderBy($sort, $order);

        if ( ! empty($q) )
        {
            $builder->where('reason', 'like', "$q%");
        }

        if ( ! empty($start_date) && ! empty($end_date) )
        {
            $builder->where( function ($query) use ($start_date, $end_date){
                $query->where('start_date', '<=', $end_date)
                    ->where('end_date', '>=', $start_date);
            });
        }

        if ( ! empty($employee) )
        {
            $builder->where('employee', '=', $employee);
        }

        $paginated = $builder->paginate(10)->withQueryString();
        [$inserted_id] = ! empty($ids = array_column($messages, 'id')) ? $ids : [null];

        return Inertia::render('LeaveManager/Index', [
            'messages' => $messages,
            'queryParams' => [
                'start_date' => $start_date,
                'end_date' => $end_date,
                'employee' => $employee,
                'sort' => $sort,
                'order' => $order,
                'q' => $q,
            ],
            'employees' => Employees::all(),
            'columns' => [
                'employee' => 'Employee',
                'reason' => 'Reason',
                'type' => 'Leave Type',
                'start_date' => 'Start Date',
                'end_date' => 'End Date',
                'total_days' => 'Total Days',
                'actions' => 'Actions',
            ],
            'rows' => array_map( fn ($row) => [
                ...$row->getAttributes(),
                "actions" => [
                    'edit' => route('leave.edit', $row->id),
                    // 'delete' => route('leave.destroy', $row->id),
                ],
                "highlight" => $row->id == $inserted_id
            ], $paginated->items() ),
            'pagination' => $paginated->linkCollection()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('LeaveManager/Create', [
            'action' => 'Create',
            'types' => array_reduce( LeaveTypes::cases(), 
                fn ($acc, $type) => [
                    ...$acc,
                    $type->name => $type->value,
                ], []
            ),
            'employees' => Employees::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateLeaveRequestRequest $request)
    {
        // Retrieve the validated input data...
        $validated = $request->validated();
    
        $inserted = LeaveRequest::create($validated);

        if ( $inserted )
        {
            $request->session()->flash('messages', [[
                'type' => 'success',
                'text' => "Stored successfully!",
                'id' => $inserted->id,
            ]]);
        }

        return to_route('leave.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leave)
    {
        return $this->edit($leave);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveRequest $leave)
    {
        return Inertia::render('LeaveManager/Create', [
            'action' => 'Edit',
            'leaveRequest' => $leave,
            'types' => array_reduce( LeaveTypes::cases(), 
                fn ($acc, $type) => [
                    ...$acc,
                    $type->name => $type->value,
                ], []
            ),
            'employees' => Employees::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateLeaveRequestRequest $request, LeaveRequest $leave)
    {
        // Retrieve the validated input data...
        $validated = $request->validated();
    
        $inserted = LeaveRequest::where('id', '=', $leave->id)->update($validated);

        if ( $inserted )
        {
            $request->session()->flash('messages', [[
                'type' => 'success',
                'text' => "Updated successfully!",
            ]]);
        }

        return to_route('leave.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leave)
    {
        //
    }
}
