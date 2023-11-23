<?php

namespace App\LeaveManager;

enum LeaveTypes : string 
{
    case PERSONAL = "Personal";
    case SICK = "Sick";
    case VACATION = "Vacation";
    case BEREAVEMENT = "Bereavement";
}