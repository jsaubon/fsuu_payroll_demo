<?php

namespace App\Http\Controllers;

use App\ClientPayroll;
use Illuminate\Http\Request;

class ClientPayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();
        foreach ($data['employeePayroll'] as $key => $payroll) {
            $client_payroll = ClientPayroll::create([
                'client_id' => $data['client_id'],
                'employee_id' => $payroll['employee_id'],
                'days_present' => $payroll['days_of_work'],
                'hours_overtime' => $payroll['hours_overtime'],
                'date_start' => $data['date_start'],
                'date_end' => $data['date_end'],
            ]);

            foreach ($payroll['debit'] as $key => $debit) {
                $client_employee_accountings = \App\ClientEmployeeAccounting::create([
                    'client_payroll_id' => $client_payroll->id,
                    'client_accounting_entry_id' => $debit['id'],
                    'employee_id' => $payroll['employee_id'],
                    'amount' => $debit['amount']
                ]);
            }

            foreach ($payroll['credit'] as $key => $credit) {
                $client_employee_accountings = \App\ClientEmployeeAccounting::create([
                    'client_payroll_id' => $client_payroll->id,
                    'client_accounting_entry_id' => $credit['id'],
                    'employee_id' => $payroll['employee_id'],
                    'amount' => $credit['amount']
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'request' => $request->all()
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClientPayroll  $clientPayroll
     * @return \Illuminate\Http\Response
     */
    public function show(ClientPayroll $clientPayroll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientPayroll  $clientPayroll
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientPayroll $clientPayroll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientPayroll  $clientPayroll
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientPayroll $clientPayroll)
    {
        //
    }
}
