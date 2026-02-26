const { createObjectCsvStringifier } = require('csv-writer');

const exportToCSV = (data, headers) => {
    const csvStringifier = createObjectCsvStringifier({
        header: headers.map(h => ({ id: h, title: h.toUpperCase() }))
    });

    const headerString = csvStringifier.getHeaderString();
    const recordsString = csvStringifier.stringifyRecords(data);

    return headerString + recordsString;
};

module.exports = {
    exportToCSV
};
