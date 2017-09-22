<?php

use Illuminate\Http\Request;

// User Identity
Route::group(['prefix' => 'users','middleware' => ['auth:api']], function() {

  Route::get('/user/{email}', 'UsersController@GetUserByEmail');

});



