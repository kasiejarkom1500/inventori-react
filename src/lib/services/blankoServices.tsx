import { Blanko, DataItem, Desc } from "@/components/Blanko";
import { PDFViewer } from "@react-pdf/renderer";
import ReactDOM from "react-dom";



export const generateBlanko = ({letterData,letterDesc} : {letterData : DataItem[], letterDesc: Desc}) => {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Preview PDF</title>
        </head>
        <body style="margin:0;padding:0;">
          <div id="pdf-viewer" style="width:100vw;height:100vh;"></div>
        </body>
      </html>
    `);

    const container = newWindow.document.getElementById('pdf-viewer');
    if (container) {
      const root = newWindow.document.createElement('div');
      root.style.width = '100%';
      root.style.height = '100%';
      container.appendChild(root);

      ReactDOM.render(
        <PDFViewer width='100%' height='100%'>
          <Blanko data={letterData} desc={letterDesc}/>
        </PDFViewer>,
        root
      );
    }
  }
};