import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const dir='outputs/tarjetas-20261023';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load('assets/Dando Jugo Tarjetas.xlsx'));
const trivia=[4,8,9,2,4,1,2,4,3,6,3,6,6,2,4,5,7,4,3,4,4,6,4,6,2,2,3,2,6,5,2,2,5,4,6,4,6,6,7,2,3,2,6,1,3,5,2,2,4,5,8,5,7,4,3,1,5,2,4,3,1,1,3,3,2,2,4,2,2,4,2,5,5,4,3,3,4,6,5,5,7,2,7,4,5,4,6,6,6,6,4,6,2,4,5,5,2,4,7,2];
const mini=[2,1,4,2,6,2,4,4,2,4,4,2,5,3,3,5,7,3,7,2,3,4,7,6,1,2,4,8,7,5,3,5,5,3,3,2,5,2,5,2,7,2,3,5,6,3,3,4,5,4,8,4,4,7,6,3,8,6,7,8,7,9,3,5,5,6,5,7,6,2,3,6,5,2,7,5,7,7,4,5,6,4,5,4,null,null,4,6,2,2,4,3,5,4,4,3,4,3,4,4];
const jugo=[2,5,4,5,3,3,4,3,3,7,4,2,8,6,8,7,6,7,7,5,5,4,6,4,2,2,2,8,4,5,3,8,6,4,5,3,6,2,9,6];
const punish=[
'Bebe # sorbo si no limpias el lugar.',
'Bebe % sorbos si rechazas el reto; $ sorbos por cada incumplimiento durante la ronda.',
'Bebe $ sorbos si no completas el baile.',
'Bebe $ sorbos cada vez que rompas la pose durante la ronda.',
'Bebe # sorbo cada vez que olvides terminar la frase en "crotolamo".',
'Bebe # sorbo cada vez que olvides terminar la frase en "abogado".',
'Bebe # sorbo cada vez que olvides terminar la frase en "Más me crece".',
'Bebe # sorbo cada vez que olvides terminar la frase en "y solo soy un niño".',
'Bebe # sorbo cada vez que olvides pararte y aplaudir.',
'Bebe $ sorbos si no realizas el reto o nadie acepta.',
'Bebe $ sorbos si no cantas durante todo el tiempo indicado.',
'Bebe # sorbo si no dejas el calcetín o lo retiras antes de terminar la ronda.',
'Bebe & sorbos si no completas la postura durante el tiempo indicado.',
'Bebe % sorbos si no realizas el reto o nadie acepta.',
'Bebe & sorbos si no completas las sentadillas o nadie acepta.',
'Bebe % sorbos si rechazas el reto; $ sorbos cada vez que uses las manos.',
'Bebe % sorbos si no completas el tiempo indicado.',
'Bebe & sorbos si rechazas el reto o te lavas antes de terminar.',
'Bebe & sorbos si no completas el baile.',
'Bebe $ sorbos cada vez que olvides gritar al terminar de hablar.',
'Bebe $ sorbos cada vez que hables durante la ronda.',
'Bebe $ sorbos cada vez que hables con alguien sin abrazarlo antes.',
'Bebe % sorbos si no envías la foto o no muestras la respuesta.',
'Bebe $ sorbos si al terminar la ronda te falta fotografiar a algún jugador.',
'Bebe # sorbo cada vez que bebas sin simular la selfie.',
'Bebe # sorbo si no tomas el control de la música o pones música de otro tipo.',
'Bebe # sorbo si no mantienes la canción en repetición durante la ronda.',
'Bebe & sorbos si rechazas el reto; $ sorbos cada vez que hables sin rimar.',
'Bebe $ sorbos cada vez que tomes algo sin que te lo hayan ofrecido.',
'Bebe % sorbos si rechazas el reto o nadie acepta ayudarte; $ sorbos cada vez que comas o bebas por tu cuenta.',
'Bebe # sorbo cada vez que intentes conseguir una respuesta durante la ronda.',
'Bebe & sorbos si rechazas el reto; $ sorbos cada vez que uses una consonante.',
'Bebe % sorbos si decides no realizar el reto o lo interrumpes.',
'Bebe $ sorbos cada vez que hables sin voz de pirata.',
'Bebe $ sorbos cada vez que olvides simular la arcada al hablar.',
'Bebe # sorbo cada vez que olvides decir "Que bueno mi niño".',
'Bebe % sorbos si no realizas el reto o no hay otro jugador con el mismo licor.',
'Bebe # sorbo si no mantienes el partido en repetición durante la ronda.',
'Bebe / sorbos si no completas el texto.',
'Bebe % sorbos si no pones la música o no realizas la interpretación.'
];
const retos=[
'Bebe 1 sorbo por cada vez que uses la mano equivocada.',
'Bebe 3 sorbos si te equivocas al repetir la historia o no logras continuarla.',
'Da tu discurso de asunción usando una cuchara como micrófono durante 10 segundos.',
'Bebe 1 sorbo cada vez que olvides acompañar al jugador elegido.',
'Defiéndete ante el jurado con voz de abogado de teleserie durante 10 segundos.',
'Bebe 3 sorbos cada vez que respondas "sí" o "no" durante la ronda.',
'Bebe 3 sorbos si no realizas el reto o nadie acepta.',
'Bebe 3 sorbos si no realizas el reto.',
'Bebe 1 sorbo de forma normal si no realizas el reto.',
'Bebe 1 sorbo cada vez que te rías.',
'Bebe 4 sorbos si no completas el tiempo indicado o nadie acepta participar.',
'Bebe 3 sorbos si no completas el reto.',
'Bebe 1 sorbo por cada derrota en el torneo.',
'Bebe 5 sorbos si decides no aceptar la donación.',
'Bebe 5 sorbos si nadie se ríe del chiste.',
'Bebe 3 sorbos si se demuestra que tu respuesta o tu acusación era incorrecta.',
'Pide perdón al vaso con voz de villano arrepentido durante 10 segundos.',
'Presenta la bebida como sommelier de juguito en caja durante 10 segundos.',
'Bebe 3 sorbos si te equivocas al repetir la historia o no logras continuarla.',
'Bebe 3 sorbos si te equivocas con los números o la frase de los limones.'
];
const changes={};
function write(name,addr,values){wb.worksheets.getItem(name).getRange(addr).values=values; changes[name]??={}; const col=addr.match(/^[A-Z]+/)[0],start=Number(addr.match(/\d+/)[0]); values.forEach((v,i)=>changes[name][`${col}${start+i}`]=v[0]);}
write('Trivia','D2:D101',trivia.map(x=>[x]));
const ms=wb.worksheets.getItem('Minijuegos');
for(let r=2;r<=101;r++){const id=ms.getRange(`A${r}`).values[0][0];if(mini[id-1]!==null)write('Minijuegos',`E${r}`,[[mini[id-1]]]);}
write('Jugo','E2:E41',jugo.map(x=>[x]));write('Jugo','D2:D41',punish.map(x=>[x]));write('Hoja 7','D22:D41',retos.map(x=>[x]));
wb.recalculate();
for(const name of ['Trivia','Minijuegos','Jugo','Hoja 7']) console.log((await wb.inspect({kind:'table',range:`'${name}'!A20:E24`,tableMaxRows:5,tableMaxCols:5,maxChars:1400})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:10},maxChars:1000})).ndjson);
await fs.writeFile(`${dir}/changes.json`,JSON.stringify(changes,null,2));
await (await SpreadsheetFile.exportXlsx(wb)).save(`${dir}/authored.xlsx`);
