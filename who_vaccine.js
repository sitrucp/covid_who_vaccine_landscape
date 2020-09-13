
//GET DATA=================================
// get csv files from working group github repository
// get health region lookup csv from my github repository
var file_update_time = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/update_time.csv";
var file_vaccine_detail = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_vaccines_detail.csv";
var file_vaccine_summary = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_vaccines_summary.csv";

Promise.all([
    d3.csv(file_update_time),
    d3.csv(file_vaccine_detail),
    d3.csv(file_vaccine_summary)
]).then(function(data) {
    //everthing else below is in d3 promise scope

    // get data sets from promise
    var updateTime = data[0];
    var vaccineDetail = data[1];
    var vaccineSummary = data[2];
    
    // get update time from working group repository
    lastUpdated = updateTime.columns[0];

    // create source and column name concat value
    vaccineSummary.forEach(function(d) {
        d.source_column_name = d.clinical_stage + '|' + d.column_name
    });

    // get unique source and column name concat value
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    var stageColumns = [...new Set(vaccineSummary.map(item => item.source_column_name))];

    var clinical_count = vaccineDetail.filter(item => item['Clinical Stage'] === 'Clinical').length;
    var preclinical_count = vaccineDetail.filter(item => item['Clinical Stage'] === 'Pre-Clinical').length;

    document.getElementById('updated').innerHTML += lastUpdated;
    document.getElementById('clinical_count').innerHTML += clinical_count;
    document.getElementById('preclinical_count').innerHTML += preclinical_count;

   //CREATE VACCINE TABLE=================================

   $(document).ready(function () {
        var thead;
        var thead_tr;
        thead = $("<thead>");
        thead_tr = $("<tr/>");
        thead_tr.append("<th>Clinical Stage</th>");
        thead_tr.append("<th>Clinical Phase</th>");
        thead_tr.append("<th>Developer</th>");
        thead_tr.append("<th>Platform</th>");
        thead_tr.append("<th>Candiate Type</th>");
        thead_tr.append("<th>Dose Count</th>");
        thead_tr.append("<th>Dose Timing</th>");
        thead_tr.append("<th>Route</th>");
        thead_tr.append("<th>Phase 1 Desc</th>");
        thead_tr.append("<th>Phase 1/2 Desc</th>");
        thead_tr.append("<th>Phase 2 Desc</th>");
        thead_tr.append("<th>Phase 3 Desc</th>");
        thead_tr.append("<th>Coronavirus Target</th>");
        thead_tr.append("<th>Shared Platforms</th>");
        thead_tr.append("</tr>");
        thead.append(thead_tr);
        $('#clinical_table').append(thead);

        var table;
        var tbody;
        var tbody_tr;
        tbody = $("<tbody class='filter_body'>");
        $('#clinical_table').append(tbody);
        for(var i = 0; i < vaccineDetail.length; i++) {
            var obj = vaccineDetail[i];
            tbody_tr = $('<tr/>');
            tbody_tr.append("<td>" + " " + obj["Clinical Stage"] + "</td>");
            tbody_tr.append("<td>" + obj["Clinical Phase"] + "</td>");
			tbody_tr.append("<td>" + obj["Developer"] + "</td>");
            tbody_tr.append("<td>" + obj["Platform"] + "</td>");
            tbody_tr.append("<td>" + obj["Candidate Type"] + "</td>");
            tbody_tr.append("<td>" + obj["Dose Count"] + "</td>");
            tbody_tr.append("<td>" + obj["Dose Timing"] + "</td>");
            tbody_tr.append("<td>" + obj["Route"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 1 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 1/2 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 2 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Phase 3 Desc"] + "</td>");
            tbody_tr.append("<td>" + obj["Coronavirus Target"] + "</td>");
            tbody_tr.append("<td>" + obj["Shared Platforms"] + "</td>");
            tbody.append(tbody_tr);
        }
    });

    //CREATE COLUMN COUNT TABLES=================================
    
    $(document).ready(function () {
        // if to see if this is detail or summary page, run only on summary page
        if($('body').is('.column_counts')){
            // loop through stageColumns
            for(var i = 0; i < stageColumns.length; i++) {
                var stageColumn = stageColumns[i];
                var tableId = 'tbl_' + stageColumn.split("|")[1].split(" ").join("_").replace(/\//g,"_").replace("-","_");
                var sectionName = stageColumn.split("|")[0] + ': ' + stageColumn.split("|")[1];
                //var sectionName = stageColumn.split("|")[1];
                // filter to stageColumns
                var tableArray = vaccineSummary.filter(function(d) {
                    if (stageColumn === vaccineSummary["source_column_name"]) {
                        return d.source_column_name !== stageColumn;
                    } else {
                        return d.source_column_name === stageColumn;
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
                'Clinical Stage': obj.clinical_stage,
                'Column Name': obj.column_name,
                'Column Value': obj.column_value,
                'Candidate Count': obj.value_count
            }
        });

        var table = document.createElement('table');
        table.id = tableId;
        table.className  = "table w-auto small table-striped counttable tablesorter";
      
        var tableHead = document.createElement('thead');
        table.appendChild(tableHead);

        var tableBody = document.createElement('tbody');
        tableBody.className = "filter_body";
        table.appendChild(tableBody);
      
        // separate tables with section header
        var trHead = document.createElement('tr');
        tableHead.appendChild(trHead);
        
        var header_data = Object.keys(tableData[0]);
        
        // get thead th values
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

        sectionHeader = '<h5>' + sectionName + ' (' + tableArray.length + ')' + '</h5>';
        myTableDiv.insertAdjacentHTML( 'beforeend', sectionHeader );
        myTableDiv.appendChild(table);
      }

    
    $(document).ready(function($) {
        $("#clinical_table").tablesorter();
        $(".counttable").tablesorter();

        $("#btn_clinical").click(function () {
            var rows = $(".filter_body").find("tr").hide();
            rows.filter(":contains('Pre-Clinical')").show();
         });

        $("#btn_clinical").click(function () {
            var rows = $(".filter_body").find("tr").hide();
            rows.filter(":contains(' Clinical')").show();
        });

        $("#btn_preclinical").click(function () {
            var rows = $(".filter_body").find("tr").hide();
            rows.filter(":contains('Pre-Clinical')").show();
        });

        $('#btn_all').click(function(){
            $('tbody > tr').show();
        });
    });

    // clinical table input form filter & reset
    $(function() {
        $("#clinical_filter").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#clinical_table > tbody > tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    $('#clinical_filter_reset').click(function(){
        $('tbody > tr').show();
    });

    // preclinical table input form filter & reset
    $(function() {
        $("#preclinical_filter").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".counttable > tbody > tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    $('#preclinical_filter_reset').click(function(){
        $('tbody > tr').show();
    });

});


