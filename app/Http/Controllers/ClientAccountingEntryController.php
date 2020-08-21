<?php

namespace App\Http\Controllers;

use App\ClientAccountingEntry;
use Illuminate\Http\Request;

class ClientAccountingEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $accounting_entry_debit = ClientAccountingEntry::where('client_id',$request->client_id)
                                                            ->where('type','debit')
                                                            ->orderBy('order','asc')
                                                            ->get();
        $accounting_entry_credit = ClientAccountingEntry::where('client_id',$request->client_id)
                                                            ->where('type','credit')
                                                            ->orderBy('order','asc')
                                                            ->get();

        return response()->json([
            'success' => true,
            'debit' => $accounting_entry_debit,
            'credit' => $accounting_entry_credit
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
        // $this->validate($request, [
        //     'client_id' => 'required',
        //     'type' => 'required',
        //     'title' => 'required',
        //     'amount' => 'required',
        // ]);
        if($request->debit) {
            $type = 'debit';
            $accounting_entries = $request->debit;
        } else {
            $type = 'credit';
            $accounting_entries = $request->credit;
        }
        
        
        foreach ($accounting_entries as $key => $accounting_entry) {
            $data = new ClientAccountingEntry();
            if(isset($accounting_entry['id'])){
                $data = $data->find($accounting_entry['id']);
            } 
            $data->type = $type;
            $data->order = $accounting_entry['order'];
            $data->title = $accounting_entry['title'];
            $data->amount = $accounting_entry['amount'];
            $data->visible = $accounting_entry['visible'];
            $data->client_id = $request->client_id;
            $data->save();
            // $accounting_entry = $doc->toArray();

        }
        


        return response()->json([
            'success' => true,
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
        $accounting_entry = ClientAccountingEntry::find($id);


        if (!$accounting_entry) {
            return response()->json([
                'success' => false,
                'message' => 'Accounting Entry with id ' . $id . ' not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $accounting_entry
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
        $accounting_entry = ClientAccountingEntry::find($id);

        if (!$accounting_entry) {
            return response()->json([
                'success' => false,
                'message' => 'Accounting Entry with id ' . $id . ' not found'
            ], 400);
        }

        $updated = $accounting_entry->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Accounting Entry could not be updated'
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
        $accounting_entry = ClientAccountingEntry::find($id);

        if (!$accounting_entry) {
            return response()->json([
                'success' => false,
                'message' => 'Accounting Entry with id ' . $id . ' not found'
            ], 400);
        }

        if ($accounting_entry->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Accounting Entry could not be deleted'
            ], 500);
        }
    }
}
