define(["require", "exports", "knockout", "ojs/ojconverter-datetime"], function (require, exports, ko, datetimeConverter) {
    "use strict";
    class CustomScaleNHr {
        constructor(N) {
            this.converter = new IntlDateTimeConverter({
                hour: '2-digit',
                hour12: true
            });
            this.hour = 60 * 60 * 1000;
            this.name = `${N}hr`;
            this.N = N;
        }

        formatter(date) {
            return this.converter.format(date);
        }
        getNextDate(date) {
            return new Date(new Date(date).getTime() + this.N * this.hour).toISOString();
        }
        getPreviousDate(date) {
            const d = new Date(date);
            d.setHours(Math.floor(d.getHours() / this.N) * this.N, 0, 0, 0);
            return d.toISOString();
        }
    }
    return CustomScaleNHr;
});