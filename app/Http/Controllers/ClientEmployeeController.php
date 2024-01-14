<?php

namespace App\Http\Controllers;

use App\ClientEmployee;
use Illuminate\Http\Request;

class ClientEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $client = null;
        if(isset($request->client_id)) {
            $client = \App\Client::find($request->client_id);
            $client_employees = ClientEmployee::where('client_id',$request->client_id);
        } else {
            $client_employees = new ClientEmployee();;
        }
        
        

        if(isset($request->order)) {
            $client_employees = $client_employees->where(function($query) use ($request) {
                $query->where('name','like',isset($request->search) ? '%'.$request->search.'%' : '%%')
                ->orWhere('email_address','like',isset($request->search) ? '%'.$request->search.'%' : '%%')
                ->orWhere('contact_number','like',isset($request->search) ? '%'.$request->search.'%' : '%%');
            })
            
            ->orderBy($request->order,$request->sort)
            ->limit($request->size)
            ->offset($request->size * ($request->page -1))
            ->with('client')
            ->with('other_infos');
        } else {

            if(isset($request->client_id)) {
                $client_employees = $client_employees->where('status','Active')->with(['client_employee_deductions' => function($query) use ($request) {
                    $query->where('date_applied','>=',$request->date_start)->where('date_applied','<=',$request->date_end);
                }])->orderBy('name','asc');   
            }
            
        }
                                    
        $client_employees = $client_employees->get();

        return response()->json([
            'success' => true,
            'data' => $client_employees->toArray(),
            'request' => $request->all(),
            'client' => $client
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
            'client_id' => 'required',
            'name' => 'required|min:3',
        ]);
        
        if($request->id) {
            $client_employees = ClientEmployee::find($request->id);
            $client_employees->client_id = $request->client_id;
            $client_employees->name = $request->name;
            $client_employees->address = $request->address;
            $client_employees->email_address = $request->email_address;
            $client_employees->contact_number = $request->contact_number;
            $client_employees->gender = $request->gender;
            $client_employees->birth_date = $request->birth_date;
            $client_employees->status = $request->status;
            $client_employees->save();

            if($client_employees->status != 'Active') {
                $assigned_posts = new \App\ClientEmployeeAssignedPost();
                $assigned_posts = $assigned_posts->where('employee_id',$request->id)->get()->last();
                if(!isset($assigned_posts->date_end)) {
                    $assigned_posts->date_end = date('Y-m-d');
                    $assigned_posts->save();
                }
               
            }   
        } else {
            $client_employees = new ClientEmployee();
            $client_employees->client_id = $request->client_id;
            $client_employees->name = $request->name;
            $client_employees->address = $request->address;
            $client_employees->email_address = $request->email_address;
            $client_employees->contact_number = $request->contact_number;
            $client_employees->gender = $request->gender;
            $client_employees->birth_date = $request->birth_date;
            $client_employees->status = $request->status;
            $client_employees->save();

            $assigned_posts = new \App\ClientEmployeeAssignedPost();
            $assigned_posts->employee_id = $client_employees->id;
            $assigned_posts->client_id = $request->client_id;
            $assigned_posts->date_start = date('Y-m-d');
            $assigned_posts->save();
        }
        
       

        if($request->other_infos) {
            $client_employees->other_infos()->delete();
            foreach ($request->other_infos as $key => $other_info) {
                $client_employees->other_infos()->create(
                    [
                        'title' => $other_info['title'],
                        'description' => $other_info['description'],
                    ]
                );
            }
        }

        return response()->json([
            'success' => true,
            'employees' => $client_employees,
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
        $client_employees = ClientEmployee::where('id',$id)->with('other_infos')->get();

        if ($client_employees->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Client Employee with id ' . $id . ' not found'
            ], 400);
        } else {
            $client_employees = $client_employees->first()->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $client_employees
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
        $client_employees = ClientEmployee::find($id);

        

        if (!$client_employees) {
            return response()->json([
                'success' => false,
                'message' => 'Client Employee with id ' . $id . ' not found'
            ], 400);
        }

        if($request->client_id != $client_employees->client_id) {
            $assigned_posts = new \App\ClientEmployeeAssignedPost();
            $assigned_posts = $assigned_posts->where('employee_id',$id)->orderBy('id','desc')->limit(1)->get()->first();
            $assigned_posts->date_end = date('Y-m-d');
            $assigned_posts->save();

            $assigned_posts = new \App\ClientEmployeeAssignedPost();
            $assigned_posts->employee_id = $id;
            $assigned_posts->client_id = $request->client_id;
            $assigned_posts->date_start = date('Y-m-d');
            $assigned_posts->save();
        } 

        $updated = $client_employees->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Client Employee could not be updated'
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
        $client_employees = ClientEmployee::find($id);

        if (!$client_employees) {
            return response()->json([
                'success' => false,
                'message' => 'Client Employee with id ' . $id . ' not found'
            ], 400);
        }

        if ($client_employees->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Client Employee could not be deleted'
            ], 500);
        }
    }
}
