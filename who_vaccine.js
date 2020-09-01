
//GET DATA=================================
// get csv files from working group github repository
// get health region lookup csv from my github repository
var file_column_counts = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/column_counts.csv";
var file_update_time = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/update_time.csv";
var file_vaccines = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_vaccines.csv";
var file_treatments = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_treatments.csv";

Promise.all([
    d3.csv(file_column_counts),
    d3.csv(file_update_time),
    d3.csv(file_vaccines),
    d3.csv(file_treatments)
]).then(function(data) {
    //everthing else below is in d3 promise scope

    // get data sets from promise
    var columnCounts = data[0];
    var updateTime = data[1];
    var vaccines = data[2];
    var treatments = data[3];

    // get update time from working group repository
    lastUpdated = updateTime.columns[0];

    // create source and column name concat value
    columnCounts.forEach(function(d) {
        d.source_column_name = d.source + '|' + d.column_name
    });

    // get unique source and column name concat value
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    var uniqueSourceColumnNames = [...new Set(columnCounts.map(item => item.source_column_name))];

   //CREATE VACCINE TABLE=================================

   $(document).ready(function () {

        var thead;
        var thead_tr;
        thead = $("<thead>");
        thead_tr = $("<tr/>");
        thead_tr.append("<th>COVID-19 Vaccine developer or manufacturer</th>");
        thead_tr.append("<th>Vaccine platform</th>");
        thead_tr.append("<th>Type of candidate vaccine</th>");
        thead_tr.append("<th>Number of doses</th>");
        thead_tr.append("<th>Timing of doses</th>");
        thead_tr.append("<th>Current Phase</th>");
        thead_tr.append("<th>Route of administration</th>");
        thead_tr.append("<th>Phase 1 Desc</th>");
        thead_tr.append("<th>Phase 1/2 Desc</th>");
        thead_tr.append("<th>Phase 2 Desc</th>");
        thead_tr.append("<th>Phase 3 Desc</th>");
        thead_tr.append("</tr>");
        thead.append(thead_tr);
        $('#vaccine_table').append(thead);

        var table;
        var tbody;
        var tbody_tr;
        tbody = $("<tbody>");
        $('#vaccine_table').append(tbody);
        for(var i = 0; i < vaccines.length; i++) {
            var obj = vaccines[i];
            tbody_tr = $('<tr/>');
            tbody_tr.append("<td>" + obj["COVID-19 Vaccine developer or manufacturer"] + "</td>");
            tbody_tr.append("<td>" + obj["Vaccine platform"] + "</td>");
            tbody_tr.append("<td>" + obj["Type of candidate vaccine"] + "</td>");
            tbody_tr.append("<td>" + obj["Number of doses"] + "</td>");
            tbody_tr.append("<td>" + obj["Timing of doses"] + "</td>");
            tbody_tr.append("<td>" + obj["Current Phase"] + "</td>");
            tbody_tr.append("<td>" + obj["Route of administration"] + "</td>");
            tbody_tr.append("<td>" + obj["Clinical Stage - Phase 1"] + "</td>");
            tbody_tr.append("<td>" + obj["Clinical Stage - Phase 1/2"] + "</td>");
            tbody_tr.append("<td>" + obj["Clinical Stage - Phase 2"] + "</td>");
            tbody_tr.append("<td>" + obj["Clinical Stage - Phase 3"] + "</td>");
            tbody.append(tbody_tr);
        }
    });

    //CREATE TREATMENT TABLE=================================
    $(document).ready(function () {

        var thead;
        var thead_tr;
        thead = $("<thead>");
        thead_tr = $("<tr/>");
        thead_tr.append("<th>Platform</th>");
        thead_tr.append("<th>Type of candidate vaccine</th>");
        thead_tr.append("<th>Developer</th>");
        thead_tr.append("<th>Coronavirus target</th>");
        thead_tr.append("<th>Current stage of clinical evaluation/regulatory -Coronavirus candidate</th>");
        thead_tr.append("<th>Same platform for non-Coronavirus candidates</th>");
        thead_tr.append("</tr>");
        thead.append(thead_tr);
        $('#treatment_table').append(thead);

        var tbody;
        var tbody_tr;
        tbody = $("<tbody>");
        $('#treatment_table').append(tbody);
        
        for(var i = 0; i < treatments.length; i++) {
            var obj = treatments[i];
            tbody_tr = $('<tr/>');
            tbody_tr.append("<td>" + obj["Platform"] + "</td>");
            tbody_tr.append("<td>" + obj["Type of candidate vaccine"] + "</td>");
            tbody_tr.append("<td>" + obj["Developer"] + "</td>");
            tbody_tr.append("<td>" + obj["Coronavirus target"] + "</td>");
            tbody_tr.append("<td>" + obj["Current stage of clinical evaluation/regulatory -Coronavirus candidate"] + "</td>");
            tbody_tr.append("<td>" + obj["Same platform for non-Coronavirus candidates"] + "</td>");
            tbody.append(tbody_tr);

        }
    });

    //CREATE SUMMARY TABLES=================================
    
    $(document).ready(function () {
        // loop through uniqueSourceColumnNames and then inside this
        // loop through each uniqueSourceColumnNames rows to create table 
        for(var i = 0; i < uniqueSourceColumnNames.length; i++) {
            var objUnique = uniqueSourceColumnNames[i];
            var currentSourceColumn = objUnique["source_column_name"];

            // filter to uniqueSourceColumnNames
            var columnCountsCurrent = columnCounts.filter(function(d) { 
                if (currentSourceColumn === columnCounts["source_column_name"]) {
                    return d.source_column_name !== currentSourceColumn;
                } else {
                    return d.source_column_name === currentSourceColumn;
                }
            });

            // create table
            var table = 'table'+i;
            var thead;
            var thead_tr;
            table = $('<table id="treatment_table" class="table w-auto small table-striped tablesorter">');
            thead = $("<thead>");
            thead_tr = $("<tr/>");
            thead_tr.append("<th>Source</th>");
            thead_tr.append("<th>Column Name</th>");
            thead_tr.append("<th>Column Value</th>");
            thead_tr.append("<th>Value Count</th>");
            thead_tr.append("</tr>");
            thead.append(thead_tr);
            $('#table_div').append(table);
            table.append(thead);
            var tbody;
            var tbody_tr;
            tbody = $("<tbody>");
            table.append(tbody);
            for(var i = 0; i < columnCountsCurrent.length; i++) {
                var obj = columnCountsCurrent[i];
                tbody_tr = $('<tr/>');
                tbody_tr.append("<td>" + obj["source"] + "</td>");
                tbody_tr.append("<td>" + obj["column_name"] + "</td>");
                tbody_tr.append("<td>" + obj["column_value"] + "</td>");
                tbody_tr.append("<td>" + obj["value_count"] + "</td>");
                tbody.append(tbody_tr);
            }
        }
    });
    
    $(document).ready(function($) {
        $("#treatment_table").tablesorter();
        $("#vaccine_table").tablesorter();

        $('#treatment_table_div').hide();

        $('#btn_hide_show_details').click(function(){
            $('#vaccine_table_div').toggle();
            $('#treatment_table_div').toggle();
        });
        
        $("#data_table").tablesorter();

        $('#btn_hide_show_summaries').click(function() {
            var selection = $(this).val();
            var rows = $("#data_table > tbody > tr");
            rows.filter(function() {
                $(this).toggle($(this).text().indexOf(selection) > -1)
            });
        });
    });

    document.getElementById('updated').innerHTML += lastUpdated;

    document.getElementById('vaccine_count').innerHTML += vaccines.length;

    document.getElementById('treatment_count').innerHTML += treatments.length;

    $(function() {
        $("#vaccine_filter").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#vaccine_table > tbody > tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    $(function() {
        $("#treatment_filter").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#treatment_table > tbody > tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

});


