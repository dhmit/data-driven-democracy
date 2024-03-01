import camelot
import ghostscript
#from camelot import read_pdf
tables = camelot.read_pdf('/Users/akshayaseetharam/Documents/GitHub/data-driven-democracy/backend/app/data/BJP202-2023.pdf', pages = '1,2')
print(tables[0])
