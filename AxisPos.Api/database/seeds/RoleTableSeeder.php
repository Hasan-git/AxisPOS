<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        if (!Role::where('name', '=', "admin")->exists()) {
            $role1 = new Role();
            $role1->name = "admin";
            $role1->display_name = "System administrator";
            $role1->description = "Admin Can control every thing";
            $role1->save();
        }

        if (!Role::where('name', '=', "employee")->exists()) {
            $role2 = new Role();
            $role2->name = "employee";
            $role2->display_name = "Employee Limited Access";
            $role2->description = "";
            $role2->save();
        }

    }
}
