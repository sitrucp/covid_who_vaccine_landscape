The WHO creates a regularly updated PDF document named Draft landscape of COVID-19 candidate vaccines which contains all COVID-19 vaccine candidates and treatments currently being developed and their status.

TLDR view and download csv files <a href="https://sitrucp.github.io/who_vaccine_landscape/">here</a>.

I wanted to get a machine readable format version of this PDF document so I could do some analysis.

I started looking for Python module to do PDF parsing but I ended up doing it using Amazon Textract which is an AWS service to extract text and data from your documents including text documents, images and PDFs.

"Amazon Textract is a service that automatically detects and extracts text and data from scanned documents. It goes beyond simple optical character recognition (OCR) to also identify the contents of fields in forms and information stored in tables"

*Using Textract*

To use Textract you need an AWS account and it does cost (a very small fee) to use the service.

You can use Textract manually via a UI or use the Boto3 SDK. I used the manual UI. However, I did dig into the SDK Textract functionality which had fairly good documentation and example code.

Use this link to go directly to the Textract UI once you are logged into your AWS console.

The Textract UI is quite intuitive and easy to use. You manually upload your PDF file. After processing file, it shows you the interpreted content and gives option of what to extract from document. I selected "Tables".

The manual Textract process creates a new S3 folder where it uploads the PDF before processing it (currently AWS appears to only allow Textract to process files in an S3 bucket).

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