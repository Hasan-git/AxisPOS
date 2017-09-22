angular
    .module('app.common.services')
    .filter('timeAgo', timeAgo)
    .filter('imageResolver', imageResolver)
    .filter('lengthChecker', lengthChecker)
    .filter('openingStatus', openingStatus)
    .filter('shortTime', shortTime)
;

function isValidUrl(url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

function timeAgo() {
    return function (x) {
            var res = x;
            if (moment(x).isValid()) {
                if (moment.isDate(new Date(x)) && x && moment(new Date(x)).isValid()) {
                    var date = moment(new Date(x));
                    res = moment(date, "YYYYMMDD").fromNow();
                }
            }
        
       
         return res;
    };
};

function shortTime() {
    return function (x) {
        var res = x;
        if (moment.isDate(new Date(x)) && x && moment(new Date(x)).isValid()) {
            var date = moment(new Date(x));
            res = moment(date, "YYYYMMDD").format('h:mm a');
        }
        return res;
    };
};

function lengthChecker() {
    return function (x) {
        var res = x;
        if (x.length <=0) {
            res = 0;
        }
        return res;
    };
};

function imageResolver() {
    return function (x) {
        //Overrided 
        var res = x;
        if (isValidUrl(x) != true ) {
            res = "http://localhost:3045/" + x;
            res = x;
        }
        console.log(res)
        return res;
    };
};


function openingStatus() {
    return function (x) {
        var res = "Opened";
        if (x === true) {
            res = "Opened";
        } else {
            res = "Closed";
        }
        return res;
    };
};

