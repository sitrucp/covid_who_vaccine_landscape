**WHO "Draft landscape of COVID-19 candidate vaccines" - convert PDF to csv**

The WHO creates a regularly updated PDF document named <a href="https://www.who.int/publications/m/item/draft-landscape-of-covid-19-candidate-vaccines" target="_blank" rel="noopener noreferrer">Draft landscape of COVID-19 candidate vaccines</a> which is a summary of all COVID-19 vaccine candidates and treatments currently being developed and their status.

I wanted a machine readable format version of this PDF document's table data so I could do some analysis. This meant I needed to do PDF text extraction. There are lots of solutions. I ended up using AWS Textract to extract the PDF into csv file format.

View processed AWS Textract PDF extraction output file data rendered in HTML tabular format <a href="https://sitrucp.github.io/who_vaccine_landscape">here</a>. The HTML and Javascript used to produce this view are in this repository. 

Read <a href="https://009co.com/?page_id=1212" target="_blank">here</a> about how I used the AWS Textract solution.

The AWS Textract PDF extraction output files are in this Github repository.

The Python code used to process the AWS Textract table csv files, clean up their data and split the results into two datasets, vaccines and treatments are also in this Github repository.

The AWS Textract process output is a zip file who's contents are in the 'PDF_data' folder in this Github repository. The files are listed below.

These 3 files appear to be standard information for any AWS Textract job:

    apiResponse.json
    keyValues.csv
    rawText.txt

The rest of the AWS Textract output will vary depending on your document. In this case it returned a file for each table in the document. Note as part of processing, these files have been renamed with leading zeros in the file name eg table-1.csv renamed to table-01.csv etc.

    table-1.csv
    table-2.csv
    table-3.csv
    table-4.csv
    table-5.csv
    table-6.csv
    table-7.csv
    table-8.csv
    table-9.csv
    table-10.csv

The columns included in the WHO Draft landscape of COVID-19 candidate vaccines PDF tables are shown below.

Clinical Candidate Vaccine columns:

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

Pre-Clinical Candidate Vaccine columns:

    Platform
    Type of candidate vaccine
    Developer
    Coronavirus target
    Current stage of clinical evaluation/regulatory -Coronavirus candidate
    Same platform for non-Coronavirus candidates

