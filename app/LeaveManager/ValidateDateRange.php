<?php

namespace App\LeaveManager;

use App\Models\LeaveRequest;
use Illuminate\Validation\Validator;

class ValidateDateRange
{
    private bool $worth_checking;

    public function __construct(private string $start_date, private string $end_date, private int|null $id)
    {
        $this->worth_checking = ! (empty($start_date) || empty($end_date));
    }
    
    public function __invoke(Validator $validator)
    {
        if ( $this->worth_checking )
        {
            $builder = LeaveRequest::where('start_date', '<=', $this->end_date)->where('end_date', '>=', $this->start_date);

            if ( $this->id !== null )
            {
                $builder->where('id', '!=', $this->id);
            }

            $would_clash = $builder->exists();
    
            if ($would_clash) {
                $validator->errors()
                    ->add('start_date','This leave overlaps with an existing one.')
                    ->add('end_date','This leave overlaps with an existing one.');
            }
        }
    }
}