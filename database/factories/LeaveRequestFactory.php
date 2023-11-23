<?php

namespace Database\Factories;

use App\LeaveManager\Employees;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use App\LeaveManager\LeaveTypes;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $format = 'Y-m-d';
        $start_date = \DateTimeImmutable::createFromMutable( fake()->dateTimeBetween('-30 years', '-1 day') );
        $modifier = fake()->numberBetween(1, 28);
        $end_date = $start_date->modify( sprintf("+%d %s", $modifier, $modifier == 1 ? 'day' : 'days') );
        
        return [
            'employee' => Arr::random(Employees::all()),
            'reason' => fake()->realText(50),
            'type' => Arr::random(array_map(fn($type) => $type->name, LeaveTypes::cases())),
            'start_date' => $start_date->format($format),
            'end_date' => $end_date->format($format),
            'start_time' => null,
            'end_time' => null,
            'total_days' => $modifier,
        ];
    }
}
