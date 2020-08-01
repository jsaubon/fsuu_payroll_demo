<?php

namespace App\Http\Controllers;

use App\ClientEmployeeDeduction;
use Illuminate\Http\Request;

class ClientEmployeeDeductionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employee_deductions = ClientEmployeeDeduction::where('employee_id',$request->employee_id)->orderBy('date_applied','desc')->get();

        return response()->json([
            'success' => true,
            'data' => $employee_deductions->toArray()
        ],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'deduction' => 'required|min:3',
            'amount' => 'required',
            'employee_id' => 'required',
        ]);
      
        $employee_deduction = new ClientEmployeeDeduction();
        $employee_deduction->employee_id = $request->employee_id;
        $employee_deduction->deduction = $request->deduction;
        $employee_deduction->amount = $request->amount;
        $employee_deduction->date_applied = $request->date_applied;
        $employee_deduction->save();

        return response()->json([
            'success' => true,
            'employee_deduction' => $employee_deduction,
        ],200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $employee_deduction = ClientEmployeeDeduction::where('id',$id)->get();
 

        if ($employee_deduction->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Deduction with id ' . $id . ' not found'
            ], 400);
        } else {
            $employee_deduction = $employee_deduction->first()->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $employee_deduction
        ],200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $employee_deduction = ClientEmployeeDeduction::find($id);

        if (!$employee_deduction) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Deduction with id ' . $id . ' not found'
            ], 400);
        }

        $updated = $employee_deduction->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Employee Deduction could not be updated'
            ], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $client = ClientEmployeeDeduction::find($id);

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Deduction with id ' . $id . ' not found'
            ], 400);
        }

        if ($client->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Employee Deduction could not be deleted'
            ], 500);
        }
    }
}
