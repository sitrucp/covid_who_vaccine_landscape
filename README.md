The WHO creates a regulary updated PDF document named "Draft landscape of COVID-19 candidate vaccines" which contains lists of COVID-19 vaccine candidates and treatments.

The file is can be downloaded from this web page:
<a href="https://www.who.int/publications/m/item/draft-landscape-of-covid-19-candidate-vaccines">https://www.who.int/publications/m/item/draft-landscape-of-covid-19-candidate-vaccines</a>

I wanted to get a machine readable format version of this PDF document so I could do some analysis.

I ended up using <a href="https://console.aws.amazon.com/textract">Amazon Textract></a>
which is an Amazon service to extract text and data from your documents including text documents, images and PDFs. 

"Amazon Textract is a service that automatically detects and extracts text and data from scanned documents. It goes beyond simple optical character recognition (OCR) to also identify the contents of fields in forms and information stored in tables"

Using Textract
To use Textract you need an AWS account and it costs a very small fee for this small document. The process creates a new S3 folder where it uploads the PDF (right now it appears Textract only accepts files from S3). The output file is a zip file contained bunch of files that is automatically downloaded to your computer.

The Textract UI is quite intuitive and easy to use. After uploading the PDF file described above it gives option of what to extract from document. I selected "Tables".

The output zip file contained the following files.

These 3 files appear to be standard with any extraction:
    apiResponse.json
    keyValues.csv
    rawText.txt

The rest of the files contained one table each. In this PDF, there are 9 tables eg there are 9 pages and each one has a table:

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

I imported the csv files into Pandas dataframes to do the clean up and additionally split the table data into two separate dataframes (vaccines and treatments).

The data included in this PDF's tables are shown below:

    col_names_vaccine = [
        "COVID-19 Vaccine developer or manufacturer",
        "Vaccine platform",
        "Type of candidate vaccine",
        "Number of doses",
        "Timing of doses",
        "Route of administration",
        "Clinical stage",
        "Stage - Phase 1",
        "Stage - Phase 1/2",
        "Stage - Phase 2",
        "Stage - Phase 3"
    ]

    col_names_treatment = [
        "Platform",
        "Type of candidate vaccine",
        "Developer",
        "Coronavirus target",
        "Current stage of clinical evaluation/regulatory -Coronavirus candidate",
        "Same platform for non-Coronavirus candidates"
    ]

