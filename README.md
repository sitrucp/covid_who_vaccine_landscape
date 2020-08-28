The WHO creates a regularly updated PDF document named Draft landscape of COVID-19 candidate vaccines which contains all COVID-19 vaccine candidates and treatments currently being developed and their status.

I wanted to get a machine readable format version of this PDF document so I could do some analysis. I ended up using AWS Textract. 
Read <a href="https://009co.com/?page_id=1212">here</a> about how this was done.

Download csv files from this Github <a href="https://github.com/sitrucp/who_vaccine_landscape">repository</a> or view them in HTML tabular format <a href="https://sitrucp.github.io/who_vaccine_landscape">here</a>.

*PDF_data folder contents*

The AWS Textract process output is a zip file that contains following files.

These 3 files appear to be standard extraction information.

    apiResponse.json
    keyValues.csv
    rawText.txt

The rest of the files will vary depending on your document. In this case it returned a file for each table in the document.

    table-1.csv
    table-2.csv
    table-3.csv
    table-4.csv
    table-5.csv
    table-6.csv
    table-7.csv
    table-8.csv
    table-9.csv

The Python code in this repository was used to combine the table csv files, clean up data and split it into two datasets, vaccines and treatments.

The columns included in the WHO Draft landscape of COVID-19 candidate vaccines PDF tables are shown below.

*Vaccine columns*

    COVID-19 Vaccine developer or manufacturer
    Vaccine platform
    Type of candidate vaccine
    Number of doses
    Timing of doses
    Route of administration
    Clinical stage
    Stage - Phase 1
    Stage - Phase 1/2
    Stage - Phase 2
    Stage - Phase 3

*Treatment columns*

    Platform
    Type of candidate vaccine
    Developer
    Coronavirus target
    Current stage of clinical evaluation/regulatory -Coronavirus candidate
    Same platform for non-Coronavirus candidates