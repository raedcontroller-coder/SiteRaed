import { NextResponse } from 'next/server';
import { mdToPdf } from 'md-to-pdf';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { markdown } = await req.json();

        const assetsDir = path.join(process.cwd(), 'public', 'assets', 'propostas');
        
        let logoImg = '';
        const logoSvgPath = path.join(assetsDir, 'logo.svg');
        if (fs.existsSync(logoSvgPath)) {
            const logoData = fs.readFileSync(logoSvgPath).toString('base64');
            logoImg = `<img src="data:image/svg+xml;base64,${logoData}" style="height: 30px;" />`;
        } else {
            logoImg = `<span style="font-family: Aptos; font-weight: bold; font-size: 14px; color: #000;">[RAED LOGO]</span>`;
        }

        const headerTemplate = `
            <div style="width: 100%; font-size: 10px; padding-right: 40px; padding-top: 10px; display: flex; justify-content: flex-end; align-items: center;">
                ${logoImg}
            </div>
        `;
        
        const footerTemplate = `
            <div style="width: 100%; font-size: 10px; font-family: 'Aptos', sans-serif; padding-bottom: 10px; text-align: center; color: #666;">
                raed.world
            </div>
        `;

        const pdfContent = await mdToPdf(
            { content: markdown }, 
            { 
                stylesheet: [path.join(assetsDir, 'estilo_proposta.css')],
                pdf_options: { 
                    format: 'A4',
                    margin: { top: '80px', bottom: '60px', left: '20mm', right: '20mm' },
                    printBackground: true,
                    displayHeaderFooter: true,
                    headerTemplate: headerTemplate,
                    footerTemplate: footerTemplate
                }
            }
        );

        const capaPath = path.join(assetsDir, 'capa.pdf');
        let finalPdfBytes = pdfContent.content;

        if (fs.existsSync(capaPath)) {
            const finalPdfDoc = await PDFDocument.create();
            const capaPdfDoc = await PDFDocument.load(fs.readFileSync(capaPath));
            const [capaPage] = await finalPdfDoc.copyPages(capaPdfDoc, [0]);
            finalPdfDoc.addPage(capaPage);
            
            const contentPdfDoc = await PDFDocument.load(pdfContent.content);
            const contentPageIndices = contentPdfDoc.getPageIndices();
            const contentPages = await finalPdfDoc.copyPages(contentPdfDoc, contentPageIndices);
            contentPages.forEach((page) => finalPdfDoc.addPage(page));
            
            finalPdfBytes = await finalPdfDoc.save();
        }

        return new NextResponse(finalPdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Proposta_Final.pdf"`
            }
        });

    } catch (error) {
        console.error("Erro na rota de exportação PDF:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
