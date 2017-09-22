<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      if (!User::where('email', '=', "admin@email.com")->exists()) {

        $user1 = new User();
            $user1->name = "admin";
            $user1->email = 'admin@email.com';
            $user1->password = Hash::make('Pass@123');
            $user1->save();

            $roleId = Role::where('name',"admin")->first();
            $user1->roles()->attach($roleId);
        }

        if (!User::where('email', '=', "employee@email.com")->exists()) {

            $user2 = new User();
           $user2->name = "employee";
            $user2->email = 'employee@email.com';
            $user2->password = Hash::make('Pass@123');
            $user2->save();

            $roleId = Role::where('name',"employee")->first();
            $user2->roles()->attach($roleId);

        }


    }
}
