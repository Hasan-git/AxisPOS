(function () {
    'use strict';
    angular
    .module('app.common.services')
    .factory('dates', dates);

    function dates() {

        var utcToLocal = function (date) {

            var stillUtc = moment.utc(date).toDate();
            var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
            return local;
        }

        /**
        * need a full date Ex: dates.toTicks(new Date())
        * @returns time duration as ticks
        */
        var toTicks = function (date) {
            var ticks;
            if (moment(date).isValid())
                ticks = moment.duration(moment(date).format('HH:mm:ss.SSS')).asMilliseconds() * 10000;

            return ticks;
        }

        var timetoTimeSpan = function (date) {
            var result;
            if (moment(date).isValid())
                result = moment(date).format("HH:mm:ss");

            return result;
        }

        return {
            utcToLocal: utcToLocal,
            toTicks: toTicks,
            timetoTimeSpan: timetoTimeSpan
        }
    }



})();
