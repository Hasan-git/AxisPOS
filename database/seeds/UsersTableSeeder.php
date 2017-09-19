<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
      $user1 = [
          'name' => 'Hasan',
          'email' => 'Hasan@email.com',
          'password' => Hash::make('Pass@123')
        ];
        User::create($user1);
    }
}
