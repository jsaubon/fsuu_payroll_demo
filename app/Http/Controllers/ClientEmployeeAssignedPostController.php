<?php

namespace App\Http\Controllers;

use App\ClientEmployeeAssignedPost;
use Illuminate\Http\Request;

class ClientEmployeeAssignedPostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employee_assigned_posts = ClientEmployeeAssignedPost::with('client')->where('employee_id',$request->employee_id)->orderBy('date_start','asc')->get();
        $first = $employee_assigned_posts->first();
        $last = $employee_assigned_posts->last();

        $date1 = strtotime($first->date_start);
        $date2 = strtotime(isset($first->date_end) ? $first->date_end : date('Y-m-d'));

        // Formulate the Difference between two dates 
        $diff = abs($date2 - $date1);  
        
        
        // To get the year divide the resultant date into 
        // total seconds in a year (365*60*60*24) 
        $years = floor($diff / (365*60*60*24));  

        $months = floor(($diff - $years * 365*60*60*24) 
        / (30*60*60*24));  

        $total_months = ($years != 0 ?  ($years * 12) : 0) +$months; 

        $total_cashbond = $total_months * 100;

        return response()->json([
            'success' => true,
            'data' => $employee_assigned_posts->toArray(),
            'total_cashbond' => $total_cashbond,
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
            'date_start' => 'required',
            'employee_id' => 'required',
            'client_id' => 'required',
        ]);
      
        $employee_assigned_posts = new ClientEmployeeAssignedPost();
        $employee_assigned_posts->client_id = $request->client_id;
        $employee_assigned_posts->employee_id = $request->employee_id;
        $employee_assigned_posts->date_start = $request->date_start;
        $employee_assigned_posts->date_end = $request->date_end;
        $employee_assigned_posts->save();

        return response()->json([
            'success' => true,
            'employee$employee_assigned_posts' => $employee_assigned_posts,
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
        $employee_assigned_posts = ClientEmployeeAssignedPost::where('id',$id)->get();
 

        if ($employee_assigned_posts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Assigned Post with id ' . $id . ' not found'
            ], 400);
        } else {
            $employee_assigned_posts = $employee_assigned_posts->first()->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $employee_assigned_posts
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
        $employee_assigned_posts = ClientEmployeeAssignedPost::find($id);

        if (!$employee_assigned_posts) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Assigned Post with id ' . $id . ' not found'
            ], 400);
        }

        $updated = $employee_assigned_posts->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Employee Assigned Post could not be updated'
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
        $client = ClientEmployeeAssignedPost::find($id);

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Employee Assigned Post with id ' . $id . ' not found'
            ], 400);
        }

        if ($client->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Employee Assigned Post could not be deleted'
            ], 500);
        }
    }
}
