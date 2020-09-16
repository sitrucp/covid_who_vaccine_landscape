'''
WHO web page has div with publication dynamic-content__date
* use beautiful soup, requests, etc to check when date changes from last retrieved

* use requests, etc to get newest PDF
https://www.who.int/docs/default-source/coronaviruse/novel-coronavirus-landscape-covid-19-(3)4b6debde1bdc4a85ae67d4ce578be1bf.pdf?sfvrsn=57c0b234_1&download=true

* save newest PDF to new AWS S3 folder
* run AWS Textract on PDF in that S3 folder
* save AWS Textract files in that S3 folder
* who_vaccine_detail.py runs on files in that S3 folder instead of local directory

'''