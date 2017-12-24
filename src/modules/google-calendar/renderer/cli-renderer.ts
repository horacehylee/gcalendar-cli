import { GCalEvent } from "../models/event";

export const renderEvents = (events: GCalEvent[]) => {
    console.log(events);
    var Table = require('cli-table');
    var table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });

    table.push(
        { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
        , { 'Left Header 2': ['Value Row 2 Col 1\nValue Row 3', 'Value Row 2 Col 2'] }
    );

    console.log(table.toString());
}