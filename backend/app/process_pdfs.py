import os
import camelot
import fnmatch
import pandas as pd

def find_files(directory, pattern):
    matches = []
    for root, _, filenames in os.walk(directory):
        for filename in fnmatch.filter(filenames, pattern):
            matches.append(os.path.join(root, filename))
    return matches  

# Example usage:
directory = 'data'
pattern = '*.pdf'
found_files = find_files(directory, pattern)
print(found_files)


for file in found_files:
    # For each of the datasets, ensure that we are only converting pages with data 
    if file == 'data/BJP2022-2023.pdf':
        page_numbers = '2-440'
        export_name = 'data/BJP2022-2023.csv'
    if file == 'data/AAP2022-2023.pdf':
        #continue
        page_numbers = '3-197'
        export_name = 'data/AAP2022-2023.csv'
    if file == 'data/NPP2022-2023.pdf':
        #continue
        page_numbers = '3'
        export_name = 'data/NPP2022-2023.csv'
    if file == 'data/CPI-M2022-2023.pdf':
        #continue
        page_numbers = '4-13'
        export_name = 'data/CPI-M2022-2023.csv'
    if file == 'data/INC2022-2023.pdf':
        #continue
        page_numbers = '2-49'
        export_name = 'data/INC2022-2023.csv'
    if file == 'data/INC2013-2014.pdf':
        page_numbers = '2-40'
        export_name = 'data/INC2013-2014.csv'
    if file == 'data/CPI-M2013-2014.pdf': 
        #continue
        page_numbers = '3-7'
        export_name = 'data/CPI-M2013-2014.csv'
    if file == 'data/NCP2013-2014.pdf': #this file is currently giving an error
        #continue
        page_numbers = '2, 3'
        export_name = 'data/NCP2013-2014.csv'
    if file == 'data/BJP2013-2014.pdf': #this file is currently giving an error
        page_numbers = '2-90'
        export_name = 'data/BJPM2013-2014.csv'
    if file == 'data/CPI2013-2014.pdf':
        #continue
        page_numbers = '3-7'
        export_name = 'data/CPI2013-2014.csv'
        # Combine tables into a single DataFrame
    combined_df = None
    filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), file)
    print(file)
    tables = camelot.read_pdf(filename, pages = page_numbers)
    print(tables)
    print("len", len(tables))
    combined_dfs = [table.df for table in tables]
    combined_df = pd.concat(combined_dfs, ignore_index=True)
    

    # Save combined DataFrame to a CSV file
    combined_df.to_csv(export_name, index=False)
    
    #tables.export(export_name, f='csv', compress=False)
    print("success")