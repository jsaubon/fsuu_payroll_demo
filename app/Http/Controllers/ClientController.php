<?php

namespace App\Http\Controllers;

use App\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $clients = Client::where('name','like',isset($request->search) ? '%'.$request->search.'%' : '%%')->orderBy('name',$request->sort)->get();

        return response()->json([
            'success' => true,
            'data' => $clients->toArray()
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
            'name' => 'required|min:3',
            // 'contact_number' => 'required|min:11|max:11',
        ]);

        $photo = $request->photo ? $this->saveImage($request->photo) : 'assets/images/building.jpg';

        $client = Client::create([
            'name' => $request->name,
            'address' => $request->address,
            'photo' => $photo,
            'contact_number' => $request->contact_number,
            'client_since' => $request->client_since,
        ]);

        if($request->other_infos) {
            foreach ($request->other_infos as $key => $other_info) {
                if(isset($other_info->id)) {
                    $existing = $client->other_infos()->find($other_info->id);
                    $existing->title = $other_info['title'];
                    $existing->description = $other_info['description'];
                    $existing->save();
                } else {
                    if($other_info['title']) {
                        $client->other_infos()->create(
                            [
                                'title' => $other_info['title'],
                                'description' => $other_info['description'],
                            ]
                        );
                    }
                    
                }
                
            }
        }

        return response()->json([
            'success' => true,
            'client' => $client,
        ],200);
    }

    private function saveImage($imageData) {
        $imageData = str_replace('data:image/jpeg;base64,', '', $imageData);
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        $imageData = base64_decode($imageData);
        $source = imagecreatefromstring($imageData);
        $rotate = imagerotate($source, 0, 0); // if want to rotate the image
        $imageName = 'assets/images/'.rand().'.png';
        $imageSave = imagejpeg($rotate,$imageName,100);
        imagedestroy($source);

        return $imageName;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $client = Client::find($id);


        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $client
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
        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
            ], 400);
        }

        $updated = $client->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Client could not be updated'
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
        $client = Client::find($id);

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client with id ' . $id . ' not found'
            ], 400);
        }

        if ($client->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Client could not be deleted'
            ], 500);
        }
    }
}
