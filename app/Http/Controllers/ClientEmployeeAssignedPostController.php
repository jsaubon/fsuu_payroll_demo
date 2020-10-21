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
        if(isset($request->report)) {

            $employees_list = \App\ClientEmployee::orderBy('name','asc')->get();
            // $employees = \App\ClientEmployee::with('client')
            //                             ->with('client_employee_accountings.client_accounting_entry')
            //                             ->with('client_employee_accountings.client_employee_payroll')
            //                             ->with('client_employee_accountings.client_employee_payroll.client_payroll')
            //                             ->with(['client_employee_accountings' => function($query) {
            //                                 $query->join('client_accounting_entries', function($join) {
            //                                     $join->on('client_employee_accountings.client_accounting_entry_id','=','client_accounting_entries.id')
            //                                             ->where('client_accounting_entries.title','Bond');
            //                                 });
            //                             }])
            //                             ->orderBy('name','asc');
            $employees = \App\ClientEmployee::with(['bonds','client']);
            // $employees = \App\ClientAccountingEntry::
            //         with(['client_employee_accountings' => function($q) {
            //             $q->with(['client_employee','client_employee_payroll' => function($q1) {
            //                 $q1->with('client_payroll');
            //             }]);
            //         }])
            //         ->with('client')
            //         ->where('title','Bond');
            
            if(isset($request->employee)) {
                $employees->where('id',$request->employee);
            }

            \DB::connection()->enableQueryLog();
            $employees = $employees->get();
            $queries = \DB::getQueryLog();
 

            return response()->json([
                'success' => true,
                'data' => $employees,
                'employees' => $employees_list,
                'queries' => $queries
            ]);
        } else {
            $employee_assigned_posts = ClientEmployeeAssignedPost::with('client')->where('employee_id',$request->employee_id)->orderBy('date_start','asc')->get();
            $total_cashbond = 0;
            foreach ($employee_assigned_posts as $key => $assigned_posts) {
                $cb = $this->getCashbond($assigned_posts);
                $total_cashbond += $cb;
            }
            

            return response()->json([
                'success' => true,
                'data' => $employee_assigned_posts->toArray(),
                'total_cashbond' => $total_cashbond,
            ],200);
        }
        
        
    }

    private function getCashbond($assigned_posts) {
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
