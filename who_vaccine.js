
//GET DATA=================================
// get csv files from working group github repository
// get health region lookup csv from my github repository
var file_vaccines = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_vaccines.csv";
var file_treatments = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/who_treatments.csv";
var file_update_time = "https://raw.githubusercontent.com/sitrucp/who_vaccine_landscape/master/output/update_time.csv";

Promise.all([
    d3.csv(file_vaccines),
    d3.csv(file_treatments),
    d3.csv(file_update_time),
]).then(function(data) {
    //everthing else below is in d3 promise scope

    // get data sets from promise
    var vaccines = data[0];
    var treatments = data[1];
    var updateTime = data[2];

    // get update time from working group repository
    lastUpdated = updateTime.columns[0];

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
        thead_tr.append("<th>Route of administration</th>");
        thead_tr.append("<th>Stage - Phase 1</th>");
        thead_tr.append("<th>Stage - Phase 1/2</th>");
        thead_tr.append("<th>Stage - Phase 2</th>");
        thead_tr.append("<th>Stage - Phase 3</th>");
        thead_tr.append("</tr>");
        thead.append(thead_tr);
        $('#vaccine_table').append(thead);

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
            tbody_tr.append("<td>" + obj["Route of administration"] + "</td>");
            tbody_tr.append("<td>" + obj["Stage - Phase 1"] + "</td>");
            tbody_tr.append("<td>" + obj["Stage - Phase 1/2"] + "</td>");
            tbody_tr.append("<td>" + obj["Stage - Phase 2"] + "</td>");
            tbody_tr.append("<td>" + obj["Stage - Phase 3"] + "</td>");
            tbody.append(tbody_tr);
        }
    });

    $(document).ready(function($){ 
        $("#vaccine_table").tablesorter();
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

    $(document).ready(function($){ 
        $("#treatment_table").tablesorter();

        $("#btn_vaccine").click(function(){
            $("#vaccine_table_div").toggle();
        });

        $('#treatment_table_div').hide();

        $('#btn_hide_show').click(function(){
            $('#vaccine_table_div').toggle();
            $('#treatment_table_div').toggle();
        });
    }); 

    document.getElementById('updated').innerHTML += ' <p>Last updated: ' + lastUpdated + '</p>';

    document.getElementById('vaccine_count').innerHTML += 'Vaccine count: ' +  vaccines.length;

    document.getElementById('treatment_count').innerHTML += 'Treatment count: ' +  treatments.length;

});


