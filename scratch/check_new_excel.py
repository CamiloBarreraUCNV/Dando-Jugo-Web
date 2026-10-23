import zipfile
import xml.etree.ElementTree as ET
import json

wb_path = 'assets/Dando Jugo Tarjetas.xlsx'
with zipfile.ZipFile(wb_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in ss_root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)

    wb_root = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = wb_root.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheets')
    rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_map = {r.attrib['Id']: r.attrib['Target'] for r in rels_root}

    for s in sheets:
        s_name = s.attrib['name']
        r_id = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        target = rel_map[r_id]
        sheet_path = 'xl/' + target if not target.startswith('xl/') else target
        sheet_root = ET.fromstring(z.read(sheet_path))
        rows = sheet_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
        
        valid_rows = []
        for r in rows:
            row_dict = {}
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                ref = c.attrib.get('r', '')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                t = c.attrib.get('t')
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if t == 's' and val.isdigit():
                    val = shared_strings[int(val)]
                row_dict[col] = val
            if any(str(v).strip() for v in row_dict.values()):
                valid_rows.append(row_dict)
                
        print(f"Sheet: '{s_name}' -> Total filas con datos: {len(valid_rows)}")
        if valid_rows:
            print("   Header:", list(valid_rows[0].values())[:10])
            if len(valid_rows) > 1:
                print("   Fila 1:", list(valid_rows[1].values())[:6])
                print("   Fila última:", list(valid_rows[-1].values())[:6])
        print("-" * 50)
