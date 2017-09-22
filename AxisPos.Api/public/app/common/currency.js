angular
.module('app.common.services')
.factory('currencyService', currencyService)
;

function currencyService() {

    var Currencies = {
        "ALL": {
            "code": "ALL",
            "name": "Lek"
        },
        "DZD": {
            "code": "DZD",
            "name": "Algerian Dinar"
        },
        "ARS": {
            "code": "ARS",
            "name": "Argentine Peso"
        },
        "AUD": {
            "code": "AUD",
            "name": "Australian Dollar"
        },
        "BSD": {
            "code": "BSD",
            "name": "Bahamian Dollar"
        },
        "BHD": {
            "code": "BHD",
            "name": "Bahraini Dinar"
        },
        "BDT": {
            "code": "BDT",
            "name": "Taka"
        },
        "AMD": {
            "code": "AMD",
            "name": "Armenian Dram"
        },
        "Bbd": {
            "code": "Bbd",
            "name": "Barbados Dollar"
        },
        "BMD": {
            "code": "BMD",
            "name": "Bermudian Dollar"
        },
        "BOB": {
            "code": "BOB",
            "name": "Boliviano"
        },
        "BWP": {
            "code": "BWP",
            "name": "Pula"
        },
        "BZD": {
            "code": "BZD",
            "name": "Belize Dollar"
        },
        "SBD": {
            "code": "SBD",
            "name": "Solomon Islands Dollar"
        },
        "BND": {
            "code": "BND",
            "name": "Brunei Dollar"
        },
        "MMK": {
            "code": "MMK",
            "name": "Kyat"
        },
        "BIF": {
            "code": "BIF",
            "name": "Burundi Franc"
        },
        "KHR": {
            "code": "KHR",
            "name": "Riel"
        },
        "CAD": {
            "code": "CAD",
            "name": "Canadian Dollar"
        },
        "Cve": {
            "code": "Cve",
            "name": "Cape Verde Escudo"
        },
        "KYD": {
            "code": "KYD",
            "name": "Cayman Islands Dollar"
        },
        "LKR": {
            "code": "LKR",
            "name": "Sri Lanka Rupee"
        },
        "CLP": {
            "code": "CLP",
            "name": "Chilean Peso"
        },
        "CNY": {
            "code": "CNY",
            "name": "Yuan Renminbi"
        },
        "COP": {
            "code": "COP",
            "name": "Colombian Peso"
        },
        "KMF": {
            "code": "KMF",
            "name": "Comoro Franc"
        },
        "CRC": {
            "code": "CRC",
            "name": "Costa Rican Colon"
        },
        "HRK": {
            "code": "HRK",
            "name": "Croatian Kuna"
        },
        "CUP": {
            "code": "CUP",
            "name": "Cuban Peso"
        },
        "CZK": {
            "code": "CZK",
            "name": "Czech Koruna"
        },
        "DKK": {
            "code": "DKK",
            "name": "Danish Krone"
        },
        "DOP": {
            "code": "DOP",
            "name": "Dominican Peso"
        },
        "SVC": {
            "code": "SVC",
            "name": "El Salvador Colon"
        },
        "ETB": {
            "code": "ETB",
            "name": "Ethiopian Birr"
        },
        "ERN": {
            "code": "ERN",
            "name": "Nakfa"
        },
        "EEK": {
            "code": "EEK",
            "name": "Kroon"
        },
        "FKP": {
            "code": "FKP",
            "name": "Falkland Islands Pound"
        },
        "FJD": {
            "code": "FJD",
            "name": "Fiji Dollar"
        },
        "DJF": {
            "code": "DJF",
            "name": "Djibouti Franc"
        },
        "GMD": {
            "code": "GMD",
            "name": "Dalasi"
        },
        "GIP": {
            "code": "GIP",
            "name": "Gibraltar Pound"
        },
        "GTQ": {
            "code": "GTQ",
            "name": "Quetzal"
        },
        "GNF": {
            "code": "GNF",
            "name": "Guinea Franc"
        },
        "GYD": {
            "code": "GYD",
            "name": "Guyana Dollar"
        },
        "HTG": {
            "code": "HTG",
            "name": "Gourde"
        },
        "HNL": {
            "code": "HNL",
            "name": "Lempira"
        },
        "HKD": {
            "code": "HKD",
            "name": "Hong Kong Dollar"
        },
        "HUF": {
            "code": "HUF",
            "name": "Forint"
        },
        "ISK": {
            "code": "ISK",
            "name": "Iceland Krona"
        },
        "INR": {
            "code": "INR",
            "name": "Indian Rupee"
        },
        "IDR": {
            "code": "IDR",
            "name": "Rupiah"
        },
        "IRR": {
            "code": "IRR",
            "name": "Iranian Rial"
        },
        "IQD": {
            "code": "IQD",
            "name": "Iraqi Dinar"
        },
        "ILS": {
            "code": "ILS",
            "name": "New Israeli Sheqel"
        },
        "JMD": {
            "code": "JMD",
            "name": "Jamaican Dollar"
        },
        "JPY": {
            "code": "JPY",
            "name": "Yen"
        },
        "KZT": {
            "code": "KZT",
            "name": "Tenge"
        },
        "JOD": {
            "code": "JOD",
            "name": "Jordanian Dinar"
        },
        "KES": {
            "code": "KES",
            "name": "Kenyan Shilling"
        },
        "KPW": {
            "code": "KPW",
            "name": "North Korean Won"
        },
        "KRW": {
            "code": "KRW",
            "name": "Won"
        },
        "KWD": {
            "code": "KWD",
            "name": "Kuwaiti Dinar"
        },
        "KGS": {
            "code": "KGS",
            "name": "Som"
        },
        "LAK": {
            "code": "LAK",
            "name": "Kip"
        },
        "LBP": {
            "code": "LBP",
            "name": "Lebanese Pound"
        },
        "LVL": {
            "code": "LVL",
            "name": "Latvian Lats"
        },
        "LRD": {
            "code": "LRD",
            "name": "Liberian Dollar"
        },
        "LYD": {
            "code": "LYD",
            "name": "Libyan Dinar"
        },
        "LTL": {
            "code": "LTL",
            "name": "Lithuanian Litas"
        },
        "MOP": {
            "code": "MOP",
            "name": "Pataca"
        },
        "MWK": {
            "code": "MWK",
            "name": "Kwacha"
        },
        "MYR": {
            "code": "MYR",
            "name": "Malaysian Ringgit"
        },
        "MVR": {
            "code": "MVR",
            "name": "Rufiyaa"
        },
        "MRO": {
            "code": "MRO",
            "name": "Ouguiya"
        },
        "MUR": {
            "code": "MUR",
            "name": "Mauritius Rupee"
        },
        "MXN": {
            "code": "MXN",
            "name": "Mexican Peso"
        },
        "MNT": {
            "code": "MNT",
            "name": "Tugrik"
        },
        "MDL": {
            "code": "MDL",
            "name": "Moldovan Leu"
        },
        "MAD": {
            "code": "MAD",
            "name": "Moroccan Dirham"
        },
        "OMR": {
            "code": "OMR",
            "name": "Rial Omani"
        },
        "NPR": {
            "code": "NPR",
            "name": "Nepalese Rupee"
        },
        "ANG": {
            "code": "ANG",
            "name": "Netherlands Antillian Guilder"
        },
        "AWG": {
            "code": "AWG",
            "name": "Aruban Guilder"
        },
        "VUV": {
            "code": "VUV",
            "name": "Vatu"
        },
        "NZD": {
            "code": "NZD",
            "name": "New Zealand Dollar"
        },
        "NIO": {
            "code": "NIO",
            "name": "Cordoba Oro"
        },
        "NGN": {
            "code": "NGN",
            "name": "Naira"
        },
        "NOK": {
            "code": "NOK",
            "name": "Norwegian Krone"
        },
        "PKR": {
            "code": "PKR",
            "name": "Pakistan Rupee"
        },
        "PAB": {
            "code": "PAB",
            "name": "Balboa"
        },
        "PGK": {
            "code": "PGK",
            "name": "Kina"
        },
        "PYG": {
            "code": "PYG",
            "name": "Guarani"
        },
        "PEN": {
            "code": "PEN",
            "name": "Nuevo Sol"
        },
        "PHP": {
            "code": "PHP",
            "name": "Philippine Peso"
        },
        "GWP": {
            "code": "GWP",
            "name": "Guinea-Bissau Peso"
        },
        "QAR": {
            "code": "QAR",
            "name": "Qatari Rial"
        },
        "RUB": {
            "code": "RUB",
            "name": "Russian Ruble"
        },
        "RWF": {
            "code": "RWF",
            "name": "Rwanda Franc"
        },
        "SHP": {
            "code": "SHP",
            "name": "Saint Helena Pound"
        },
        "STD": {
            "code": "STD",
            "name": "Dobra"
        },
        "SAR": {
            "code": "SAR",
            "name": "Saudi Riyal"
        },
        "SCR": {
            "code": "SCR",
            "name": "Seychelles Rupee"
        },
        "SLL": {
            "code": "SLL",
            "name": "Leone"
        },
        "SGD": {
            "code": "SGD",
            "name": "Singapore Dollar"
        },
        "SKK": {
            "code": "SKK",
            "name": "Slovak Koruna"
        },
        "VND": {
            "code": "VND",
            "name": "Dong"
        },
        "SOS": {
            "code": "SOS",
            "name": "Somali Shilling"
        },
        "ZAR": {
            "code": "ZAR",
            "name": "Rand"
        },
        "ZWD": {
            "code": "ZWD",
            "name": "Zimbabwe Dollar"
        },
        "SZL": {
            "code": "SZL",
            "name": "Lilangeni"
        },
        "SEK": {
            "code": "SEK",
            "name": "Swedish Krona"
        },
        "CHF": {
            "code": "CHF",
            "name": "Swiss Franc"
        },
        "SYP": {
            "code": "SYP",
            "name": "Syrian Pound"
        },
        "THB": {
            "code": "THB",
            "name": "Baht"
        },
        "TOP": {
            "code": "TOP",
            "name": "Pa'anga"
        },
        "TTD": {
            "code": "TTD",
            "name": "Trinidad and Tobago Dollar"
        },
        "AED": {
            "code": "AED",
            "name": "UAE Dirham"
        },
        "TND": {
            "code": "TND",
            "name": "Tunisian Dinar"
        },
        "TMM": {
            "code": "TMM",
            "name": "Manat"
        },
        "UGX": {
            "code": "UGX",
            "name": "Uganda Shilling"
        },
        "MKD": {
            "code": "MKD",
            "name": "Denar"
        },
        "EGP": {
            "code": "EGP",
            "name": "Egyptian Pound"
        },
        "GBP": {
            "code": "GBP",
            "name": "Pound Sterling"
        },
        "TZS": {
            "code": "TZS",
            "name": "Tanzanian Shilling"
        },
        "USD": {
            "code": "USD",
            "name": "US Dollar"
        },
        "UYU": {
            "code": "UYU",
            "name": "Peso Uruguayo"
        },
        "UZS": {
            "code": "UZS",
            "name": "Uzbekistan Sum"
        },
        "WST": {
            "code": "WST",
            "name": "Tala"
        },
        "YER": {
            "code": "YER",
            "name": "Yemeni Rial"
        },
        "ZMK": {
            "code": "ZMK",
            "name": "Kwacha"
        },
        "TWD": {
            "code": "TWD",
            "name": "New Taiwan Dollar"
        },
        "GHS": {
            "code": "GHS",
            "name": "Ghana Cedi"
        },
        "VEF": {
            "code": "VEF",
            "name": "Bolivar Fuerte"
        },
        "SDG": {
            "code": "SDG",
            "name": "Sudanese Pound"
        },
        "RSD": {
            "code": "RSD",
            "name": "Serbian Dinar"
        },
        "MZN": {
            "code": "MZN",
            "name": "Metical"
        },
        "AZN": {
            "code": "AZN",
            "name": "Azerbaijanian Manat"
        },
        "RON": {
            "code": "RON",
            "name": "New Leu"
        },
        "TRY": {
            "code": "TRY",
            "name": "New Turkish Lira"
        },
        "XAF": {
            "code": "XAF",
            "name": "CFA Franc BEAC"
        },
        "XCD": {
            "code": "XCD",
            "name": "East Caribbean Dollar"
        },
        "XOF": {
            "code": "XOF",
            "name": "CFA Franc BCEAO"
        },
        "XPF": {
            "code": "XPF",
            "name": "CFP Franc"
        },
        "XBA": {
            "code": "XBA",
            "name": "(EURCO)"
        },
        "XBB": {
            "code": "XBB",
            "name": "(E.M.U.-6)"
        },
        "XBC": {
            "code": "XBC",
            "name": "(E.U.A.-9)"
        },
        "XBD": {
            "code": "XBD",
            "name": "(E.U.A.-17)"
        },
        "XAU": {
            "code": "XAU",
            "name": "Gold"
        },
        "XDR": {
            "code": "XDR",
            "name": "SDR"
        },
        "XAG": {
            "code": "XAG",
            "name": "Silver"
        },
        "XPT": {
            "code": "XPT",
            "name": "Platinum"
        },
        "XTS": {
            "code": "XTS",
            "name": "Testing Purpose Code"
        },
        "XPD": {
            "code": "XPD",
            "name": "Palladium"
        },
        "SRD": {
            "code": "SRD",
            "name": "Surinam Dollar"
        },
        "MGM": {
            "code": "MGM",
            "name": "Malagasy Ariary"
        },
        "AFN": {
            "code": "AFN",
            "name": "Afghani"
        },
        "TJS": {
            "code": "TJS",
            "name": "Somoni"
        },
        "AOA": {
            "code": "AOA",
            "name": "Kwanza"
        },
        "BYR": {
            "code": "BYR",
            "name": "Belarussian Ruble"
        },
        "BGN": {
            "code": "BGN",
            "name": "Bulgarian Lev"
        },
        "CDF": {
            "code": "CDF",
            "name": "Franc Congolais"
        },
        "BAM": {
            "code": "BAM",
            "name": "Convertible Marks"
        },
        "EUR": {
            "code": "EUR",
            "name": "Euro"
        },
        "UAH": {
            "code": "UAH",
            "name": "Hryvnia"
        },
        "GEL": {
            "code": "GEL",
            "name": "Lari"
        },
        "PLN": {
            "code": "PLN",
            "name": "Zloty"
        },
        "BRL": {
            "code": "BRL",
            "name": "Brazilian Real"
        }
    };

    var getCurrencies = function () {
        return Currencies;
    }

    var getCodeByName = function (name) {
        var response;
        angular.forEach(Currencies, function (v, k) {
            if (v.name === name) {
                response = Currencies[k].code;
            }
        })
        return response;
    }
    var getNameByCode = function (code) {
        var response;
        angular.forEach(Currencies, function (v, k) {
            if (v.code === code) {
                response = Currencies[k].name;
            }
        })
        return response;
    }

    return {
        getCurrencies: getCurrencies,
        getCodeByName: getCodeByName,
        getNameByCode: getNameByCode,
    }
}


