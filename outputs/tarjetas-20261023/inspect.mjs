import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load('assets/Dando Jugo Tarjetas.xlsx'));
console.log((await wb.inspect({kind:'workbook,sheet,table',maxChars:4500,tableMaxRows:2,tableMaxCols:5})).ndjson);
console.log(wb.help('*',{search:'deleteColumns|removeColumns|columns.delete|table.resize',include:'index,examples,notes',maxChars:4200}).ndjson);
const img=await wb.render({sheetName:'Jugo',range:'B1:H4',scale:1,format:'png'});
await fs.writeFile('outputs/tarjetas-20261023/before.png',new Uint8Array(await img.arrayBuffer()));

