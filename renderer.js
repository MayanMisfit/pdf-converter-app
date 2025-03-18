document.getElementById('convertButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length === 0) {
    alert('Please select a PDF file to convert.');
    return;
  }

  const filePath = fileInput.files[0].path;
  try {
    const textContent = await window.electron.convertPdf(filePath);
    document.getElementById('output').textContent = textContent;
  } catch (error) {
    console.error('Error converting PDF:', error);
    alert('An error occurred while converting the PDF.');
  }
});
