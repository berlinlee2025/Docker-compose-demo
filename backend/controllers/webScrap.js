const { printDateTime } = require('../util/printDateTime');
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');
const puppeteer = require('puppeteer');

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

// create / route as an Actuactor for health-checks
exports.saveHtml = async (req, res, next) => {
    printDateTime();

    const requestHandlerName = `rootDir/controllers/webScrap.js\nsaveHtml`;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { htmlContent } = req.body;
    console.log(`${requestHandlerName}\nreq.headers:\n`, req.headers, `\n`);

    const callbackName = `saveHtml`;
        
    const start = performance.now();

    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);
    console.log(`\nreq.body.htmlContent:\n`, htmlContent, `\n`);

    // JWT Authorization checks
    if (!req.headers.authorization) {
        return res.status(403).json({
          success: false, 
          status: { code: 403 },
          message: `Unauthorized`
        })
    }

    try {
        const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename
        
        // Define path for saving PDF to Node server
        const pdfPath = path.join(__dirname, '..', 'user-pdf', `output_${date}.pdf`);

        const browser = await puppeteer.launch({
            headless: true,
            /* Docker compose code */
            defaultViewport: null,
            executablePath: '/usr/bin/chromium',
            /* Docker compose code */
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Optional: this overcomes limited resource problems
                '--single-process' // Optional: run the browser process in a single process
            ] // Ensure Puppeteer runs in a safe environment if using Docker or any Linux-based server.
        }); 

        const page = await browser.newPage();
        await page.setContent(htmlContent);
        // await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            // landscape: true, 
            landscape: false, 
            printBackground: true 
        });       
            
        console.log(`\nSaving PDF to: ${pdfPath}\n`);
        console.log(`\nGenerated PDF size:\n${pdfBuffer.length/1024} kb\n`);
            
        // Write PDF to a .pdf file in Node server
        await fs.writeFile(pdfPath, pdfBuffer);
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(pdfPath)}"`);

        // Send the file
        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error(`\nFailed to send back file to browser: `, err, `\n`);
                // Send JSON res if there's an error sending the file back to browser
                if (!res.headerSent) {
                    res.status(500).json({
                        status: { code: 500 },
                        message: `Failed to send PDF file`
                    });
                }
            } else {
                const end = performance.now();
                const duration = end - start;
                console.log(`\nFile sent back to frontend browser successfully\nPerformance:\n${duration}ms\n`);
            }
        });

    } catch (err) {
        console.error(`\nError generating PDF: `, err, `\n`);
        if (!res.headerSent) {
            res.status(500).json({ 
                status: { code: 500 }, 
                error: `Error generating PDF: ${err}` 
            });
        }
    }
};
