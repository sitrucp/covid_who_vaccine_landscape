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

def get_tables(file_path):
    table_files = []

    os.chdir(pdf_data_path)
    for file in glob.glob("table*"):
        table_files.append(file)

    return table_files

def output_csv(table_files):

    col_names_clinical = [
        "COVID-19 Vaccine developer or manufacturer",
        "Vaccine platform",
        "Type of candidate vaccine",
        "Number of doses",
        "Timing of doses",
        "Route of administration",
        "Phase 1 Desc",
        "Phase 1/2 Desc",
        "Phase 2 Desc",
        "Phase 3 Desc"
    ]

    col_names_preclinical = [
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
        df_file = pd.read_csv(pdf_data_path + file, header=None)
        file_list.append(df_file)

    # create new df from file list
    df_raw = pd.concat(file_list, axis=0, ignore_index=True)

    #clean up all content
    # remove trailing spaces entire df (not completely working yet, some are quotes so not stripping)
    df_all = df_raw.applymap(lambda x: x.rstrip() if type(x)==str else x)

    # exclude top 2 rows
    df_all = df_all.iloc[2:]

    # drop empty rows
    df_all.dropna(how='all', inplace=True)

    # reset index to use in split
    df_all.reset_index(drop=True, inplace=True)

    df_all.head(200).to_clipboard(sep=',')

    # get clinical_end index value, eg where preclinical headers start
    clinical_end = (df_all[df_all.iloc[:,0]=='Platform'].index.item())
    print(clinical_end)

    # split to create clinical df, split 
    df_clinical = df_all.iloc[:clinical_end].copy()
    # drop empty column (in PDF extract is "Phase 3" but is empty bc cols shift bc of "Clinical Stage" col header)
    df_clinical.drop(df_clinical.columns[10], axis=1, inplace=True)
   # name the clinical columns
    df_clinical.columns = col_names_clinical

    # split to create preclinical df
    preclinical_start = clinical_end + 1
    df_preclinical = df_all.iloc[preclinical_start:].copy()
    
    # create temp clinical counter cols
    df_clinical['phase_1_counter'] = np.where(df_clinical['Phase 1 Desc'].notnull(), 1, '')
    df_clinical['phase_1_2_counter'] = np.where(df_clinical['Phase 1/2 Desc'].notnull(), 2, '')
    df_clinical['phase_2_counter'] = np.where(df_clinical['Phase 2 Desc'].notnull(), 3, '')
    df_clinical['phase_3_counter'] = np.where(df_clinical['Phase 3 Desc'].notnull(), 4, '')

    # use temp counter cols to get current phase
    df_clinical['Current Phase'] = df_clinical[['phase_1_counter','phase_1_2_counter','phase_2_counter','phase_3_counter']].max(axis=1)

    # update counter number with words
    phase_dict = {
        1: "Phase 1", 
        2: "Phase 1/2",
        3: "Phase 2",
        4: "Phase 3"
        }
    df_clinical['Current Phase'] = df_clinical['Current Phase'].replace(phase_dict)

    # drop unneeded clinical cols
    drop_clinical_temp_cols = ['phase_1_counter','phase_1_2_counter','phase_2_counter','phase_3_counter']
    df_clinical.drop(drop_clinical_temp_cols, axis=1, inplace=True)
    
    # cleanup clinical data Textract OCR or orig data entry errors
    clinical_reps = {
        'Timing of doses': {
            'o, 0, 14 14':'0, 14',
            '28 56':'28,56',
            'o,':'0,', 
            'O,':'0,'
        },
        'Vaccine platform': {
            'Non-Replicating Vira Vector': 'Non-Replicating Viral Vector',
            'Non-replicating Vira Vector': 'Non-Replicating viral vector',
            'Protein subunit': 'Protein Subunit'
        },
    }
    df_clinical.replace(clinical_reps, regex=True, inplace=True)

    # drop unneeded preclinical cols
    preclinical_drop_cols = [6,7,8,9,10]
    df_preclinical.drop(df_preclinical.columns[preclinical_drop_cols], axis=1, inplace=True)
    # name preclinical columns
    df_preclinical.columns = col_names_preclinical

    # cleanup preclinical data Textract OCR or orig data entry errors
    preclinical_reps = {
        'Platform': {
            'Non-replicating vira vector': 'Non-Replicating Viral Vector',
            'Non-replicating viral vector': 'Non-Replicating Viral Vector',
            'Replicating Vira Vector': 'Replicating Viral Vector',
            'Protein subunit': 'Protein Subunit'
        },
        'Coronavirus target': {
            'SARS-CoV-2':'SARS-CoV2',
        },
        'Same platform for non-Coronavirus candidates': {
            'influenza': 'Influenza',
        },
        'Type of candidate clinical' :{
            's protein': 'S protein',
        },
        'Developer': {
           'Fudan University/ Shanghai iaoTong University/RNACur Biopharma': 'Fudan University/ Shanghai JiaoTong University/RNACure Biopharma',
           'Osaka University/ BIKEN/ NIBIOHN': 'Osaka University/ BIKEN/ National Institutes of Biomedical Innovation'
        }
    }
    df_preclinical.replace(preclinical_reps, regex=True, inplace=True)

    # separate regex set to False to replace full cell values not partials
    df_preclinical.replace({'Current stage of clinical evaluation/regulatory -Coronavirus candidate': {'Pre-Clinica':'Pre-Clinical','Pre-clinica': 'Pre-Clinical','Pre-clinical': 'Pre-Clinical'}}, regex=False, inplace=True)

    # save df to csv
    df_clinical.to_csv(output_path + "who_clinical.csv", sep=',', encoding='utf-8', index=False)
    df_preclinical.to_csv(output_path + "who_preclinical.csv", sep=',', encoding='utf-8', index=False)

if __name__ == "__main__":
    main()