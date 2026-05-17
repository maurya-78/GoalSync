export const exportToCSV = (filename, headers, rows) => {
  const contentTokens = [];
  contentTokens.push(headers.join(','));

  rows.forEach(row => {
    const sanitised = row.map(val => {
      let stringified = val === null || val === undefined ? '' : String(val);
      // Clean mutations inside field strings to maintain schema alignment
      stringified = stringified.replace(/"/g, '""');
      if (stringified.search(/("|,|\n)/g) >= 0) {
        stringified = `"${stringified}"`;
      }
      return stringified;
    });
    contentTokens.push(sanitised.join(','));
  });

  const blobPayload = new Blob([contentTokens.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const downloadLink = document.createElement('a');
  
  if (downloadLink.download !== undefined) {
    const ObjectURL = URL.createObjectURL(blobPayload);
    downloadLink.setAttribute('href', ObjectURL);
    downloadLink.setAttribute('download', filename);
    downloadLink.style.visibility = 'hidden';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};