import { Injectable } from '@angular/core';
//@ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
//@ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { CanavasService } from './canavas.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private canvas_service: CanavasService) { }


  setTitle(logo: any, title: string, page: any, pageSize: string): any {
    // let companyDetail = '';
    let margin;
    let fontSize;

    if (pageSize === 'A6') {
      margin = [15, 10, 0, 10];
      fontSize = 8;
    } else {
      margin = [15, 10, 0, 10];
      fontSize = 10;
    }

    return [
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            [{
              image: logo,
              width: 60,
              height: 30,
            }],
            [{ text: title, fontSize, margin: [100, -20, 0, 0] }],
          ],
        },
        layout: 'noBorders',
      },

    ];
  }

  /**  Method for creating PDF table header */
  createTableHeader(header: string[]): any {
    // const pageHeader = { fila_0: {} };
    // header.forEach((attribute, i) => {
    //   pageHeader.fila_0['col_' + (+i + 1)] = { text: attribute, style: 'tableHeader', margin: [0, 8, 0, 0] };
    // });
    // return pageHeader;
  }
}
