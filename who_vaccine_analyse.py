import pandas as pd
import glob, os

# get pdf and output paths from config.py file
from config import settings
output_path = settings['output_path']
df_columns = pd.DataFrame(columns = ['source', 'column_name', 'column_value', 'value_count'])
df_list = []

def main():
    csv_files = get_csv_files(output_path)
    csv_dataframe(csv_files)

def get_csv_files(path):
    csv_files = []
    os.chdir(output_path)
    for file in glob.glob("who_*"):
        csv_files.append(file)
    return csv_files

def csv_dataframe(files):
    for file in files:
        df_name = 'df_' + file.replace('.csv','')
        df = pd.read_csv(output_path + file)
        df.insert(0, 'source', df_name)
        group_by_columns(df)
        
def group_by_columns(df):
    source = df['source'][0].replace('df_who_', '').capitalize()
    df.drop('source', axis=1, inplace=True)
    for col in df.columns:
        df_col = df[[col]]
        df_counts = df[col].value_counts().reset_index()
        df_counts.columns = ['column_value', 'value_count']
        df_counts.insert(0,'source', source)
        df_counts.insert(1,'column_name', col)
        df_list.append(df_counts)

    #print(df_columns.describe())
    df_columns = pd.concat(df_list)
    df_columns.to_csv(output_path + 'column_counts.csv', sep=',', encoding='utf-8', index=False)

if __name__ == "__main__":
    main()