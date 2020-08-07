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
    dd(strpos('assets/images/asdasda.png', 'assets'));
    // dd($client);
});