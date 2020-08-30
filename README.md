WHO "Draft landscape of COVID-19 candidate vaccines" - convert PDF to csv

The WHO creates a regularly updated PDF document named <a href="https://www.who.int/publications/m/item/draft-landscape-of-covid-19-candidate-vaccines" target="_blank" rel="noopener noreferrer">Draft landscape of COVID-19 candidate vaccines</a> which contains all COVID-19 vaccine candidates and treatments currently being developed and their status.

I wanted to get a machine readable format version of this PDF document's table data so I could do some analysis. I ended up using AWS Textract to extract the PDF into csv file format. 

Read <a href="https://009co.com/?page_id=1212" target="_blank">here</a> about how this was done.

Download and view AWS Textract PDF output csv files in this <a href="https://github.com/sitrucp/who_vaccine_landscape">Github repository</a> or view the resulting PDF table data  in HTML tabular format <a href="https://sitrucp.github.io/who_vaccine_landscape">here</a>.

There is also some Python code in this repository that was used to combine the AWS Textract table csv files, clean up their data and split the results into two datasets, vaccines and treatments.

The AWS Textract process output is a zip file who's contents are in the 'PDF_data' folder in this repository. The files are listed below.

These 3 files appear to be standard information for any AWS Textract job.

    apiResponse.json
    keyValues.csv
    rawText.txt

The rest of the AWS Textract output will vary depending on your document. In this case it returned a file for each table in the document.

    table-1.csv
    table-2.csv
    table-3.csv
    table-4.csv
    table-5.csv
    table-6.csv
    table-7.csv
    table-8.csv
    table-9.csv

The columns included in the WHO Draft landscape of COVID-19 candidate vaccines PDF tables are shown below.

*Vaccine columns*

    COVID-19 Vaccine developer or manufacturer
    Vaccine platform
    Type of candidate vaccine
    Number of doses
    Timing of doses
    Route of administration
    Clinical Stage - Phase 1
    Clinical Stage - Phase 1/2
    Clinical Stage - Phase 2
    Clinical Stage - Phase 3

*Treatment columns*

    Platform
    Type of candidate vaccine
    Developer
    Coronavirus target
    Current stage of clinical evaluation/regulatory -Coronavirus candidate
    Same platform for non-Coronavirus candidates