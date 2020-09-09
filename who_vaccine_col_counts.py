import pandas as pd
from config import settings

output_path = settings['output_path']
df = pd.read_csv(output_path + 'who_vaccines.csv')

df_list = []

for col in df.columns:
    df_col = df[[col]]
    df_counts = df[col].value_counts().reset_index()
    df_counts.columns = ['column_value', 'value_count']
    df_counts.insert(0,'column_name', col)
    df_list.append(df_counts)

df_columns = pd.DataFrame(columns = ['stage', 'column_name', 'column_value', 'value_count'])

df_columns = pd.concat(df_list)

df_columns.to_csv(output_path + 'column_counts.csv', sep=',', encoding='utf-8', index=False)
