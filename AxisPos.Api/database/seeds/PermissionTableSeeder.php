<?php

use Illuminate\Database\Seeder;
use App\Permission;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $Permission = new Permission();
        $Permission->name = "create_item";
        $Permission->display_name = "Create Item";
        $Permission->description = "Can create an Item";
        $Permission->save();

        $Permission2 = new Permission();
        $Permission2->name = "edit_item";
        $Permission2->display_name = "Edit Item";
        $Permission2->description = "Can Edit an Item";
        $Permission2->save();
    }
}
