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
    public function index(Request $request)
    {
        $payrolls = ClientPayroll::whereMonth('date_start',$request->month)
                                    ->whereYear('date_start',$request->year)
                                    ->whereMonth('date_end',$request->month)
                                    ->whereYear('date_end',$request->year)
                                    ->with('client')
                                    ->get();
        return response()->json([
            'success' => true,
            'data' => $payrolls
        ]);
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
            if($payroll['days_of_work'] > 0) {
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
    public function destroy($id)
    {
        $client_payroll = ClientPayroll::find($id);

        if (!$client_payroll) {
            return response()->json([
                'success' => false,
                'message' => 'Payroll with id ' . $id . ' not found'
            ], 400);
        }

        if ($client_payroll->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Payroll could not be deleted'
            ], 500);
        }
    }
}
