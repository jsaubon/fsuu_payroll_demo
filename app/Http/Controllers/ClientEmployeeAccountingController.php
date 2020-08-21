<?php

namespace App\Http\Controllers;

use App\ClientEmployeeAccounting;
use Illuminate\Http\Request;

class ClientEmployeeAccountingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $employee_accounting_entry = ClientEmployeeAccounting::select('client_employee_accountings.*')
                                                            ->with('client_employee')
                                                            ->with('client_accounting_entry')
                                                            ->with('client_accounting_entry.client')
                                                            ->with('client_employee_payroll')
                                                            ->with('client_employee_payroll.client_payroll')
                                                            ->join('client_employee_payrolls','client_employee_accountings.client_employee_payroll_id','=','client_employee_payrolls.id')
                                                            ->join('client_payrolls','client_employee_payrolls.client_payroll_id','=','client_payrolls.id')
                                                            ->whereRaw('? between client_payrolls.date_start and client_payrolls.date_end', [$request->payroll_date]);
        $employee_accounting_entry = $employee_accounting_entry->get()
                                            ->sortBy('client_employee_payroll.client_payroll.name')
                                            ->sortBy('client_employee.name')
                                            ->sortBy('client_employee_payroll.client_payroll.date_start');

        
        return response()->json([
            'success' => true,
            'data' => $employee_accounting_entry,
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClientEmployeeAccounting  $clientEmployeeAccounting
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $employee_accounting = ClientEmployeeAccounting::where('client_accounting_entry_id',$id)
                                            ->with('client_accounting_entry')
                                            ->with('client_employee')
                                            ->with('client_employee_payroll')
                                            ->with('client_employee_payroll.client_payroll')
                                            ->with('client_employee_payroll.client_payroll.client')
                                            ->orderBy('created_at','desc')
                                            ->get();

        return response()->json([
            'success' => true,
            'data' => $employee_accounting
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClientEmployeeAccounting  $clientEmployeeAccounting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientEmployeeAccounting $clientEmployeeAccounting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClientEmployeeAccounting  $clientEmployeeAccounting
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientEmployeeAccounting $clientEmployeeAccounting)
    {
        //
    }
}
