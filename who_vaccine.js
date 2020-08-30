
//GET DATA=================================
// get csv files from working group github repository
// get health region lookup csv from my github repository
var file_column_counts = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/column_counts.csv";
var file_update_time = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/update_time.csv";

Promise.all([
    d3.csv(file_column_counts),
    d3.csv(file_update_time),
]).then(function(data) {
    //everthing else below is in d3 promise scope

    // get data sets from promise
    var columnCounts = data[0];
    var updateTime = data[1];

    // get update time from working group repository
    lastUpdated = updateTime.columns[0];

    // create source and column name concat value
    columnCounts.forEach(function(d) {
        d.source_column_name = d.source + '|' + d.column_name
    });

    // get unique source and column name concat value
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    let uniqueSourceColumnNames = arrayColumn(columnCounts, 4);
    console.log(uniqueSourceColumnNames);

    //CREATE GROUPING TABLES=================================
    
    $(document).ready(function () {
        // loop through uniqueSourceColumnNames and then inside this
        // loop through each uniqueSourceColumnNames rows to create table 
        // for that uniqueSourceColumnNames value
        for(var i = 0; i < uniqueSourceColumnNames.length; i++) {
            var objUnique = uniqueSourceColumnNames[i];
            var currentSourceColumn = objUnique["source_column_name"];

            // filter to case and mort data to selected region
            var columnCountsCurrent = columnCounts.filter(function(d) { 
                if (currentSourceColumn === columnCounts["source_column_name"]) {
                    return d.source_column_name !== currentSourceColumn;
                } else {
                    return d.source_column_name === currentSourceColumn;
                }
            });

        
            var thead;
            var thead_tr;
            thead = $("<thead>");
            thead_tr = $("<tr/>");
            thead_tr.append("<th>Source</th>");
            thead_tr.append("<th>Column Name</th>");
            thead_tr.append("<th>Column Value</th>");
            thead_tr.append("<th>Value Count</th>");

            thead_tr.append("</tr>");
            thead.append(thead_tr);
            $('#vaccine_div').append(thead);

            var tbody;
            var tbody_tr;
            tbody = $("<tbody>");
            $('#vaccine_div').append(tbody);
            for(var i = 0; i < columnCountsCurrent.length; i++) {
                var obj = vaccines[i];
                tbody_tr = $('<tr/>');
                tbody_tr.append("<td>" + obj["source"] + "</td>");
                tbody_tr.append("<td>" + obj["column_name"] + "</td>");
                tbody_tr.append("<td>" + obj["Column_value"] + "</td>");
                tbody_tr.append("<td>" + obj["value_count"] + "</td>");
                tbody.append(tbody_tr);
                }
        }
    });

    document.getElementById('updated').innerHTML += ' <p>Last updated: ' + lastUpdated + '</p>';

    document.getElementById('vaccine_count').innerHTML += 'Vaccine count: ' +  vaccines.length;

    document.getElementById('treatment_count').innerHTML += 'Treatment count: ' +  treatments.length;

});


