import os
import camelot

filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data/BJP202-2023.pdf")
tables = camelot.read_pdf(filename, pages = '1,2')
print(tables[0])
