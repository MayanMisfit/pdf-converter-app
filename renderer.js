// Use the exposed API from preload.js
const pdfInput = document.getElementById('pdfInput');
const convertBtn = document.getElementById('convertBtn');
const textOutput = document.getElementById('textOutput');
const saveTxtBtn = document.getElementById('saveTxtBtn');
const saveMdBtn = document.getElementById('saveMdBtn');
const resetBtn = document.getElementById('resetBtn');

convertBtn.addEventListener('click', async () => {
  if (!pdfInput.files || pdfInput.files.length === 0) {
    alert("Please select a PDF file.");
    return;
  }
  const filePath = pdfInput.files[0].path;
  try {
    const text = await window.electronAPI.convertPDF(filePath);
    textOutput.textContent = text;
  } catch (error) {
    console.error("Error during PDF conversion: ", error);
    textOutput.textContent = "Error during conversion. Check the console for details.";
  }
});

saveTxtBtn.addEventListener('click', async () => {
  const content = textOutput.textContent;
  if (!content) {
    alert("There is no converted text to save.");
    return;
  }
  try {
    const result = await window.electronAPI.saveTxt(content);
    if (result.success) {
      alert("TXT file saved successfully!");
    } else {
      alert("File save cancelled or failed.");
    }
  } catch (error) {
    console.error("Error saving TXT file:", error);
    alert("Error saving TXT file. See console for details.");
  }
});

saveMdBtn.addEventListener('click', async () => {
  const content = textOutput.textContent;
  if (!content) {
    alert("There is no converted text to save.");
    return;
  }
  // Wrap text in a Markdown code block for formatting.
  const mdContent = "```\n" + content + "\n```";
  try {
    const result = await window.electronAPI.saveMd(mdContent);
    if (result.success) {
      alert("Markdown file saved successfully!");
    } else {
      alert("File save cancelled or failed.");
    }
  } catch (error) {
    console.error("Error saving Markdown file:", error);
    alert("Error saving Markdown file. See console for details.");
  }
});

resetBtn.addEventListener('click', () => {
  // Clear the file input by resetting its value.
  pdfInput.value = "";
  // Clear the converted text.
  textOutput.textContent = "";
});