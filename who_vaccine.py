import pandas as pd
import glob, os
from textract_python_table_parser import main

# get pdf and output paths from config.py file
from config import settings
pdf_data_path = settings['pdf_data_path']
output_path = settings['output_path']

def main():
    table_files = get_tables(pdf_data_path)
    output_csv(table_files)

def get_tables(pdf_data_path):
    table_files = []

    os.chdir(pdf_data_path)
    for file in glob.glob("table*"):
        table_files.append(file)

    return table_files

def output_csv(table_files):
    table_files = [
        "table-1.csv",
        "table-2.csv",
        "table-3.csv",
        "table-4.csv",
        "table-5.csv",
        "table-6.csv",
        "table-7.csv",
        "table-8.csv",
        "table-9.csv"
    ]

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

    # get all csv files, append to list
    file_list = list()
    for file in table_files:
        df_file = pd.read_csv(pdf_data_path + file, index_col=None, header=None)
        file_list.append(df_file)

    # create new df from file list
    df_raw = pd.concat(file_list, axis=0, ignore_index=True)
    # remove trailing spaces entire df (not completely working yet, some are quotes so not stripping)
    df_all = df_raw.applymap(lambda x: x.rstrip() if type(x)==str else x)
    # exclude top 2 rows
    df_all = df_all.iloc[2:]
    # drop empty rows
    df_all.dropna(how='all')

    # find row where treatments start, and use to split into 2 df
    split_index = df_all[df_all.iloc[:,0]=='Platform'].index.item()
    df_vaccine = df_all.iloc[:split_index].copy()
    df_treatment = df_all.iloc[split_index:].copy()

    # give cols to 2 new df
    df_vaccine.columns = col_names_vaccine
    cols = [6,7,8,9,10]
    df_treatment.drop(df_treatment.columns[cols], axis=1, inplace=True)
    df_treatment.columns = col_names_treatment

    # save df to csv
    df_vaccine.to_csv(output_path + "who_vaccines.csv", sep=',', encoding='utf-8', index=False)
    df_treatment.to_csv(output_path + "who_treatments.csv", sep=',', encoding='utf-8', index=False)

if __name__ == "__main__":
    main()