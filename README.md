The WHO creates a regularly updated PDF document named Draft landscape of COVID-19 candidate vaccines which contains all COVID-19 vaccine candidates and treatments currently being developed and their status.

I wanted to get a machine readable format version of this PDF document so I could do some analysis.

Download csv files from this Github <a href="https://github.com/sitrucp/who_vaccine_landscape">repository</a> or view them in HTML tabular format <a href="https://sitrucp.github.io/who_vaccine_landscape">here</a>.

Read <a href="https://009co.com/?page_id=1212">here</a> about how this was done.

*PDF_data folder*

The output file is a zip file contained bunch of files that is automatically downloaded to your computer and contained the following files.

These 3 files appear to be standard extraction information.

    apiResponse.json
    keyValues.csv
    rawText.txt

The rest of the files contained one table each. In this WHO PDF, there are 9 tables eg. there are 9 pages and each one has a table.

    table-1.csv
    table-2.csv
    table-3.csv
    table-4.csv
    table-5.csv
    table-6.csv
    table-7.csv
    table-8.csv
    table-9.csv

The extraction was very fast and excellent quality. The only clean-ups required were to fix up the column headers and do strip trailing white spaces on all text.

Afterwards I imported the csv files into Pandas dataframes to do the clean up and additionally split the table data into two separate dataframes (vaccines and treatments).

The Python code I used to clean up the table data is in Github.

The data included in the WHO Draft landscape of COVID-19 candidate vaccines PDF tables are shown below.

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