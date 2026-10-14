// pptx_parser.js
const AdmZip = require('adm-zip');

/**
 * Parses a PPTX file buffer or path and extracts structured slide information.
 */
function parsePptx(fileInput) {
  try {
    const zip = new AdmZip(fileInput);
    const zipEntries = zip.getEntries();

    // Find all slide entries
    const slideEntries = zipEntries
      .filter(entry => /^ppt\/slides\/slide\d+\.xml$/i.test(entry.entryName))
      .sort((a, b) => {
        const numA = parseInt(a.entryName.match(/slide(\d+)\.xml/i)[1], 10);
        const numB = parseInt(b.entryName.match(/slide(\d+)\.xml/i)[1], 10);
        return numA - numB;
      });

    // Find notes entries
    const notesMap = {};
    zipEntries.forEach(entry => {
      const match = entry.entryName.match(/ppt\/notesSlides\/notesSlide(\d+)\.xml/i);
      if (match) {
        const slideNum = parseInt(match[1], 10);
        const xml = entry.getData().toString('utf8');
        const textTokens = extractTextFromXml(xml);
        notesMap[slideNum] = textTokens.join(' ');
      }
    });

    const slides = [];
    let combinedText = '';

    slideEntries.forEach((entry, idx) => {
      const slideNum = idx + 1;
      const xml = entry.getData().toString('utf8');
      
      // Extract title: check shapes with title placeholder or first significant text
      const title = extractSlideTitle(xml) || `Slide ${slideNum}`;
      const textLines = extractTextLinesFromXml(xml);
      
      // Filter out title from content lines if it's the first line
      let contentLines = textLines;
      if (contentLines.length > 0 && contentLines[0].trim() === title.trim()) {
        contentLines = contentLines.slice(1);
      }

      const notes = notesMap[slideNum] || '';

      slides.push({
        slideNumber: slideNum,
        title: title.trim(),
        content: contentLines,
        notes: notes.trim()
      });

      combinedText += `\n[Slide ${slideNum}: ${title}]\n` + contentLines.join('\n') + (notes ? `\nNotes: ${notes}` : '');
    });

    const keywords = extractKeyTerms(combinedText);

    return {
      success: true,
      totalSlides: slides.length,
      slides,
      combinedText: combinedText.trim(),
      keywords
    };
  } catch (error) {
    console.error('Error parsing PPTX:', error);
    return {
      success: false,
      error: error.message,
      slides: [],
      combinedText: '',
      keywords: []
    };
  }
}

function extractTextFromXml(xml) {
  const matches = xml.match(/<a:t[^>]*>(.*?)<\/a:t>/gi) || [];
  return matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 0);
}

function extractTextLinesFromXml(xml) {
  // PPTX paragraphs are wrapped in <a:p>...</a:p>
  const paragraphs = xml.match(/<a:p[^>]*>[\s\S]*?<\/a:p>/gi) || [];
  const lines = [];

  paragraphs.forEach(pXml => {
    const textPieces = pXml.match(/<a:t[^>]*>(.*?)<\/a:t>/gi) || [];
    const fullLine = textPieces.map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
    if (fullLine.length > 0) {
      lines.push(fullLine);
    }
  });

  return lines;
}

function extractSlideTitle(xml) {
  // Look for shape with title placeholder <p:ph type="title"/> or "ctrTitle"
  const titleShapeMatch = xml.match(/<p:sp[^>]*>[\s\S]*?<p:ph[^>]*type="(?:title|ctrTitle)"[\s\S]*?<\/p:sp>/i);
  if (titleShapeMatch) {
    const textPieces = titleShapeMatch[0].match(/<a:t[^>]*>(.*?)<\/a:t>/gi) || [];
    const titleText = textPieces.map(t => t.replace(/<[^>]+>/g, '')).join(' ').trim();
    if (titleText.length > 0) return titleText;
  }

  // Fallback to the first non-empty text
  const allTexts = extractTextLinesFromXml(xml);
  return allTexts.length > 0 ? allTexts[0] : null;
}

function extractKeyTerms(text) {
  const commonStopwords = new Set([
    'the','and','to','of','a','in','is','that','for','it','as','was','with','be','by','at','on','not',
    'this','are','from','or','an','we','which','an','all','slide','slides','notes','page','use','used'
  ]);

  const words = text.match(/\b[A-Za-z0-9_\-\.]{3,30}\b/g) || [];
  const freq = {};

  words.forEach(w => {
    const lower = w.toLowerCase();
    if (!commonStopwords.has(lower) && !/^\d+$/.test(lower)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 25);
}

module.exports = {
  parsePptx
};
