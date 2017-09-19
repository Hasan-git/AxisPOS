<?php

use Illuminate\Http\Request;


// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::get('/message', function () {
//   return response()->json('Welcome');
// })->middleware('auth:api');


//Route::get('/home', 'HomeController@home');

Route::get('/userRole/{userId}', 'HomeController@getUserRoles');
Route::get('/attachUserRole/{userId}/{role}', 'HomeController@attachUserRole');


//Route::group(['middleware' => ['auth:api','role:admin']],function (){
Route::group(['middleware' => ['auth:api','role:employee']], function() {

  Route::get('/home', 'HomeController@index');

});



