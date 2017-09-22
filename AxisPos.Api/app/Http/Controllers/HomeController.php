<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use Illuminate\Support\Facades\Auth;


class HomeController extends Controller
{

    public function __construct()
    {
      //$this->middleware('role:admin');
    }

    public function home()
    {
      return response()->json('Welcome');
    }

    public function index()
    {

      return Auth::user();
      //return auth()->guard('api')->user();

      //return User::all();
    }

    public function getUserRoles($userId)
    {
      return User::find($userId)->roles;

      // $user = User::find($userId);
      //  return $user->hasRole('admin');
    }

    public function attachUserRole($userId,$role)
    {
     $user = User::find($userId);

     $roleId = Role::where('name',$role)->first();

     $user->roles()->attach($roleId);

     return $user;
    }
}
