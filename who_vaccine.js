
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
            tbody_tr.append("<td>" + obj["Phase 1 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 1/2 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 2 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 3 Desc"] + "</td>");
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

    //CREATE COLUMN COUNT TABLES=================================
    
    $(document).ready(function () {

        if($('body').is('.column_counts')){
            // loop through uniqueSourceColumnNames
            for(var i = 0; i < uniqueSourceColumnNames.length; i++) {
                var uniqueSourceColumnName = uniqueSourceColumnNames[i];
                var tableId = 'tbl_' + uniqueSourceColumnName.split("|")[1].split(" ").join("_").replace(/\//g,"_").replace("-","_");
                var sectionName = uniqueSourceColumnName.split("|")[0] + '-' + uniqueSourceColumnName.split("|")[1];
                
                // filter to uniqueSourceColumnNames
                var tableArray = columnCounts.filter(function(d) {
                    if (uniqueSourceColumnName === columnCounts["source_column_name"]) {
                        return d.source_column_name !== uniqueSourceColumnName;
                    } else {
                        return d.source_column_name === uniqueSourceColumnName;
                    }
                });

                // create table
                addTable(tableArray, tableId, sectionName);

            }
        }
    });

    function addTable(tableArray, tableId, sectionName) {
        var myTableDiv = document.getElementById("table_div");
        let tableData = tableArray.map(function(obj) {
            return {
                'Column Value': obj.column_value,
                'Value Count': obj.value_count
            }
          });

        var table = document.createElement('table');
        table.id = tableId;
        table.className  = "table w-auto small table-striped counttable tablesorter";
      
        var tableHead = document.createElement('thead');
        table.appendChild(tableHead);

        var tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
      
        // separate tables with section header
        var trHead = document.createElement('tr');
        tableHead.appendChild(trHead);
        
        var header_data = Object.keys(tableData[0]);
        
        // get head values
        for (var j = 0; j < header_data.length; j++) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(header_data[j]));
            trHead.appendChild(th);
        }

        for (var i = 0; i < tableData.length; i++) {
            var table_data = Object.values(tableData[i]);
            
            // separate tables with section header
            var trBody = document.createElement('tr');
            tableBody.appendChild(trBody);
      
            // get body values
            for (var j = 0; j < table_data.length; j++) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(table_data[j]));
                trBody.appendChild(td);
            }
        }

        sectionHeader = '<h5>' + sectionName + '</h5>';
        myTableDiv.insertAdjacentHTML( 'beforeend', sectionHeader );
        myTableDiv.appendChild(table);
      }

    
    $(document).ready(function($) {
        $("#treatment_table").tablesorter();
        $("#vaccine_table").tablesorter();
        $(".counttable").tablesorter();

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


