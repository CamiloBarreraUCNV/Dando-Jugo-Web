import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const d='outputs/tarjetas-20261023';
const source=await SpreadsheetFile.importXlsx(await FileBlob.load('assets/Dando Jugo Tarjetas.xlsx'));
const w=await SpreadsheetFile.importXlsx(await FileBlob.load(`${d}/Dando Jugo Tarjetas.xlsx`));
const changes=JSON.parse(await fs.readFile(`${d}/changes.json`,'utf8'));
let count=0;
for(let i=0;i<8;i++){
 const s=source.worksheets.getItemAt(i),t=w.worksheets.getItemAt(i);const a=s.getUsedRange().values;
 for(let r=0;r<a.length;r++)for(let c=0;c<a[r].length;c++){
  const addr=String.fromCharCode(65+c)+(r+1);if(['Minijuegos','Jugo'].includes(s.name)&&c===5)continue;
  const tc=['Minijuegos','Jugo'].includes(s.name)&&c>5?c-1:c;
  const expected=Object.hasOwn(changes[s.name]??{},addr)?changes[s.name][addr]:a[r][c];
  const actual=t.getCell(r,tc).values[0][0];
  if((expected??null)!==(actual??null))throw Error(`${s.name}!${addr} differs: ${expected} vs ${actual}`);count++;
 }
}
for(const name of ['Minijuegos','Jugo'])if(w.worksheets.getItem(name).getRange('F1:G1').values[0].join('|')!=='Aprobación Diego|Observacion')throw Error('Column shift failed');
console.log(`Verified ${count} cells against original and requested changes.`);
for(const [name,range] of [['Trivia','B1:E5'],['Minijuegos','D1:G8'],['Jugo','D1:G8'],['Hoja 7','D21:D27']]){
 const img=await w.render({sheetName:name,range,scale:1.5,format:'png'});
 await fs.writeFile(`${d}/after-${name}.png`,new Uint8Array(await img.arrayBuffer()));
}
console.log((await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:5},maxChars:800})).ndjson);
