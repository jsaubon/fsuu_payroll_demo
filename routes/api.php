<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::post('login', 'PassportController@login');
Route::post('register', 'PassportController@register');

Route::middleware('auth:api')->group(function () {
    Route::get('user', 'PassportController@details');

    Route::apiResource('user','UserController');
    Route::apiResource('client','ClientController');
    Route::apiResource('employee','ClientEmployeeController');
    Route::apiResource('other_info','OtherInfoController');
    Route::apiResource('accounting_entry','ClientAccountingEntryController');
    Route::apiResource('employee_accounting','ClientEmployeeAccountingController');
    Route::apiResource('employee_deduction','ClientEmployeeDeductionController');
    Route::apiResource('payroll','ClientPayrollController');
    Route::apiResource('employee_payroll','ClientEmployeePayrollController');
    Route::apiResource('employee_assigned_post','ClientEmployeeAssignedPostController');

    Route::post('client/logo','ClientController@uploadLogo');
});

Route::get('testing', function() {
    function getCashbond($assigned_posts) {
        $first = $assigned_posts['date_start'];
        if($assigned_posts['date_end'] !== null) {
            $last = $assigned_posts['date_end'];
        } else {
            $last = date('Y-m-d');
        }

        $date1 = strtotime($first);
        $date2 = strtotime($last);

        // Formulate the Difference between two dates 
        $diff = abs($date2 - $date1);  
        
        
        // To get the year divide the resultant date into 
        // total seconds in a year (365*60*60*24) 
        $years = floor($diff / (365*60*60*24));  

        $months = (($diff - $years * 365*60*60*24) 
        / (30*60*60*24));  

        $total_months = ($years != 0 ?  ($years * 12) : 0) +$months; 

        $whole = floor($total_months);
        $fraction = ($total_months - $whole) * 100;
        if($fraction >= 50) {
            $total_months = $whole + 0.5;
        } else {
            $total_months = $whole;
        }

        $total_cashbond = $total_months * 100;
        return $total_cashbond;
    }

    $status = 'Resigned';
    $employees = \App\ClientEmployee::where('status',$status)
                                        ->with('client')
                                        ->with('client_employee_assigned_posts')
                                        ->with('client_employee_assigned_posts.client')
                                        ->orderBy('name','asc')->get()->sortBy('client_employee_assigned_posts.client.name');;

    $employee_assigned_posts = \App\ClientEmployeeAssignedPost::join('client_employees','client_employees.id','=','client_employee_assigned_posts.employee_id')
                                ->where('client_employees.status',$status)
                                ->orderBy('date_start','asc')
                                ->get();

    $reports = [];
    foreach ($employees as $key => $employee) {
        $_report = [
            'name' => $employee->name,
            'client_name' => $employee->client->name,
        ];
        $assigned_posts = $employee->client_employee_assigned_posts->sortBy(function($col)
                            {
                                return $col;
                            })->values()->all();
        $total_cb = 0;
        foreach ($assigned_posts as $key => $assigned_post) {
            $total = getCashbond($assigned_post);
            $_report[$assigned_post['client']['name']] = [
                'date' => $assigned_post['date_start'] . ' to ' . $assigned_post['date_end'],
                'total' => $total
            ];
            $total_cb += $total;
            $_report['total'] = $total_cb;
        }

        $reports[] = $_report;
    }

    dd($reports);
});