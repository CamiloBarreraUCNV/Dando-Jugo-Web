from lxml import etree as E
import zipfile,json,re,copy,math,pathlib
base=pathlib.Path('outputs/tarjetas-20261023'); original=zipfile.ZipFile('assets/Dando Jugo Tarjetas.xlsx'); authored=zipfile.ZipFile(base/'authored.xlsx')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}; N='{'+ns['m']+'}'
changes=json.load(open(base/'changes.json',encoding='utf8')); names=['Trivia','Minijuegos','Jugo','Hoja 7']
shared=[]
if 'xl/sharedStrings.xml' in authored.namelist():
 for si in E.fromstring(authored.read('xl/sharedStrings.xml')): shared.append(''.join(si.itertext()))
styles=E.fromstring(original.read('xl/styles.xml')); xfs=styles.find('m:cellXfs',ns); cache={}
def wrapped(style):
 if style not in cache:
  x=copy.deepcopy(xfs[int(style)]);a=x.find('m:alignment',ns)
  if a is None:a=E.SubElement(x,N+'alignment')
  a.set('wrapText','1');a.set('vertical','top');x.set('applyAlignment','1');cache[style]=str(len(xfs));xfs.append(x)
 return cache[style]
def index(col):
 k=0
 for c in col:k=k*26+ord(c)-64
 return k
def col(k):
 out=''
 while k:k,r=divmod(k-1,26);out=chr(65+r)+out
 return out
def shift(s):
 return re.sub(r'(\$?)([A-Z]+)(\$?\d+)',lambda m:m[1]+col(index(m[2])-(index(m[2])>6))+m[3],s)
parts={}
for i,name in enumerate(names,1):
 p=f'xl/worksheets/sheet{i}.xml'; root=E.fromstring(original.read(p)); ar=E.fromstring(authored.read(p));ac={c.get('r'):c for c in ar.findall('.//m:sheetData/m:row/m:c',ns)}
 for addr in changes.get(name,{}):
  rownum=re.search(r'\d+',addr)[0]; row=root.find(f'm:sheetData/m:row[@r="{rownum}"]',ns);c=row.find(f'm:c[@r="{addr}"]',ns)
  if c is None:
   c=E.Element(N+'c',r=addr);row.append(c)
  for child in list(c): c.remove(child)
  src=ac[addr]; typ=src.get('t');c.attrib.pop('t',None)
  if typ=='s':
   c.set('t','inlineStr');is_=E.SubElement(c,N+'is');E.SubElement(is_,N+'t').text=shared[int(src.find('m:v',ns).text)]
  else:
   if typ:c.set('t',typ)
   for child in src:c.append(copy.deepcopy(child))
  if name in ['Jugo','Hoja 7'] and addr.startswith('D'):
   c.set('s',wrapped(c.get('s','0')));txt=changes[name][addr];width=60 if name=='Jugo' else 48
   h=15*math.ceil(len(txt)/(width-4)); row.set('ht',str(max(float(row.get('ht','15')),h)));row.set('customHeight','1')
  ordered=sorted(list(row),key=lambda x:index(re.match('[A-Z]+',x.get('r')).group()));row[:]=ordered
 if name in ['Minijuegos','Jugo']:
  for row in root.findall('m:sheetData/m:row',ns):
   for c in list(row):
    k=index(re.match('[A-Z]+',c.get('r')).group())
    if k==6:row.remove(c)
    elif k>6:c.set('r',shift(c.get('r')))
   if row.get('spans'):row.attrib.pop('spans')
  for x in root.iter():
   for a in ['ref','sqref','activeCell','topLeftCell']:
    if x.get(a):x.set(a,shift(x.get(a)))
  cols=root.find('m:cols',ns)
  if cols is not None:
   for c in list(cols):
    lo,hi=int(c.get('min')),int(c.get('max'))
    if lo==hi==6:cols.remove(c);continue
    c.set('min',str(lo-(lo>6)));c.set('max',str(hi-(hi>=6)))
 if name in ['Jugo','Hoja 7']:
  cols=root.find('m:cols',ns)
  if cols is None:raise ValueError('Missing source cols')
  for c in list(cols):
   if int(c.get('min'))<=4<=int(c.get('max')):cols.remove(c)
  E.SubElement(cols,N+'col',min='4',max='4',width='60' if name=='Jugo' else '48',customWidth='1')
  cols[:]=sorted(list(cols),key=lambda c:int(c.get('min')))
 parts[p]=E.tostring(root,encoding='UTF-8',xml_declaration=True,standalone=True)
xfs.set('count',str(len(xfs)));parts['xl/styles.xml']=E.tostring(styles,encoding='UTF-8',xml_declaration=True,standalone=True)
out=base/'Dando Jugo Tarjetas.xlsx'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for entry in original.infolist():z.writestr(copy.copy(entry),parts.get(entry.filename,original.read(entry.filename)))
# Preservation: every unrelated package part is byte-identical.
with zipfile.ZipFile(out) as z:
 assert all(z.read(p)==original.read(p) for p in original.namelist() if p not in parts)
 for p in z.namelist():
  if p.endswith('.xml'):E.fromstring(z.read(p))
print('Saved',out,'; preserved all unrelated workbook parts. Changed cells:',{k:len(v) for k,v in changes.items()})

