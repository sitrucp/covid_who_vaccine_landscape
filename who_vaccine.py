import pandas as pd
import numpy as np
import glob, os

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

    #clean up all content
    # remove trailing spaces entire df (not completely working yet, some are quotes so not stripping)
    df_all = df_raw.applymap(lambda x: x.rstrip() if type(x)==str else x)
    # exclude top 2 rows
    df_all = df_all.iloc[2:]
    # drop empty rows
    df_all.dropna(how='all')

    # find row where treatments start, and use to split into 2 df
    vaccine_end = (df_all[df_all.iloc[:,0]=='Platform'].index.item()) - 2
    treatment_start = vaccine_end + 1
    df_vaccine = df_all.iloc[:vaccine_end].copy()
    df_treatment = df_all.iloc[treatment_start:].copy()

    # drop unneeded vaccine cols
    vaccine_drop_cols = [10]
    df_vaccine.drop(df_vaccine.columns[vaccine_drop_cols], axis=1, inplace=True)
    df_vaccine.columns = col_names_vaccine

    # create vaccine counter cols
    df_vaccine['phase_1_counter'] = np.where(df_vaccine['Stage - Phase 1'].isnull(), 1, '')
    df_vaccine['phase_1_2_counter'] = np.where(df_vaccine['Stage - Phase 1/2'].isnull(), 1, '')
    df_vaccine['phase_2_counter'] = np.where(df_vaccine['Stage - Phase 2'].isnull(), 1, '')
    df_vaccine['phase_3_counter'] = np.where(df_vaccine['Stage - Phase 3'].isnull(), 1, '')

    # cleanup vaccine data Textract OCR mistakes
    vaccine_reps = {
        'Timing of doses': {'o, 0, 14 14':'0, 14',
        '28 56':'28,56',
        'o,':'0,', 
        'O,':'0,', 
        'vira':'viral',
        ', ':','
        },
        'Vaccine platform': {
            'Non-Replicating Vira Vector': 'Non-Replicating Viral Vector'
        }
    }
    df_vaccine.replace(vaccine_reps, regex=True, inplace=True)

    # drop unneeded treatment cols
    treatment_drop_cols = [6,7,8,9,10]
    df_treatment.drop(df_treatment.columns[treatment_drop_cols], axis=1, inplace=True)
    df_treatment.columns = col_names_treatment

    # cleanup treatment data Textract OCR mistakes
    treatment_reps = {
        'Platform': {
            'Non-replicating vira vector':'Non-Replicating Viral Vector',
            'Replicating Vira Vector':'Replicating Viral Vector',
        },
        'Coronavirus target': {
            'SARS-CoV-2':'SARS-CoV2',
        },
    }
    df_treatment.replace(treatment_reps, regex=True, inplace=True)
    df_treatment.replace({'Current stage of clinical evaluation/regulatory -Coronavirus candidate': {'Pre-Clinica':'Pre-Clinical'}}, regex=False, inplace=True)

    # save df to csv
    df_vaccine.to_csv(output_path + "who_vaccines.csv", sep=',', encoding='utf-8', index=False)
    df_treatment.to_csv(output_path + "who_treatments.csv", sep=',', encoding='utf-8', index=False)

if __name__ == "__main__":
    main()