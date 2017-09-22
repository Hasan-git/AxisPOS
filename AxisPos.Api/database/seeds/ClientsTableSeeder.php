<?php

use Illuminate\Database\Seeder;
use  Laravel\Passport\Client;

class ClientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $secret = "kqpFMuwonOSnJH8BSKmNttlcm5N9gUPiOsy32jvP";
        if (!Client::where('secret', '=', $secret)->exists()) {
           $oauth_client = Client::create([
            'id'                     => 926,
            'name'                   => "Laravel Password Grant Client",
            'secret'                 => "kqpFMuwonOSnJH8BSKmNttlcm5N9gUPiOsy32jvP",
            'redirect'               => "http://localhost",
            'password_client'        => 1,
            'personal_access_client' => 0,
            'redirect'               => '',
            'revoked'                => 0,
        ]);
     }
    }
}
