<?php

namespace App\Http\Requests;

use App\LeaveManager\Employees;
use App\LeaveManager\LeaveTypes;
use App\LeaveManager\ValidateDateRange;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUpdateLeaveRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee' => [
                'required', 
                Rule::in( Employees::all() )
            ],
            'type' => [
                'required', 
                Rule::in( array_map(fn($t) => $t->name, LeaveTypes::cases()) )
            ],
            'start_date' => [
                'required', 
                'date', 
                'after_or_equal:today'
            ],
            'end_date' => [
                'required', 
                'date', 
                'after_or_equal:start_date'
            ],
            'start_time' => [
                Rule::excludeIf( fn () => $this->input('start_date') !== $this->input('end_date') ), 
                'required',
                'date'
            ],
            'end_time' => [
                Rule::excludeIf( fn () => $this->input('start_date') !== $this->input('end_date') ), 
                'required', 
                'date', 
                'after:start_time'
            ],
            'total_days' => [
                'required', 
                'numeric', 
                'min:0', 
                Rule::notIn([0])
            ],
            'reason' => [
                'required',
                'max:50',
            ],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array
    {
        return [
            new ValidateDateRange($this->input('start_date'), $this->input('end_date'), $this->leave?->id)
        ];
    }
}
