const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:/Banco de Prompts/pagina_de_vendas_prompts_magneticos.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('C:/Banco de Prompts/pdf_extracted.txt', data.text);
    console.log("PDF extraction successful!");
}).catch(function (error) {
    console.error("Error reading PDF:", error);
});
