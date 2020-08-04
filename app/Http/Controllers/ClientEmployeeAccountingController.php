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
