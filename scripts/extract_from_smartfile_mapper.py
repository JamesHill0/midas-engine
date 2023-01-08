import os
import re

import uuid
import base64
from xml.etree import ElementTree
from env import Env

class ExtractSmartFileMapper():
    def __init__(self, download_pdf):
        self.download_pdf = download_pdf

    # download pdf to local directory
    def __downloader(self, name, response):
        e = Env()
        # self.logger.info(name, 'retrieving pdf file')
        file_content = base64.b64decode(response['body'])
        ctr = 1
        response_id = response['id'] + '_' + str(ctr)

        response_id = re.sub(r"[-()\"#/@;:<>{}`+=~|.!?,]", "_", response_id)
        filename = e.downloads_location() + '/pdf/' + response_id + '.pdf'
        while os.path.exists(filename):
            ctr = ctr + 1
            response_id = response['id']
            response_id = re.sub(r"[-()\"#/@;:<>{}`+=~|.!?,]", "_", response_id)
            response_id = response_id + '_' + str(ctr)
            filename = e.downloads_location() + '/pdf/' + response_id + '.pdf'

        with open(filename, 'wb') as out:
            out.write(file_content)
        # self.logger.info(name, 'response id # ' + response_id + ' successfully retrieved pdf file')
        return response_id

    # maps data from xml raw to dict
    def __mapper(self, name, root):
        result = dict()
        for child in root:
            if child.tag == 'DataItems':
                for data_items in child:
                    if len(data_items) == 2:
                        result[data_items[0].text] = data_items[1].text
                    elif len(data_items) == 1:
                        result[data_items[0].text] = ''
            elif child.tag == 'PDFList' and self.download_pdf == True:
                pdflists = []
                for pdfs in child:
                    pdflist = dict()
                    for pdf in pdfs:
                        if pdf.tag == 'PDFData':
                            pdf_id = pdflist['FormName'] + '_' + pdflist['FormNumber']
                            pdf_id = self.__downloader(name, {
                                'id': pdf_id,
                                'body': pdf.text
                            })
                            pdflist['generated_id'] = pdf_id
                            continue

                        pdflist[pdf.tag] = pdf.text
                        pdflists.append(pdflist)
                        result['pdf'] = pdflists
            else:
                result[child.tag] = child.text

        return result

    def to_json(self, name, raw):
        raw.decode_content = True
        tree = ElementTree.parse(raw)
        root = tree.getroot()

        return self.__mapper(name, root)
