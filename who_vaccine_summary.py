import pandas as pd
from config import settings

output_path = settings['output_path']

df = pd.read_csv(output_path + 'who_vaccines_detail.csv')

df_list = []

for col in df.columns:
    df_col = pd.pivot_table(df, index=[df[col]], aggfunc='size', fill_value=0)
    df_col_flat = df_col.reset_index()
    df_col_flat.columns = ['column_value', 'value_count']
    df_col_flat.insert(0, 'column_name', col)
    df_col_flat.insert(0, 'clinical_stage', df['Clinical Stage'])
    
    with pd.option_context('display.multi_sparse', False):
        df_list.append(df_col_flat)

df_summary = pd.concat(df_list)

df_summary.to_csv(output_path + 'who_vaccines_summary.csv', sep=',', encoding='utf-8', index=True)
