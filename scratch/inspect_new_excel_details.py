import zipfile
import xml.etree.ElementTree as ET

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

    def get_sheet_rows(name):
        for s in sheets:
            if s.attrib['name'] == name:
                r_id = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
                target = rel_map[r_id]
                sheet_path = 'xl/' + target if not target.startswith('xl/') else target
                sheet_root = ET.fromstring(z.read(sheet_path))
                rows = sheet_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
                data = []
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
                        data.append(row_dict)
                return data
        return []

    print("=== DANDO JUGO (MODOS) ===")
    for row in get_sheet_rows('Dando Jugo'):
        print(row)

    print("\n=== MINIJUEGOS COLUMNS ===")
    mj = get_sheet_rows('Minijuegos')
    print("Row 0:", mj[0])
    print("Row 1:", mj[1])
    print("Row 2:", mj[2])
    print("Row 100:", mj[100] if len(mj) > 100 else "N/A")

    print("\n=== JUGO COLUMNS ===")
    jg = get_sheet_rows('Jugo')
    print("Row 0:", jg[0])
    print("Row 1:", jg[1])
    print(f"Total non-empty in Jugo: {len(jg)}")
    for idx, r in enumerate(jg[35:]):
        print(f"  Row {35+idx}:", r)

    print("\n=== TRIVIA COLUMNS ===")
    tr = get_sheet_rows('Trivia')
    print("Row 0:", tr[0])
    print("Row 1:", tr[1])
    print("Row 2:", tr[2])

    print("\n=== HOJA 7 COLUMNS ===")
    h7 = get_sheet_rows('Hoja 7')
    print("Row 0:", h7[0])
    print("Row 1:", h7[1])
