const multer = require("multer")
const path = require("path");
const fs = require("fs")
const fileModule = require("../models/file")
const xlsx = require('xlsx');
const WebSocket = require('ws');


const uploadFile1 = async function(req,res){

let fileName = req.file.filename;
let data = await fileModule.create({fileName:fileName});
if(data)
res.status(201).send({status:true,message:"success"})

}
//....................................................

const readFile1 = async function(req,res){

  let fileName = req.body.fileName;
  let data = await fileModule.findOne({fileName:fileName});

  if(data){
  filePath1 = path.join(__dirname, '..', 'uploads', fileName);
  const workbook = xlsx.readFile(filePath1);
  const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  res.json(sheetData);

  }

}

//....................................................

const readFile3 = async function(req,res){

 let fileName = req.body.fileName;

 let data = await fileModule.findOne({fileName:fileName});

 filePath1 = path.join(__dirname, '..', 'uploads', fileName);

  const workbook = xlsx.readFile(filePath1);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
 
  const range = xlsx.utils.decode_range(worksheet['!ref']);
  const chunkSize = 1024; // Number of rows per chunk

  for (let row = range.s.r; row <= range.e.r; row += chunkSize) {
    const chunk = [];
    for (let i = row; i < row + chunkSize && i <= range.e.r; i++) {
      const rowObject = xlsx.utils.sheet_to_json(worksheet, { range: i });
      chunk.push(rowObject);
    }
    // Process the chunk as needed (e.g., save to a database, perform calculations)
    res.status(200).send({status:true,message: chunk})
  }

}

//..................................................

const readFileWithStreamBuffer = async function(req,res){

  let fileName = req.body.fileName;

  let data = await fileModule.findOne({fileName:fileName});
  if(!data){
    return res.status(400).send({status:false,message:"no such file exists"});
  }
  const filePath = path.join(__dirname, '..', 'uploads', fileName);;
const bufferSize = 64 * 1024; // 64 KB buffer size (adjust as needed)

const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
// Create a read stream to read the Excel file in chunks
const readStream = fs.createReadStream(filePath, { highWaterMark: bufferSize });

// Initialize variables to store buffer data
let buffer = Buffer.alloc(0);
let chunks = [];
readStream.on('data', chunk => {
  // Concatenate the new chunk with the existing buffer
  buffer = Buffer.concat([buffer, chunk]);

  // Process complete rows in the buffer
  while (buffer.length >= bufferSize) {
    const chunkBuffer = buffer.slice(0, bufferSize);
    buffer = buffer.slice(bufferSize);

    // Convert the buffer to a workbook using xlsx.read
    const partialWorkbook = xlsx.read(chunkBuffer, { type: 'buffer' });
    const partialSheet = partialWorkbook.Sheets[sheetName];

    // Process rows from the partial sheet
    const rows = xlsx.utils.sheet_to_json(partialSheet, { header: 1 });
    console.log(rows)
    chunks.push(rows);
    // Process rows as needed...

  }
});

readStream.on('end', () => {
  // Process any remaining data in the buffer
  if (buffer.length > 0) {
    const remainingWorkbook = xlsx.read(buffer, { type: 'buffer' });
    const remainingSheet = remainingWorkbook.Sheets[sheetName];
    const remainingRows = xlsx.utils.sheet_to_json(remainingSheet, { header: 1 });
    console.log(remainingRows)
    chunks.push(remainingRows);
    // Process remaining rows as needed...
  }
});
return res.status(200).send({status:true,message:chunks})
readStream.on('error', err => {
  console.error('Error reading the file:', err);
});
}

const binanceApiSocketIo = async function(req,res){
  
  const BINANCE_WS_BASE_URL = 'wss://stream.binance.com:9443/ws';

  let symbol = 'btcusdt';
  const socket = new WebSocket(`${BINANCE_WS_BASE_URL}/${symbol.toLowerCase()}@trade`);

  socket.on('message', (data) => {
  const tradeData = JSON.parse(data);

   console.log('Real-time trade data:', tradeData);
      // Handle trade data as needed
  });


  socket.on('close', () => {
      console.log(`WebSocket connection closed for ${symbol}`);
  });

}

//...................................................

module.exports = {uploadFile1,readFile1,readFile3,binanceApiSocketIo,readFileWithStreamBuffer}


