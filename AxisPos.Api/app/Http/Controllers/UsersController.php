<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UsersController extends Controller
{

  public function GetUserByEmail($email)
  {

    $user = User::where("email", "=" , $email)->first() ;

    if(!$user)
       return Response()->json(null, 404);

    $userRoles = User::where("email", "=" , $email)->first()->load('roles:name')->pluck("name") ;

    $user['roles'] = $userRoles;

    return $user;
  }
}
